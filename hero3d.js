// Escena 3D del inicio: el logo "Pelotón encadenado" en metal y vidrio, con estelas de luz del pelotón y brillo (bloom).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const canvas = document.getElementById('three');
if (canvas) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.03).texture;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 0, 12);

  // ---- logo ----
  const logo = new THREE.Group(); scene.add(logo);
  const ringGeo = new THREE.TorusGeometry(1.2, 0.24, 64, 200);
  const r1 = new THREE.Mesh(ringGeo, new THREE.MeshPhysicalMaterial({ color: 0x4F534E, metalness: .85, roughness: .28, clearcoat: 1, clearcoatRoughness: .15 }));
  const r2 = new THREE.Mesh(ringGeo, new THREE.MeshPhysicalMaterial({ color: 0xBFC3BB, metalness: .9, roughness: .18, clearcoat: 1 }));
  r1.position.x = -1.5; r2.position.x = 0; r1.rotation.y = .55; r2.rotation.y = -.55;
  const ballMat = new THREE.MeshPhysicalMaterial({ color: 0xCCFF00, emissive: 0xA6D400, emissiveIntensity: .35, roughness: .05, metalness: 0, transmission: .55, thickness: 2, ior: 1.45, clearcoat: 1, iridescence: .3 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.3, 128, 128), ballMat);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.62, 48, 48), new THREE.MeshBasicMaterial({ color: 0xE8FF66 }));
  ball.position.x = core.position.x = 1.85;
  logo.add(r1, r2, ball, core);

  // halo
  const haloTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(204,255,0,.55)'); gr.addColorStop(1, 'rgba(204,255,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.set(7, 7, 1); halo.position.x = 1.85; logo.add(halo);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x223300, .6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0xCCFF00, 30, 14); rim.position.set(3, 1, 3); scene.add(rim);

  // ---- estelas: el pelotón pasando a toda velocidad ----
  const TR = 160, trails = [];
  const trailGeo = new THREE.BoxGeometry(1, .025, .025);
  const trailMat = new THREE.MeshBasicMaterial({ color: 0xCCFF00, transparent: true, opacity: .8 });
  const inst = new THREE.InstancedMesh(trailGeo, trailMat, TR); scene.add(inst);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < TR; i++) trails.push({ x: (Math.random() - .5) * 60, y: (Math.random() - .5) * 18, z: -Math.random() * 30 - 4, l: .6 + Math.random() * 3.2, v: .08 + Math.random() * .25 });
  const white = new THREE.Color(0xF3F1EA), volt = new THREE.Color(0xCCFF00);
  trails.forEach((t, i) => inst.setColorAt(i, Math.random() < .25 ? volt : white));

  // ---- polvo ----
  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i*3] = (Math.random() - .5) * 40; pos[i*3+1] = (Math.random() - .5) * 22; pos[i*3+2] = -Math.random() * 30; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xCCFF00, size: .035, transparent: true, opacity: .5, depthWrite: false }));
  scene.add(dust);

  // ---- postproceso ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .9, .7, .2);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, burst = 0;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sy = Math.min(2, scrollY / innerHeight); }, { passive: true });
  canvas.parentElement.addEventListener('click', e => { if (!e.target.closest('a,button')) burst = 1; });

  let narrow = false;
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix(); narrow = w < 900;
  };
  addEventListener('resize', resize); resize();

  const ink = new THREE.Color(0x0E100E), deep = new THREE.Color(0x367000);
  const theme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    scene.background = new THREE.Color(light ? 0xF6F5EF : 0x090B08);
    renderer.toneMapping = light ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    bloom.enabled = !light; trailMat.opacity = light ? .55 : .8;
    trails.forEach((t, i) => inst.setColorAt(i, (i % 4 === 0) ? (light ? deep : volt) : (light ? ink : white))); inst.instanceColor.needsUpdate = true;
    dust.material.color.set(light ? 0x367000 : 0xCCFF00);
    halo.material.opacity = light ? .5 : 1;
  };
  addEventListener('themechange', theme); theme();

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    mx += (tx - mx) * .06; my += (ty - my) * .06; burst *= .94;
    const baseX = narrow ? 0 : 3.4, baseY = narrow ? 2.2 : .2, sc = narrow ? .6 : 1;
    logo.position.set(baseX - sy * (narrow ? 0 : 1.2), baseY + sy * 1.2, -sy * 3);
    logo.scale.setScalar(sc * (1 + burst * .12));
    if (!reduce) {
      logo.rotation.y = mx * 1.1 + Math.sin(t * .35) * .18 + sy * 1.4;
      logo.rotation.x = my * .7 + sy * .35;
      r1.rotation.z = t * .35 + burst * 4; r2.rotation.z = -t * .35 - burst * 4;
      // al bajar, los eslabones se separan: el equipo abre espacio al ciclista
      r1.position.x = -1.5 - sy * .6; ball.position.x = core.position.x = halo.position.x = 1.85 + sy * .8;
      ball.position.y = core.position.y = halo.position.y = Math.sin(t * 1.5) * .12;
      halo.material.rotation = t * .2;
      const speed = 1 + sy * 3 + burst * 8;
      trails.forEach((tr, i) => {
        tr.x += tr.v * speed; if (tr.x > 32) { tr.x = -32; tr.y = (Math.random() - .5) * 18; }
        dummy.position.set(tr.x, tr.y + Math.sin(t + i) * .05, tr.z);
        dummy.scale.set(tr.l * (1 + sy * 1.5 + burst * 3), 1, 1); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;
      dust.rotation.y = t * .01; dust.position.x = mx * -1;
      camera.position.x = mx * .8; camera.position.y = -my * .5; camera.lookAt(0, 0, 0);
    }
    composer.render();
  })();
}
