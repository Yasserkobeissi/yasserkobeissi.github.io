import * as THREE from 'three';
import { createHead } from './head.js';
/* The head lives on a cinematic warm backdrop for the intro, then stands on cream for the playground, then leaves. */
const bgVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const bgFrag = /* glsl */`
precision highp float; varying vec2 vUv; uniform float uMix; uniform float uTime; uniform vec2 uRes; uniform float uAlpha;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
void main(){
  vec2 uv = vUv; float a = uRes.x / uRes.y;
  vec2 c = vec2(0.62, 0.5); float d = length((uv - c) * vec2(a, 1.0));
  vec3 warm = mix(vec3(0.96, 0.52, 0.22), vec3(0.16, 0.07, 0.05), smoothstep(0.08, 0.95, d + 0.06 * sin(uTime * 0.2 + uv.y * 3.0)));
  warm = mix(warm, vec3(0.99, 0.80, 0.52), smoothstep(0.35, 0.0, d) * 0.55);
  vec3 cream = vec3(0.937, 0.914, 0.875);
  vec3 col = mix(warm, cream, uMix);
  col += (hash(uv * uTime * 60.0) - 0.5) * 0.035 * (1.0 - uMix * 0.6);
  gl_FragColor = vec4(col, uAlpha);
}`;
export async function createScene(canvas, { reduced, onProgress }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6)); renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50); camera.position.set(0, 0, 4.4);
  const loader = new THREE.TextureLoader();
  const tex = (src) => new Promise((res, rej) => loader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, rej));
  const [color, depth] = await Promise.all([tex('/yasser/head.png'), tex('/yasser/head-depth.png')]); depth.colorSpace = THREE.NoColorSpace;
  onProgress?.(1);
  const bgU = { uMix: { value: 0 }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uAlpha: { value: 1 } };
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: bgVert, fragmentShader: bgFrag, uniforms: bgU, depthWrite: false, depthTest: false, transparent: true }));
  bg.renderOrder = -1; scene.add(bg);
  const head = createHead(color, depth); head.u.uXray.value = 0; head.u.uDisp.value = 0.5; scene.add(head.group);
  const st = { t: 0, hide: 0, mouse: new THREE.Vector2(), time: 0, wobble: 0 };
  const sm = { mx: 0, my: 0, t: 0, hide: 0 };
  const api = {
    head, st,
    resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); bgU.uRes.value.set(innerWidth, innerHeight); },
    pointer(x, y) { st.mouse.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); },
    poke() { st.wobble = 1; },
    render(dt) {
      st.time += dt; bgU.uTime.value = st.time;
      sm.mx += (st.mouse.x - sm.mx) * Math.min(1, dt * 4); sm.my += (st.mouse.y - sm.my) * Math.min(1, dt * 4);
      sm.t += (st.t - sm.t) * Math.min(1, dt * 5); sm.hide += (st.hide - sm.hide) * Math.min(1, dt * 5);
      const t = sm.t, wide = innerWidth > 900;
      // intro: big, right of centre, turned toward the copy. playground: centred, smaller, facing the visitor.
      const introPos = new THREE.Vector3(wide ? 0.95 : 0.2, -0.55, 0), playPos = new THREE.Vector3(0, wide ? -0.12 : -0.05, 0);
      head.group.position.lerpVectors(introPos, playPos, t);
      const s = THREE.MathUtils.lerp(wide ? 1.55 : 1.25, wide ? 0.92 : 0.8, t); head.group.scale.setScalar(s);
      st.wobble *= 0.94; const w = Math.sin(st.time * 26) * st.wobble * 0.18;
      head.group.rotation.y = THREE.MathUtils.lerp(-0.42, 0, t) + sm.mx * (0.16 + 0.22 * t) + w + (reduced ? 0 : Math.sin(st.time * 0.5) * 0.02);
      head.group.rotation.x = -sm.my * (0.06 + 0.12 * t) + Math.cos(st.time * 20) * st.wobble * 0.05;
      head.group.position.y += (1 - sm.hide) * 0 + sm.hide * 2.2; // leaves upward after the playground
      head.u.uTime.value = st.time; head.u.uMouse.value.set(-9, -9);
      bgU.uMix.value = t; bgU.uAlpha.value = 1 - sm.hide;
      head.mesh.visible = sm.hide < 0.98;
      renderer.render(scene, camera);
    },
  };
  api.resize(); return api;
}
