import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createHead } from './head.js';
import { createBrain } from './brain.js';

export async function createScene(canvas, { rooms, reduced, onProgress }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#ffffff');
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 80);
  const loader = new THREE.TextureLoader();
  const tex = (src) => new Promise((res, rej) => loader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearMipmapLinearFilter; res(t); }, undefined, rej));
  const [color, depth] = await Promise.all([tex('/yasser/head.png').catch(() => tex('/yasser/head-color.jpg')), tex('/yasser/head-depth.png').catch(() => null)]);
  onProgress?.(0.7);
  if (depth) depth.colorSpace = THREE.NoColorSpace;
  const fallbackDepth = depth || new THREE.DataTexture(new Uint8Array([90, 90, 90, 255]), 1, 1); if (!depth) fallbackDepth.needsUpdate = true;

  // the corridor through the mind
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.3, 1.6), new THREE.Vector3(-1.2, 0.8, -2.5), new THREE.Vector3(2.4, -0.6, -6.5), new THREE.Vector3(-0.8, 1.6, -11), new THREE.Vector3(2.2, 0.2, -16), new THREE.Vector3(-1.0, -0.4, -21), new THREE.Vector3(0, 0, -27),
  ], false, 'catmullrom', 0.4);
  const head = createHead(color, fallbackDepth);
  const brain = createBrain(curve, rooms);
  const brainAnchor = new THREE.Vector3(0.02, 0.5, -0.25); // inside the skull, in head units
  brain.group.position.copy(brainAnchor); brain.group.scale.setScalar(0.075);
  scene.add(head.group, brain.group);
  onProgress?.(1);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0, 0.55, 0.62); composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const st = { enter: 0, walk: 0, mouse: new THREE.Vector2(0, 0), uv: new THREE.Vector2(-9, -9), time: 0, idle: 0, hoverHead: false };
  const bgOut = new THREE.Color('#ffffff'), bgIn = new THREE.Color('#05070f'), bg = new THREE.Color();
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), look = new THREE.Vector3(), tmp = new THREE.Vector3();
  const smooth = { enter: 0, walk: 0, mx: 0, my: 0 };
  const api = {
    head, brain, camera, curve, scene, st,
    resize() { renderer.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); bloom.resolution.set(innerWidth, innerHeight); },
    pointer(x, y) { st.mouse.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); },
    project(p) { tmp.copy(p); brain.group.localToWorld(tmp); tmp.project(camera); return { x: (tmp.x + 1) / 2 * innerWidth, y: (1 - tmp.y) / 2 * innerHeight, z: tmp.z, inFront: tmp.z < 1 && tmp.z > -1 }; },
    render(dt) {
      st.time += dt; const t = st.time;
      smooth.enter += (st.enter - smooth.enter) * Math.min(1, dt * 5);
      smooth.walk += (st.walk - smooth.walk) * Math.min(1, dt * 4);
      smooth.mx += (st.mouse.x - smooth.mx) * Math.min(1, dt * 3); smooth.my += (st.mouse.y - smooth.my) * Math.min(1, dt * 3);
      const e = smooth.enter, w = smooth.walk;
      // outside: the head turns to the side as you approach, the x-ray rises
      const turn = THREE.MathUtils.smoothstep(e, 0, 0.6);
      head.group.rotation.y = 0.12 + turn * 0.55 + smooth.mx * 0.18 + (reduced ? 0 : Math.sin(t * 0.4) * 0.03);
      head.group.rotation.x = -smooth.my * 0.08;
      head.u.uTime.value = t;
      head.u.uXray.value = Math.max(0.1 + 0.06 * Math.sin(t * 1.3), THREE.MathUtils.smoothstep(e, 0.15, 0.7));
      head.mesh.material.opacity = 1; head.mesh.visible = e < 0.98;
      // camera: outside it sits in front of the face; approaching, it dollies into the skull while the brain grows to world scale
      const grow = THREE.MathUtils.smoothstep(e, 0.45, 1);
      const scale = THREE.MathUtils.lerp(0.075, 1, grow);
      brain.group.scale.setScalar(scale);
      brain.group.position.lerpVectors(brainAnchor, new THREE.Vector3(0, 0, 0), grow);
      brain.setOpacity(Math.max(0.0, Math.min(1, e * 1.6)));
      if (e < 1) {
        const dolly = THREE.MathUtils.smoothstep(e, 0.3, 1);
        const camOut = new THREE.Vector3(0.1 + smooth.mx * 0.12, 0.15 + smooth.my * 0.08, 3.1);
        const camIn = curve.getPoint(0);
        camera.position.lerpVectors(camOut, camIn, dolly);
        look.set(0, 0.25, 0).lerp(curve.getPoint(0.02), dolly);
        camera.lookAt(look);
        camera.fov = THREE.MathUtils.lerp(36, 48, dolly); camera.updateProjectionMatrix();
      } else {
        const tt = Math.min(0.995, w);
        camera.position.copy(curve.getPoint(tt));
        look.copy(curve.getPoint(Math.min(1, tt + 0.03))); look.x += smooth.mx * 0.8; look.y += smooth.my * 0.5;
        camera.lookAt(look);
      }
      // background and bloom follow the entry
      const exit = THREE.MathUtils.smoothstep(w, 0.93, 1);
      bg.copy(bgOut).lerp(bgIn, THREE.MathUtils.smoothstep(e, 0.35, 0.9) * (1 - exit)); scene.background = bg;
      bloom.strength = 0.55 * THREE.MathUtils.smoothstep(e, 0.45, 0.95) * (1 - exit);
      // cursor on the face → x-ray spot
      if (st.hoverHead && e < 0.5) { ndc.copy(st.mouse); ray.setFromCamera(ndc, camera); const hit = ray.intersectObject(head.mesh)[0]; if (hit) head.u.uMouse.value.copy(hit.uv); else head.u.uMouse.value.set(-9, -9); } else head.u.uMouse.value.set(-9, -9);
      brain.update(t, innerHeight * 0.05);
      composer.render();
    },
  };
  api.resize();
  return api;
}
