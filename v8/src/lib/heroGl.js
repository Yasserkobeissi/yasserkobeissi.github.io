import * as THREE from 'three';
/* The hero image, breathing. A slow drift, a soft fluid displacement under the cursor, grain. */
const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`;
const frag = /* glsl */`precision highp float; varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uRes; uniform vec2 uImg; uniform float uTime; uniform vec2 uMouse; uniform float uStrength;
vec2 cover(vec2 uv){ float ra=uRes.x/uRes.y, ri=uImg.x/uImg.y; vec2 s = ra>ri ? vec2(1.0, ri/ra) : vec2(ra/ri, 1.0); return (uv-0.5)*s+0.5; }
float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main(){ vec2 uv = vUv; float z = 1.0 - 0.03 * (0.5 + 0.5*sin(uTime*0.12)); uv = (uv-0.5)*z + 0.5 + vec2(sin(uTime*0.07), cos(uTime*0.05))*0.006;
  vec2 d = (uv - uMouse) * vec2(uRes.x/uRes.y, 1.0); float r = length(d); float w = smoothstep(0.35, 0.0, r) * uStrength; uv += normalize(d + 1e-5) * w * 0.02 * sin(r*30.0 - uTime*2.0);
  vec2 c = cover(uv); vec3 col = texture2D(uTex, c).rgb; float lum = dot(col, vec3(.299,.587,.114)); col = mix(vec3(lum), col, 0.55); col *= 0.92; col += (hash(uv*uTime*50.0)-0.5)*0.03; gl_FragColor = vec4(col,1.0); }`;
export function createHeroGl(canvas, src) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene(); const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const u = { uTex: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uImg: { value: new THREE.Vector2(16, 9) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) }, uStrength: { value: 0 } };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u })));
  new THREE.TextureLoader().load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; u.uTex.value = t; u.uImg.value.set(t.image.width, t.image.height); });
  const sm = new THREE.Vector2(.5, .5); let target = new THREE.Vector2(.5, .5), str = 0;
  return { resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); u.uRes.value.set(r.width, r.height); }, pointer(x, y, inside) { const r = canvas.getBoundingClientRect(); target.set((x - r.left) / r.width, 1 - (y - r.top) / r.height); str = inside ? 1 : 0; }, render(dt) { u.uTime.value += dt; sm.lerp(target, Math.min(1, dt * 3)); u.uMouse.value.copy(sm); u.uStrength.value += (str - u.uStrength.value) * Math.min(1, dt * 3); if (u.uTex.value) renderer.render(scene, camera); } };
}
