import * as THREE from 'three';
/* His portrait as a depth-displaced surface. Outside it is a photo; under the cursor and on scroll it becomes an x-ray. */
const vert = /* glsl */`
uniform sampler2D uDepth; uniform float uDisp; varying vec2 vUv; varying float vD;
void main(){ vUv = uv; float d = texture2D(uDepth, uv).r; vD = d; vec3 p = position; p.z += (d - 0.35) * uDisp; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`;
const frag = /* glsl */`
precision highp float;
uniform sampler2D uColor; uniform sampler2D uDepth; uniform float uXray; uniform vec2 uMouse; uniform float uMouseR; uniform float uTime; uniform float uReveal; uniform vec3 uLine; uniform float uTexel;
varying vec2 vUv; varying float vD;
void main(){
  vec4 c = texture2D(uColor, vUv); if (c.a < 0.03) discard;
  float dx = texture2D(uDepth, vUv + vec2(uTexel, 0.)).r - texture2D(uDepth, vUv - vec2(uTexel, 0.)).r;
  float dy = texture2D(uDepth, vUv + vec2(0., uTexel)).r - texture2D(uDepth, vUv - vec2(0., uTexel)).r;
  float e = clamp(length(vec2(dx, dy)) * 13., 0., 1.);
  float rings = smoothstep(0.9, 1., abs(fract(vD * 26. - uTime * 0.08) * 2. - 1.));
  float local = 1. - smoothstep(uMouseR * 0.3, uMouseR, distance(vUv, uMouse));
  float x = clamp(uXray + local, 0., 1.);
  vec3 paper = vec3(0.90, 0.94, 1.0); vec3 xr = mix(paper, uLine, clamp(e * 1.3 + rings * 0.5, 0., 1.));
  vec3 col = mix(c.rgb, xr, x);
  float a = mix(c.a, c.a * (0.10 + e * 0.9 + rings * 0.35), x);
  // loading him in: the image resolves from the centre of the face outward
  float rv = 1.0 - smoothstep(uReveal - 0.35, uReveal, distance(vUv, vec2(0.5, 0.42)));
  a *= rv;
  gl_FragColor = vec4(col, a);
}`;
export function createHead(color, depth) {
  const aspect = color.image.height / color.image.width;
  const geo = new THREE.PlaneGeometry(2.3, 2.3 * aspect, 220, 220);
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uColor: { value: color }, uDepth: { value: depth }, uDisp: { value: 0.55 }, uXray: { value: 0 }, uMouse: { value: new THREE.Vector2(-9, -9) }, uMouseR: { value: 0.26 }, uTime: { value: 0 }, uReveal: { value: -0.5 }, uLine: { value: new THREE.Color('#1b35ff') }, uTexel: { value: 1 / color.image.width } } });
  const mesh = new THREE.Mesh(geo, mat);
  const group = new THREE.Group(); group.add(mesh);
  return { group, mesh, u: mat.uniforms };
}
