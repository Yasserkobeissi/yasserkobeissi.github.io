import * as THREE from 'three';
/* A neural volume along a corridor. Thousands of neurons and connections; pulses run along them. 34 of the neurons are rooms. */
const pointVert = /* glsl */`
attribute float aSize; attribute float aPhase; attribute float aKind; uniform float uTime; uniform float uPx; varying float vA; varying float vKind; varying float vFade;
void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); float dist = -mv.z; float blink = 0.6 + 0.4 * sin(uTime * (1.2 + aKind * 0.6) + aPhase * 6.283); vA = blink; vKind = aKind; vFade = smoothstep(0.35, 1.6, dist) * (1.0 - smoothstep(12.0, 22.0, dist)); gl_PointSize = min(64.0, aSize * uPx * (1.0 + aKind * 1.6) * blink / max(0.3, dist)); gl_Position = projectionMatrix * mv; }`;
const pointFrag = /* glsl */`
precision highp float; uniform vec3 uA; uniform vec3 uB; uniform float uHot; varying float vA; varying float vKind; varying float vFade;
void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float core = smoothstep(0.5, 0.0, d); float g = pow(core, 2.6) + smoothstep(0.12, 0.0, d) * 0.8; vec3 c = mix(uA, uB, vKind); gl_FragColor = vec4(c * (0.5 + vA * 0.6) * (1.0 + vKind * 0.6), g * (0.35 + 0.5 * vKind) * vFade); }`;
const lineVert = /* glsl */`
attribute float aT; attribute float aPhase; attribute float aSpeed; varying float vT; varying float vPhase; varying float vSpeed;
void main(){ vT = aT; vPhase = aPhase; vSpeed = aSpeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const lineFrag = /* glsl */`
precision highp float; uniform float uTime; uniform vec3 uA; varying float vT; varying float vPhase; varying float vSpeed;
void main(){ float p = fract(uTime * vSpeed + vPhase); float pulse = smoothstep(0.12, 0.0, abs(vT - p)); float base = 0.045; gl_FragColor = vec4(uA, base + pulse * 0.6); }`;

export function createBrain(curve, rooms) {
  const group = new THREE.Group();
  const N = 2300, pts = [], sizes = [], phases = [], kinds = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < N; i++) {
    const t = Math.random(); const c = curve.getPoint(t);
    const r = Math.pow(Math.random(), 0.6) * 4.2; const th = Math.random() * Math.PI * 2; const ph = Math.acos(rnd(-1, 1));
    pts.push(c.x + r * Math.sin(ph) * Math.cos(th), c.y + r * Math.sin(ph) * Math.sin(th), c.z + r * Math.cos(ph));
    sizes.push(rnd(0.9, 2.6)); phases.push(Math.random()); kinds.push(0);
  }
  // room neurons: placed in chapters along the corridor, close to the path so they are met, not missed
  const roomPositions = [];
  rooms.forEach((room, i) => {
    const t = room.t; const c = curve.getPoint(t); const tan = curve.getTangent(t);
    const side = new THREE.Vector3().crossVectors(tan, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(side, tan).normalize();
    const a = room.angle, r = room.r;
    const p = c.clone().addScaledVector(side, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r);
    roomPositions.push(p); pts.push(p.x, p.y, p.z); sizes.push(4.2); phases.push(Math.random()); kinds.push(1);
  });
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  pg.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
  pg.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
  pg.setAttribute('aKind', new THREE.Float32BufferAttribute(kinds, 1));
  const pointU = { uTime: { value: 0 }, uPx: { value: 60 }, uA: { value: new THREE.Color('#5f9cff') }, uB: { value: new THREE.Color('#eaf4ff') }, uHot: { value: 0 } };
  const points = new THREE.Points(pg, new THREE.ShaderMaterial({ vertexShader: pointVert, fragmentShader: pointFrag, uniforms: pointU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(points);
  // connections: each neuron to its 2 nearest among a random sample
  const total = pts.length / 3; const lp = [], lt = [], lph = [], ls = [];
  const v = (i) => new THREE.Vector3(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]);
  for (let i = 0; i < total; i++) {
    const a = v(i); const cand = []; const K = i >= N ? 7 : 2; // rooms get more dendrites
    for (let k = 0; k < 48; k++) { const j = Math.floor(Math.random() * total); if (j === i) continue; cand.push([a.distanceToSquared(v(j)), j]); }
    cand.sort((x, y) => x[0] - y[0]);
    for (let k = 0; k < K && k < cand.length; k++) { if (cand[k][0] > 5.5) break; const b = v(cand[k][1]); lp.push(a.x, a.y, a.z, b.x, b.y, b.z); lt.push(0, 1); const ph = Math.random(), sp = 0.08 + Math.random() * 0.25; lph.push(ph, ph); ls.push(sp, sp); }
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3)); lg.setAttribute('aT', new THREE.Float32BufferAttribute(lt, 1)); lg.setAttribute('aPhase', new THREE.Float32BufferAttribute(lph, 1)); lg.setAttribute('aSpeed', new THREE.Float32BufferAttribute(ls, 1));
  const lineU = { uTime: { value: 0 }, uA: { value: new THREE.Color('#6fa8ff') } };
  const lines = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ vertexShader: lineVert, fragmentShader: lineFrag, uniforms: lineU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(lines);
  return { group, points, lines, roomPositions, update(t, px) { pointU.uTime.value = t; lineU.uTime.value = t; pointU.uPx.value = px; }, setOpacity(o) { points.material.opacity = o; lines.material.opacity = o; points.visible = o > 0.01; lines.visible = o > 0.01; } };
}
