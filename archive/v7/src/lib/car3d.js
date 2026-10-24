import * as THREE from 'three';
/* The car he keeps drawing. A real 3D body built from a side profile, lines first, surfaces later. Turns with scroll, tunes with sliders. */
export function createCar3D(canvas, { onChange }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(28, 1, .1, 100); camera.position.set(0, 1.4, 9.5);
  scene.add(new THREE.HemisphereLight('#ffffff', '#8a8378', 1.3)); const key = new THREE.DirectionalLight('#fff6e6', 1.6); key.position.set(3, 6, 4); scene.add(key); const rim = new THREE.DirectionalLight('#dfe8ff', .8); rim.position.set(-5, 2, -4); scene.add(rim);
  const group = new THREE.Group(); scene.add(group);
  const s = { roof: 50, wheels: 50, length: 50, stance: 50 }; let fill = 0, spin = 0, drag = null, dragSpin = 0;
  const lineMat = new THREE.LineBasicMaterial({ color: '#121212', transparent: true, opacity: 1 }); const bodyMat = new THREE.MeshStandardMaterial({ color: '#d9534a', roughness: .35, metalness: .25, transparent: true, opacity: 0 }); const glassMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: .1, metalness: .6, transparent: true, opacity: 0 }); const tireMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: .9, transparent: true, opacity: 0 });
  const build = () => {
    group.clear();
    const L = 3.6 + (s.length / 100) * 1.6, roof = .62 + (s.roof / 100) * .5, wr = .3 + (s.wheels / 100) * .16, track = .22 + (s.stance / 100) * .14, width = 1.6 + (s.stance / 100) * .4, hood = .55;
    const x0 = -L / 2, x1 = L / 2, aP = x0 + L * .36, cP = x1 - L * .26;
    const sh = new THREE.Shape(); sh.moveTo(x0, .2); sh.lineTo(x0 + .06, hood); sh.quadraticCurveTo(x0 + .5, hood + .06, aP - .4, hood + .1); sh.bezierCurveTo(aP, roof + .5, aP + .1, roof + .55, aP + .4, roof + .55); sh.lineTo(cP - .2, roof + .55); sh.bezierCurveTo(cP + .2, roof + .5, cP + .4, hood + .14, x1 - .3, hood + .1); sh.quadraticCurveTo(x1, hood, x1, .3); sh.lineTo(x1, .2); sh.lineTo(x0, .2);
    const geo = new THREE.ExtrudeGeometry(sh, { depth: width, bevelEnabled: true, bevelThickness: .22, bevelSize: .24, bevelSegments: 6, curveSegments: 24 }); geo.translate(0, 0, -width / 2);
    const body = new THREE.Mesh(geo, bodyMat); group.add(body); group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 18), lineMat));
    const win = new THREE.Shape(); win.moveTo(aP - .1, hood + .12); win.bezierCurveTo(aP + .05, roof + .42, aP + .15, roof + .46, aP + .44, roof + .46); win.lineTo(cP - .22, roof + .46); win.bezierCurveTo(cP + .12, roof + .44, cP + .26, hood + .16, cP + .3, hood + .14); win.lineTo(aP - .1, hood + .12);
    const wgeo = new THREE.ExtrudeGeometry(win, { depth: width + .02, bevelEnabled: false }); wgeo.translate(0, 0, -width / 2 - .01); const wm = new THREE.Mesh(wgeo, glassMat); group.add(wm); group.add(new THREE.LineSegments(new THREE.EdgesGeometry(wgeo, 20), lineMat));
    [[x0 + L * track, width / 2 - .02], [x0 + L * track, -width / 2 + .02], [x1 - L * track, width / 2 - .02], [x1 - L * track, -width / 2 + .02]].forEach(([x, z]) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, .3, 32), tireMat); t.rotation.x = Math.PI / 2; t.position.set(x, 0, z); group.add(t); group.add(new THREE.LineSegments(new THREE.EdgesGeometry(t.geometry, 30), lineMat).translateX(x).translateZ(z).rotateX(Math.PI / 2)); });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 48), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .08 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -wr; group.add(floor);
    let key = 'default'; if (s.roof < 28) key = 'roofLow'; else if (s.roof > 78) key = 'roofHigh'; else if (s.wheels > 78) key = 'wheelsBig'; else if (s.wheels < 24) key = 'wheelsSmall'; else if (s.length > 78) key = 'long'; else if (s.length < 24) key = 'short'; else if (s.stance > 78) key = 'stanceWide';
    onChange?.(key, s);
  };
  build();
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, s: dragSpin }; canvas.setPointerCapture?.(e.pointerId); }); canvas.addEventListener('pointermove', (e) => { if (drag) dragSpin = drag.s + (e.clientX - drag.x) * .01; }); const up = () => (drag = null); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  const api = {
    set(k, v) { s[k] = v; build(); },
    setSpin(v) { spin = v; }, setFill(v) { fill = v; },
    resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); },
    render(t) { group.rotation.y = spin + dragSpin + Math.sin(t * .3) * .04; bodyMat.opacity = fill; glassMat.opacity = fill * .85; tireMat.opacity = fill; lineMat.opacity = 1 - fill * .55; renderer.render(scene, camera); },
  };
  api.resize(); return api;
}
