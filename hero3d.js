// Inicio 3D: un pelotón de Gregas subiendo y bajando montañas sobre asfalto.
// Las ruedas son los aros del logo; Grega es la bola volt con el uniforme del equipo.
// Mouse = girar la cámara · clic = acelerón suave · scroll = el pelotón se aleja.
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
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 300);

  // ---------- terreno: la carretera sube y baja ----------
  const TAU = Math.PI * 2, P = 60;              // periodo del recorrido
  const h = x => Math.sin(x * TAU / P * 3) * .75 + Math.sin(x * TAU / P * 1 + 1.3) * 1.25;
  const slope = x => (h(x + .05) - h(x - .05)) / .1;

  // ---------- materiales ----------
  const M = {
    tire: new THREE.MeshStandardMaterial({ color: 0x1a1c19, roughness: .7 }),
    rim: new THREE.MeshPhysicalMaterial({ color: 0xA9ADA6, metalness: .9, roughness: .25, clearcoat: 1 }),
    rim2: new THREE.MeshPhysicalMaterial({ color: 0x4F534E, metalness: .9, roughness: .3, clearcoat: 1 }),
    line: new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .25 }),
    jersey: new THREE.MeshStandardMaterial({ color: 0x0E100E, roughness: .55 }),
    stripe: new THREE.MeshStandardMaterial({ color: 0xCCFF00, emissive: 0x6a8a00, emissiveIntensity: .4, roughness: .4 }),
  };
  const frameColors = [0xCCFF00, 0x3FC8E4, 0xFF6A2B, 0x8E6BFF, 0x5BD68A, 0xF3F1EA];
  const frameMat = c => new THREE.MeshPhysicalMaterial({ color: c, metalness: .35, roughness: .25, clearcoat: 1, clearcoatRoughness: .1 });
  const gregaMat = () => new THREE.MeshPhysicalMaterial({ color: 0xCCFF00, emissive: 0x9fcc00, emissiveIntensity: .3, roughness: .06, clearcoat: 1, transmission: .3, thickness: 1.2, ior: 1.4, iridescence: .35 });

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

  // ---------- un ciclista Grega con uniforme PelotonSync ----------
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
    // jersey: media esfera inferior asfalto con franja volt
    const jersey = new THREE.Mesh(new THREE.SphereGeometry(.43, 48, 24, 0, TAU, Math.PI * .55, Math.PI * .45), M.jersey); body.add(jersey);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(.405, .025, 8, 48), M.stripe); stripe.rotation.x = Math.PI / 2; stripe.position.y = -.1; body.add(stripe);
    // casco
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(.44, 32, 16, 0, TAU, 0, Math.PI * .28), frameMat(color)); helmet.rotation.z = -.35; body.add(helmet);
    const eyeGeo = new THREE.CapsuleGeometry(.035, .1, 6, 12);
    const eyes = [];
    [-.11, .11].forEach(z => { const e = new THREE.Mesh(eyeGeo, M.eye); e.position.copy(V(.85, .12, z * 2.6).normalize().multiplyScalar(.41)); body.add(e); eyes.push(e); });
    const legs = [0, 1].map(() => [stick(M.jersey, .03), stick(M.line, .022)]); legs.flat().forEach(s => root.add(s));
    const arms = [0, 1].map(() => stick(M.line, .02)); arms.forEach(s => root.add(s));
    const crank = [stick(M.rim2, .02), stick(M.rim2, .02)]; crank.forEach(s => root.add(s));
    if (leader) { const halo = new THREE.PointLight(0xCCFF00, 4, 3); halo.position.set(.3, 1.8, .4); root.add(halo); }
    return { root, wR, wF, body, eyes, legs, arms, crank, ball, phase: Math.random() * 6 };
  }

  // ---------- mundo ----------
  const world = new THREE.Group(); scene.add(world);
  const peloton = new THREE.Group(); world.add(peloton);
  const slots = [[3.1, 0], [1.15, -.55], [1.15, .55], [-.75, 0], [-2.65, -.55], [-2.65, .55]];
  const riders = slots.map((s, i) => { const r = rider(frameColors[i], i === 0); r.base = s; peloton.add(r.root); return r; });

  // asfalto con textura de canvas (grano, bordes blancos y línea central volt)
  function asphalt(light) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
    g.fillStyle = light ? '#cfccc2' : '#2a2c27'; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 9000; i++) { const v = Math.random(); g.fillStyle = light ? `rgba(80,80,70,${v * .25})` : `rgba(255,255,255,${v * .07})`; g.fillRect(Math.random() * 512, Math.random() * 256, 1.5, 1.5); }
    g.fillStyle = light ? '#ffffff' : '#d9d6cc'; g.fillRect(0, 14, 512, 7); g.fillRect(0, 235, 512, 7);
    g.fillStyle = light ? '#367000' : '#CCFF00'; for (let x = 0; x < 512; x += 128) g.fillRect(x, 124, 70, 8);
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  const texDark = asphalt(false), texLight = asphalt(true);
  const RW = 70, RS = 280;
  const roadGeo = new THREE.PlaneGeometry(RW, 3.4, RS, 1); roadGeo.rotateX(-Math.PI / 2);
  const roadMat = new THREE.MeshStandardMaterial({ map: texDark, roughness: .95 });
  texDark.repeat.x = texLight.repeat.x = RW / 4;
  const road = new THREE.Mesh(roadGeo, roadMat); road.receiveShadow = true; world.add(road);
  const rp = roadGeo.attributes.position;
  // laderas a los lados de la vía
  const shoulderGeo = new THREE.PlaneGeometry(RW, 14, RS, 6); shoulderGeo.rotateX(-Math.PI / 2);
  const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x1c2414, roughness: 1, flatShading: true });
  const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat); shoulder.position.z = -8.7; world.add(shoulder);
  const sp = shoulderGeo.attributes.position;

  // montañas de fondo: dos capas en parallax
  function ridgeShape(amp, base, k, seed) {
    const s = new THREE.Shape(); s.moveTo(-60, -6);
    for (let x = -60; x <= 60; x += 1) s.lineTo(x, base + amp * (Math.sin(x * TAU / 60 * k + seed) * .6 + Math.sin(x * TAU / 60 * (k * 2 + 1) + seed * 2) * .3 + Math.sin(x * TAU / 60 * 7 + seed) * .1));
    s.lineTo(60, -6); return new THREE.ShapeGeometry(s);
  }
  const farMat = new THREE.MeshBasicMaterial({ color: 0x1b2213 }), nearMat = new THREE.MeshBasicMaterial({ color: 0x232c18 });
  const far = new THREE.Mesh(ridgeShape(3.2, 4.5, 2, 0), farMat); far.position.z = -26; world.add(far);
  const near = new THREE.Mesh(ridgeShape(2.2, 2.2, 3, 2), nearMat); near.position.z = -16; world.add(near);
  // sol / luna
  const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), new THREE.MeshBasicMaterial({ color: 0xCCFF00, transparent: true, opacity: .85 }));
  sunDisc.position.set(6, 6.5, -30); world.add(sunDisc);

  // ---------- luces ----------
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334400, .7));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(-4, 10, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 }); scene.add(sun);
  const rim = new THREE.PointLight(0xCCFF00, 14, 14); rim.position.set(5, 4, 3); scene.add(rim);

  // ---------- estelas de viento ----------
  const TR = 70, trails = [];
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, .016, .016), new THREE.MeshBasicMaterial({ transparent: true, opacity: .5, depthWrite: false }), TR);
  world.add(inst);
  const trailCols = [0xCCFF00, 0x3FC8E4, 0xFF6A2B, 0x8E6BFF, 0xF3F1EA].map(c => new THREE.Color(c));
  for (let i = 0; i < TR; i++) { trails.push({ x: (Math.random() - .5) * 30, y: Math.random() * 4 + 1, z: (Math.random() - .5) * 6, l: .4 + Math.random() * 1.8, v: .5 + Math.random() }); inst.setColorAt(i, trailCols[i % trailCols.length]); }
  const dummy = new THREE.Object3D();

  // ---------- postproceso ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .45, .6, .6);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  // ---------- interacción ----------
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, sprint = 0, sprintTarget = 0, sprintTimer;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  addEventListener('scroll', () => { sy = Math.min(1.5, scrollY / innerHeight); }, { passive: true });
  // acelerón suave: sube despacio, se sostiene y vuelve a bajar despacio
  canvas.parentElement.addEventListener('click', e => { if (e.target.closest('a,button')) return; sprintTarget = 1; clearTimeout(sprintTimer); sprintTimer = setTimeout(() => sprintTarget = 0, 2200); });

  let narrow = false;
  const resize = () => {
    const w = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(w, hh, false); composer.setSize(w, hh); bloom.setSize(w, hh);
    camera.aspect = w / hh; camera.updateProjectionMatrix(); narrow = innerWidth < 900;
  };
  addEventListener('resize', resize); new ResizeObserver(resize).observe(canvas); resize();

  const theme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    scene.background = new THREE.Color(light ? 0xF6F5EF : 0x090B08);
    scene.fog = new THREE.Fog(light ? 0xF6F5EF : 0x090B08, 18, 46);
    renderer.toneMapping = light ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    bloom.enabled = !light;
    roadMat.map = light ? texLight : texDark; roadMat.needsUpdate = true;
    shoulderMat.color.set(light ? 0xd7dcc4 : 0x1c2414);
    farMat.color.set(light ? 0xe4e7d6 : 0x161c10); nearMat.color.set(light ? 0xd2d9bd : 0x202916);
    sunDisc.material.color.set(light ? 0xFF9B2F : 0xCCFF00); sunDisc.material.opacity = light ? .55 : .8;
    inst.material.opacity = light ? .22 : .5;
  };
  addEventListener('themechange', theme); theme();

  const clock = new THREE.Clock();
  let visible = true, dist = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  (function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(.05, clock.getDelta());
    if (!visible) return;
    const t = clock.elapsedTime;
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    sprint += (sprintTarget - sprint) * .018;               // rampa suave
    const speed = reduce ? .15 : 1 + sprint * 1.1 + sy * .4;
    dist += dt * 2.6 * speed;

    // carretera y laderas siguen el relieve
    for (let i = 0; i < rp.count; i++) { const x = rp.getX(i); rp.setY(i, h(x + dist)); }
    rp.needsUpdate = true; roadGeo.computeVertexNormals();
    for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), zl = sp.getZ(i); sp.setY(i, h(x + dist) - .03 + (7 - zl) * .32 + Math.sin((x + dist) * .8 + zl) * .18 * (7 - zl) / 14); }
    sp.needsUpdate = true;
    roadMat.map.offset.x = dist / 4;
    far.position.x = -((dist * .08) % 60); near.position.x = -((dist * .2) % 60);

    // encuadre: el canvas ocupa la mitad derecha en escritorio, así que el pelotón va centrado en él
    const sc = narrow ? .62 : .72;
    world.scale.setScalar(sc);
    world.rotation.y = -.5 + mx * .6 + sy * .7;
    camera.position.set(mx * 1.5, 3.6 - my * 1.4 + sy * 2, 14.5 + sy * 5);
    camera.lookAt(0, .6, 0);

    riders.forEach((r, i) => {
      const x = r.base[0] + Math.sin(t * .6 + r.phase) * .16 + (i === 0 ? sprint * 1.1 : -sprint * .25 * (i % 3));
      const wx = x + dist, sl = slope(wx);
      const climb = Math.max(.55, 1 - sl * .35);           // en subida pedalean más lento
      const cad = (t * 5.5 * speed * climb) + r.phase, bob = Math.abs(Math.sin(cad)) * .05;
      r.root.position.set(x, h(wx), r.base[1] + Math.sin(t * .5 + r.phase * 2) * .07);
      r.root.rotation.z = Math.atan(sl);
      r.wR.rotation.z -= .11 * speed; r.wF.rotation.z -= .11 * speed;
      r.body.position.y = 1.72 + bob;
      r.body.rotation.z = -.12 - sprint * .18 + Math.max(0, sl) * .12;
      r.ball.material.emissiveIntensity = .28 + sprint * .35;
      const bl = ((t + r.phase) % 4) < .12 ? .15 : 1; r.eyes.forEach(e => e.scale.y = bl);
      [0, 1].forEach(k => {
        const a = cad + k * Math.PI, z = k ? .13 : -.13;
        const pedal = V(Math.cos(a) * .17, .45 + Math.sin(a) * .17, z);
        place(r.crank[k], V(0, .45, z), pedal);
        const hip = V(-.12, 1.42 + bob, z * .8);
        const knee = hip.clone().add(pedal).multiplyScalar(.5).add(V(.22, .08, 0));
        place(r.legs[k][0], hip, knee); place(r.legs[k][1], knee, pedal);
        place(r.arms[k], V(.25, 1.66 + bob, z * 1.3), V(.62, 1.33, z * 1.7));
      });
    });

    trails.forEach((tr, i) => {
      tr.x -= tr.v * dt * 6 * speed; if (tr.x < -15) { tr.x = 15; tr.y = Math.random() * 4 + 1; }
      dummy.position.set(tr.x, tr.y + h(tr.x + dist), tr.z); dummy.scale.set(tr.l * (1 + sprint), 1, 1); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
    composer.render();
  })();
}
