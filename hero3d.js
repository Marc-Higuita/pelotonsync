// Inicio 3D: un pelotón de Gregas montando bici. Las ruedas son los aros del logo; Grega es la bola volt.
// Mouse = girar la cámara · clic = sprint · scroll = el pelotón se aleja.
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
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.03).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

  // ---------- materiales ----------
  const M = {
    tire: new THREE.MeshStandardMaterial({ color: 0x1a1c19, roughness: .7 }),
    rim: new THREE.MeshPhysicalMaterial({ color: 0xA9ADA6, metalness: .9, roughness: .25, clearcoat: 1 }),
    rim2: new THREE.MeshPhysicalMaterial({ color: 0x4F534E, metalness: .9, roughness: .3, clearcoat: 1 }),
    line: new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .25 }),
  };
  const frameColors = [0xCCFF00, 0x3FC8E4, 0xFF6A2B, 0x8E6BFF, 0x5BD68A, 0xF3F1EA];
  const frameMat = c => new THREE.MeshPhysicalMaterial({ color: c, metalness: .35, roughness: .25, clearcoat: 1, clearcoatRoughness: .1 });
  const gregaMat = () => new THREE.MeshPhysicalMaterial({ color: 0xCCFF00, emissive: 0x9fcc00, emissiveIntensity: .32, roughness: .06, clearcoat: 1, transmission: .35, thickness: 1.2, ior: 1.4, iridescence: .35 });

  const up = new THREE.Vector3(0, 1, 0);
  const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 12);
  function stick(mat, r) { const m = new THREE.Mesh(cylGeo, mat); m.userData.r = r; m.castShadow = true; return m; }
  function place(m, a, b) {
    const d = new THREE.Vector3().subVectors(b, a), L = d.length();
    m.position.copy(a).addScaledVector(d, .5);
    m.quaternion.setFromUnitVectors(up, d.normalize());
    m.scale.set(m.userData.r, L, m.userData.r);
  }
  const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);

  function wheel(x, alt) {
    const g = new THREE.Group(); g.position.set(x, .55, 0);
    const tire = new THREE.Mesh(new THREE.TorusGeometry(.55, .055, 16, 64), M.tire);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.47, .03, 12, 64), alt ? M.rim2 : M.rim);
    const spokes = new THREE.Group();
    for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.012, .92, .012), M.rim); s.rotation.z = i * Math.PI / 6; spokes.add(s); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .12, 12), M.rim2); hub.rotation.x = Math.PI / 2;
    tire.castShadow = true; g.add(tire, rim, spokes, hub);
    return g;
  }

  // ---------- un ciclista Grega ----------
  function rider(color, leader) {
    const root = new THREE.Group();
    const fm = frameMat(color);
    const RH = V(-.62, .55), BB = V(0, .45), ST = V(-.18, 1.2), HT = V(.5, 1.15), FH = V(.62, .55), HB = V(.58, 1.32);
    const wR = wheel(-.62, true), wF = wheel(.62, false); root.add(wR, wF);
    [[RH, BB], [BB, ST], [ST, HT], [BB, HT], [RH, ST], [HT, FH], [HT, HB]].forEach(([a, b]) => { const s = stick(fm, .035); place(s, a, b); root.add(s); });
    const bar = stick(M.line, .025); place(bar, V(.62, 1.32, -.24), V(.62, 1.32, .24)); root.add(bar);
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(.28, .05, .12), M.line); saddle.position.set(-.2, 1.25, 0); root.add(saddle);
    const body = new THREE.Group(); body.position.set(.05, 1.72, 0); root.add(body);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.42, 48, 48), gregaMat()); ball.castShadow = true; body.add(ball);
    const eyeGeo = new THREE.CapsuleGeometry(.035, .1, 6, 12);
    const eyes = [];
    [-.11, .11].forEach(z => { const e = new THREE.Mesh(eyeGeo, M.eye); e.position.copy(V(.82, .2, z * 2.6).normalize().multiplyScalar(.41)); body.add(e); eyes.push(e); });
    const legs = [0, 1].map(() => [stick(M.line, .022), stick(M.line, .022)]); legs.flat().forEach(s => root.add(s));
    const arms = [0, 1].map(() => stick(M.line, .02)); arms.forEach(s => root.add(s));
    const crank = [stick(M.rim2, .02), stick(M.rim2, .02)]; crank.forEach(s => root.add(s));
    if (leader) { const halo = new THREE.PointLight(0xCCFF00, 4, 3); halo.position.set(.3, 1.8, .4); root.add(halo); }
    return { root, wR, wF, body, eyes, legs, arms, crank, ball, phase: Math.random() * 6 };
  }

  // ---------- pelotón ----------
  const peloton = new THREE.Group(); scene.add(peloton);
  const slots = [[3.1, 0], [1.15, -.6], [1.15, .6], [-.75, 0], [-2.65, -.6], [-2.65, .6]];
  const riders = slots.map((s, i) => { const r = rider(frameColors[i], i === 0); r.base = s; r.root.position.set(s[0], 0, s[1]); peloton.add(r.root); return r; });

  // ---------- carretera ----------
  const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 6), new THREE.MeshStandardMaterial({ color: 0x15180f, roughness: .9 }));
  road.rotation.x = -Math.PI / 2; road.receiveShadow = true; peloton.add(road);
  const dashes = new THREE.Group(); peloton.add(dashes);
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xCCFF00 });
  for (let i = 0; i < 26; i++) { const d = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .06), dashMat); d.rotation.x = -Math.PI / 2; d.position.set(-40 + i * 3.2, .01, 1.6); dashes.add(d); const d2 = d.clone(); d2.position.z = -1.6; dashes.add(d2); }

  // ---------- luces ----------
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334400, .7));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(-4, 9, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 5, bottom: -5 }); scene.add(sun);
  const rim = new THREE.PointLight(0xCCFF00, 18, 14); rim.position.set(5, 3, 3); scene.add(rim);

  // ---------- estelas de viento en los colores de los pilares ----------
  const TR = 90, trails = [];
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, .018, .018), new THREE.MeshBasicMaterial({ transparent: true, opacity: .6, depthWrite: false }), TR);
  scene.add(inst);
  const trailCols = [0xCCFF00, 0x3FC8E4, 0xFF6A2B, 0x8E6BFF, 0xF3F1EA].map(c => new THREE.Color(c));
  for (let i = 0; i < TR; i++) { trails.push({ x: (Math.random() - .5) * 40, y: Math.random() * 6 - .5, z: (Math.random() - .5) * 14 - 3, l: .5 + Math.random() * 2.5, v: .06 + Math.random() * .2 }); inst.setColorAt(i, trailCols[i % trailCols.length]); }
  const dummy = new THREE.Object3D();

  // ---------- postproceso ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .55, .6, .55);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  // ---------- interacción ----------
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, sprint = 0;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sy = Math.min(1.5, scrollY / innerHeight); }, { passive: true });
  canvas.parentElement.addEventListener('click', e => { if (!e.target.closest('a,button')) sprint = 1; });

  let narrow = false;
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix(); narrow = w < 900;
  };
  addEventListener('resize', resize); resize();

  const theme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    scene.background = new THREE.Color(light ? 0xF6F5EF : 0x090B08);
    renderer.toneMapping = light ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    bloom.enabled = !light;
    road.material.color.set(light ? 0xE4E2D8 : 0x15180f);
    dashMat.color.set(light ? 0x367000 : 0xCCFF00);
    inst.material.opacity = light ? .25 : .6;
  };
  addEventListener('themechange', theme); theme();

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    mx += (tx - mx) * .05; my += (ty - my) * .05; sprint *= .985;
    const speed = reduce ? .2 : 1 + sprint * 2.6 + sy * .8;

    peloton.scale.setScalar(narrow ? .55 : .82);
    peloton.position.set(narrow ? .4 : 3.3, narrow ? -2.3 : -1.25, 0);
    peloton.rotation.y = -.42 + mx * .7 + sy * .9;
    camera.position.set(mx * 1.2, 2.2 - my * 1.2 + sy * 1.5, 13 + sy * 4);
    camera.lookAt(narrow ? 0 : 1.6, narrow ? -1 : .2, 0);

    riders.forEach((r, i) => {
      const cad = t * 6 * speed + r.phase, bob = Math.abs(Math.sin(cad)) * .05;
      r.wR.rotation.z -= .12 * speed; r.wF.rotation.z -= .12 * speed;
      const surge = i === 0 ? sprint * 1.6 : -sprint * .3 * (i % 3);
      r.root.position.x = r.base[0] + Math.sin(t * .7 + r.phase) * .18 + surge;
      r.root.position.z = r.base[1] + Math.sin(t * .5 + r.phase * 2) * .08;
      r.root.rotation.x = Math.sin(cad) * .02;
      r.body.position.y = 1.72 + bob;
      r.body.rotation.z = -.15 - sprint * .25;
      r.ball.material.emissiveIntensity = .3 + sprint * .6;
      const bl = ((t + r.phase) % 4) < .12 ? .15 : 1; r.eyes.forEach(e => e.scale.y = bl);
      [0, 1].forEach(k => {
        const a = cad + k * Math.PI, z = k ? .13 : -.13;
        const pedal = V(Math.cos(a) * .17, .45 + Math.sin(a) * .17, z);
        place(r.crank[k], V(0, .45, z), pedal);
        const hip = V(-.12, 1.42 + bob, z * .8);
        const knee = hip.clone().add(pedal).multiplyScalar(.5).add(V(.22, .08, 0));
        place(r.legs[k][0], hip, knee); place(r.legs[k][1], knee, pedal);
        place(r.arms[k], V(.25, 1.68 + bob, z * 1.3), V(.62, 1.33, z * 1.7));
      });
    });

    dashes.position.x = -((t * 4 * speed) % 3.2);
    trails.forEach((tr, i) => {
      tr.x -= tr.v * speed * 1.4; if (tr.x < -20) { tr.x = 20; tr.y = Math.random() * 6 - .5; }
      dummy.position.set(tr.x, tr.y, tr.z); dummy.scale.set(tr.l * (1 + sprint * 2), 1, 1); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
    composer.render();
  })();
}
