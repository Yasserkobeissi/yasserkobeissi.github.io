import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { forms } from './forms.js';

const vert = /* glsl */`
attribute vec3 aA; attribute vec3 aB; attribute float aSeed;
uniform float uMorph; uniform float uTime; uniform float uPx; uniform vec2 uCursor; uniform float uTorch; uniform float uCamZ; uniform vec3 uStationA; uniform vec3 uStationB;
varying float vGlow; varying float vFade; varying float vSeed;
float ease(float t){ return t * t * (3.0 - 2.0 * t); }
void main(){
  float s = aSeed;
  float m = ease(clamp((uMorph - s * 0.45) / 0.55, 0.0, 1.0));
  vec3 a = aA + uStationA, b = aB + uStationB;
  // on the way, points lift and scatter a little so the room is clearly rebuilt, not slid
  vec3 p = mix(a, b, m) + vec3(0.0, sin(m * 3.1416) * (1.5 + s * 2.0), 0.0) + vec3(sin(uTime * 0.6 + s * 40.0), cos(uTime * 0.5 + s * 30.0), 0.0) * 0.015;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = -mv.z;
  vFade = smoothstep(1.2, 5.5, dist) * (1.0 - smoothstep(60.0, 110.0, dist));
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  float d = distance(ndc * vec2(1.0, 0.6), uCursor * vec2(1.0, 0.6));
  vGlow = smoothstep(0.42, 0.0, d) * uTorch;
  vSeed = s;
  gl_PointSize = clamp(uPx * (1.0 + s * 0.6) / dist, 1.0, 9.0) * (1.0 + vGlow * 0.6);
  gl_Position = clip;
}`;
const frag = /* glsl */`
precision highp float; uniform vec3 uColA; uniform vec3 uColB; uniform float uMorph; uniform float uDim;
varying float vGlow; varying float vFade; varying float vSeed;
void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float g = smoothstep(0.5, 0.05, d);
  vec3 c = mix(uColA, uColB, smoothstep(0.2, 0.8, uMorph)); c = mix(c, vec3(1.0, 0.95, 0.85), vGlow * 0.7);
  float a = g * vFade * (0.26 + vSeed * 0.14 + vGlow * 0.9) * uDim; gl_FragColor = vec4(c * (0.9 + vGlow * 1.6), a); }`;

export function createWorld(canvas, chapters, { reduced, loadFrame }) {
  const N = 42000;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setClearColor('#05060a', 1);
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2('#05060a', 0.012);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  const stations = chapters.map((_, i) => new THREE.Vector3(0, 0, -i * 46 + 20));
  const formed = chapters.map((c) => forms[c.form](N));
  const seeds = new Float32Array(N); for (let i = 0; i < N; i++) seeds[i] = Math.random();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute('aA', new THREE.Float32BufferAttribute(formed[0], 3)); geo.setAttribute('aB', new THREE.Float32BufferAttribute(formed[1], 3)); geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -120), 300);
  const palettes = ['#8fb3ff', '#ffffff', '#ffb45c', '#e9c391', '#c9d6ff', '#9ad8c6', '#ffd7a8'];
  const dims = { swirl: 1, stand: .62, tent: .7, gate: .85, trophy: .3, stage: .75, line: .9 };
  const u = { uMorph: { value: 0 }, uTime: { value: 0 }, uPx: { value: 60 }, uCursor: { value: new THREE.Vector2(0, 0) }, uTorch: { value: 1 }, uCamZ: { value: 0 }, uStationA: { value: stations[0].clone() }, uStationB: { value: stations[1].clone() }, uColA: { value: new THREE.Color(palettes[0]) }, uColB: { value: new THREE.Color(palettes[1]) }, uDim: { value: 1 } };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  points.frustumCulled = false; scene.add(points);
  // LED screens inside the rooms: his real renders
  const loader = new THREE.TextureLoader(); const screens = [];
  const screenSpec = { stand: [0, 2.4, -6.2, 5, 2.8], tent: [0, 2.6, -6.6, 6, 3.2], gate: [0, 3.6, -0.2, 7.2, 4.6], trophy: [0, 4.95, 0.05, 5.3, 7.3], stage: [0, 5, -11.3, 15.6, 7.3] };
  chapters.forEach((c, i) => { const sp = screenSpec[c.form]; if (!sp || !c.src) return; const m = new THREE.Mesh(new THREE.PlaneGeometry(sp[3], sp[4]), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 })); m.position.set(sp[0] + stations[i].x, sp[1], sp[2] + stations[i].z); scene.add(m); screens.push({ mesh: m, i }); loader.load(c.src, (t) => { t.colorSpace = THREE.SRGBColorSpace; m.material.map = t; m.material.needsUpdate = true; }); });
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera)); const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.42, 0.5, 0.55); composer.addPass(bloom); composer.addPass(new OutputPass());

  const st = { t: 0, mouse: new THREE.Vector2(), time: 0 }; const sm = { t: 0, mx: 0, my: 0 }; let seg = 0;
  const setSeg = (k) => { if (k === seg) return; seg = k; geo.getAttribute('aA').copyArray(formed[k]); geo.getAttribute('aA').needsUpdate = true; geo.getAttribute('aB').copyArray(formed[Math.min(k + 1, formed.length - 1)]); geo.getAttribute('aB').needsUpdate = true; u.uStationA.value.copy(stations[k]); u.uStationB.value.copy(stations[Math.min(k + 1, stations.length - 1)]); u.uColA.value.set(palettes[k % palettes.length]); u.uColB.value.set(palettes[(k + 1) % palettes.length]); };
  const api = {
    st, chapters: chapters.length,
    resize() { renderer.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); u.uPx.value = innerHeight * 0.06; },
    pointer(x, y) { st.mouse.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); },
    render(dt) {
      st.time += dt; u.uTime.value = st.time;
      sm.t += (st.t - sm.t) * Math.min(1, dt * 3.2); sm.mx += (st.mouse.x - sm.mx) * Math.min(1, dt * 3); sm.my += (st.mouse.y - sm.my) * Math.min(1, dt * 3);
      const L = chapters.length - 1; const f = sm.t * L; const k = Math.min(L - 1, Math.floor(f)); const local = f - k;
      setSeg(k);
      // the next room forms as you approach it: fully built just before you arrive
      u.uMorph.value = THREE.MathUtils.smoothstep(local, 0.05, 0.7);
      u.uDim.value = THREE.MathUtils.lerp(dims[chapters[k].form] ?? 1, dims[chapters[k + 1].form] ?? 1, u.uMorph.value);
      // camera walks from station k to station k+1, arriving at the room's threshold
      const a = stations[k], b = stations[k + 1];
      const z = THREE.MathUtils.lerp(a.z + 14, b.z + 14, local);
      camera.position.set(sm.mx * 1.2 + Math.sin(st.time * 0.3) * 0.15, 1.65 + sm.my * 0.4 + Math.sin(st.time * 0.7) * 0.03, z);
      camera.lookAt(sm.mx * 3.5, 2.0 + sm.my * 2.2, z - 20);
      u.uCursor.value.copy(st.mouse);
      screens.forEach((s) => { const target = s.i === k + 1 ? u.uMorph.value : s.i === k ? 1 - THREE.MathUtils.smoothstep(local, 0.0, 0.5) : 0; s.mesh.material.opacity += (target * 0.95 - s.mesh.material.opacity) * Math.min(1, dt * 4); s.mesh.visible = s.mesh.material.opacity > 0.01; });
      composer.render();
    },
  };
  api.resize(); return api;
}
