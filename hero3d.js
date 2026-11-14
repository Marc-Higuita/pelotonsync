// Logo 3D "Pelotón encadenado": dos aros entrelazados + bola volt (el atleta) adelante.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('three');
if (canvas) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const group = new THREE.Group();
  scene.add(group);
  const metal = (c, r = .35) => new THREE.MeshPhysicalMaterial({ color: c, metalness: .6, roughness: r, clearcoat: 1, clearcoatRoughness: .2 });
  const ringGeo = new THREE.TorusGeometry(1.15, .22, 48, 160);
  const r1 = new THREE.Mesh(ringGeo, metal(0x4F534E));
  const r2 = new THREE.Mesh(ringGeo, metal(0xA9ADA6, .25));
  r1.position.x = -1.45; r2.position.x = 0;
  r1.rotation.y = .5; r2.rotation.y = -.5; // entrelazados como eslabones
  const ballMat = new THREE.MeshPhysicalMaterial({ color: 0xCCFF00, emissive: 0x89b000, emissiveIntensity: .55, roughness: .08, metalness: 0, transmission: .25, thickness: 1.2, clearcoat: 1, ior: 1.4 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.25, 96, 96), ballMat);
  ball.position.x = 1.75;
  group.add(r1, r2, ball);
  group.position.x = 0;

  const glow = new THREE.PointLight(0xCCFF00, 18, 12); glow.position.set(2.5, .5, 2.5); scene.add(glow);
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-3, 4, 5); scene.add(key);

  // partículas: el pelotón a lo lejos
  const N = 420, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i*3] = (Math.random() - .5) * 30; pos[i*3+1] = (Math.random() - .5) * 16; pos[i*3+2] = -Math.random() * 14 - 2; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xCCFF00, size: .04, transparent: true, opacity: .55 }));
  scene.add(pts);

  let mx = 0, my = 0, sy = 0;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sy = scrollY / innerHeight; }, { passive: true });
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const narrow = w < 900; group.position.set(narrow ? 0 : 3.2, narrow ? 2.4 : .3, 0); group.scale.setScalar(narrow ? .62 : 1);
  };
  addEventListener('resize', resize); resize();
  const theme = () => { pts.material.color.set(document.documentElement.dataset.theme === 'light' ? 0x367000 : 0xCCFF00); };
  addEventListener('themechange', theme); theme();

  const clock = new THREE.Clock();
  (function tick() {
    const t = clock.getElapsedTime();
    if (!reduce) {
      group.rotation.y += ((mx * .9 + Math.sin(t * .4) * .15) - group.rotation.y) * .05;
      group.rotation.x += ((my * .6 + sy * .6) - group.rotation.x) * .05;
      r1.rotation.z = t * .25; r2.rotation.z = -t * .25;
      ball.position.y = Math.sin(t * 1.6) * .12;
      ball.scale.setScalar(1 + Math.sin(t * 3.2) * .015);
      pts.position.x = -((t * .6) % 10); // el pelotón rueda
    }
    group.position.z = -sy * 4;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();
  canvas.classList.add('ready');
}
