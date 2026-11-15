// Grega en 3D: esfera de vidrio líquido volt con ojos en píldora que siguen el cursor. Clic = salto feliz.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('grega3d');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.03).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50); camera.position.set(0, .2, 9);

  const grega = new THREE.Group(); scene.add(grega);
  const body = new THREE.Mesh(new THREE.SphereGeometry(1.5, 128, 128), new THREE.MeshPhysicalMaterial({ color: 0xCCFF00, roughness: .04, transmission: .65, thickness: 2.4, ior: 1.4, clearcoat: 1, emissive: 0x9ccc00, emissiveIntensity: .25, iridescence: .4 }));
  const inner = new THREE.Mesh(new THREE.SphereGeometry(.95, 64, 64), new THREE.MeshBasicMaterial({ color: 0xDFFF4D, transparent: true, opacity: .55 }));
  grega.add(body, inner);
  const face = new THREE.Group(); grega.add(face);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .3 });
  const eyeGeo = new THREE.CapsuleGeometry(.11, .34, 8, 24);
  const eL = new THREE.Mesh(eyeGeo, eyeMat), eR = new THREE.Mesh(eyeGeo, eyeMat);
  eL.position.set(-.38, .22, 1.44); eR.position.set(.38, .22, 1.44); face.add(eL, eR);
  const shine = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  [eL, eR].forEach(e => { const s = shine.clone(); s.position.set(.05, .12, .1); e.add(s); });
  // brazos y piernas de línea
  const lineMat = new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .5 });
  const tube = pts => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), 32, .045, 10), lineMat);
  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.add(tube([[0, 0, 0], [-.45, -.15, 0], [-.75, .15, 0]])); armL.position.set(-1.42, -.1, .2);
  armR.add(tube([[0, 0, 0], [.45, -.15, 0], [.75, .25, 0]])); armR.position.set(1.42, -.1, .2);
  const legs = new THREE.Group();
  legs.add(tube([[-.4, -1.35, .2], [-.45, -1.9, .2], [-.65, -2.0, .35]]), tube([[.4, -1.35, .2], [.45, -1.9, .2], [.65, -2.0, .35]]));
  grega.add(armL, armR, legs);

  // sombra
  const sh = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .25 }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = -2.15; scene.add(sh);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x334400, .8));
  const k = new THREE.DirectionalLight(0xffffff, 2); k.position.set(-3, 4, 5); scene.add(k);
  const p = new THREE.PointLight(0xCCFF00, 20, 10); p.position.set(2, 0, 3); scene.add(p);

  let mx = 0, my = 0, jump = 0, mood = 'saludo';
  const rect = () => canvas.getBoundingClientRect();
  addEventListener('pointermove', e => { const r = rect(); mx = ((e.clientX - r.left) / r.width - .5) * 2; my = ((e.clientY - r.top) / r.height - .5) * 2; });
  canvas.addEventListener('click', () => { jump = 1; });
  window.setGregaMood = m => { mood = m; if (m === 'feliz') jump = 1; };

  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(canvas); resize();
  const cVolt = new THREE.Color(0xCCFF00), cAlert = new THREE.Color(0xFF5A2B), cSleep = new THREE.Color(0x8E9A6A);
  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime(); jump *= .93;
    const target = mood === 'alerta' ? cAlert : mood === 'recuperacion' ? cSleep : cVolt;
    body.material.color.lerp(target, .08); body.material.emissive.lerp(target, .08); inner.material.color.lerp(target, .05);
    const sleep = mood === 'recuperacion';
    grega.position.y = Math.sin(t * 1.8) * (sleep ? .03 : .12) + Math.sin(jump * Math.PI) * .9;
    grega.rotation.y += ((mx * .5) - grega.rotation.y) * .08;
    grega.rotation.x += ((my * .3) - grega.rotation.x) * .08;
    face.position.x = mx * .12; face.position.y = -my * .1;
    // parpadeo
    const blink = (t % 3.6) < .12 || sleep ? .12 : 1;
    eL.scale.y = eR.scale.y = THREE.MathUtils.lerp(eL.scale.y, blink, .4);
    eL.rotation.z = eR.rotation.z = sleep ? Math.PI / 2 : 0;
    // brazos según el ánimo
    const wave = mood === 'saludo' ? Math.sin(t * 6) * .5 + .4 : mood === 'feliz' ? Math.sin(t * 10) * .3 + .9 : mood === 'pensando' ? .8 : mood === 'alerta' ? -.2 : 0;
    armR.rotation.z = THREE.MathUtils.lerp(armR.rotation.z, wave, .15);
    armL.rotation.z = THREE.MathUtils.lerp(armL.rotation.z, mood === 'feliz' ? -.9 : mood === 'gregario' ? -.5 : 0, .15);
    sh.scale.setScalar(1 - Math.sin(jump * Math.PI) * .4);
    renderer.render(scene, camera);
  })();
}
