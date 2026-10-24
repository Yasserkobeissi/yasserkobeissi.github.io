import * as THREE from 'three';
/* A booth built from boxes. Scroll progress assembles it piece by piece: wire first, then solid. */
export function createBooth(canvas, { reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const rig = new THREE.Group(); scene.add(rig);
  const paper = new THREE.Color('#f3eee4'), coral = new THREE.Color('#ff4d2e'), yellow = new THREE.Color('#ffc94a'), cobalt = new THREE.Color('#1b35ff');
  scene.add(new THREE.HemisphereLight('#ffffff', '#22201c', 1.1));
  const key = new THREE.DirectionalLight('#fff4e0', 2.2); key.position.set(5, 9, 6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8; key.shadow.bias = -0.0005; scene.add(key);
  const fill = new THREE.DirectionalLight('#cfe0ff', 0.5); fill.position.set(-6, 3, -4); scene.add(fill);

  // pieces: [w,h,d, x,y,z, color, fromOffset]
  const P = [
    [8, .12, 6, 0, -.06, 0, paper, [0, -3, 0]],            // floor
    [.14, 3.2, 6, -3.93, 1.6, 0, paper, [-4, 0, 0]],      // back-left wall
    [8, 3.2, .14, 0, 1.6, -2.93, paper, [0, 0, -4]],      // back wall
    [3.2, 2.2, .06, 0, 1.75, -2.85, cobalt, [0, 2, -2]],  // LED screen
    [2.2, 1.0, .9, -1.6, .5, 1.4, coral, [-3, 0, 3]],     // counter
    [.8, 1.0, .8, 2.4, .5, 1.2, yellow, [3, 0, 3]],       // plinth
    [.5, .5, .5, 2.4, 1.25, 1.2, paper, [0, 3, 0]],       // object on plinth
    [6.4, .18, .18, 0, 3.4, 0, paper, [0, 3, 0]],         // truss
    [.18, .18, 5.0, 0, 3.4, 0, paper, [0, 3, 0]],         // truss
    [2.6, .5, .12, 0, 2.95, -2.7, coral, [0, 1.5, 0]],    // header sign
    [.1, 1.2, .1, -3.6, 3.0, 2.6, yellow, [0, 2, 0]],     // light pole
    [.1, 1.2, .1, 3.6, 3.0, 2.6, yellow, [0, 2, 0]],
    [1.6, .5, 1.6, 1.8, .25, -1.4, paper, [2, 0, 0]],     // seating
    [.6, .9, .6, -2.6, .45, -1.6, cobalt, [-2, 0, 0]],    // totem
  ];
  const pieces = P.map((p, i) => {
    const geo = new THREE.BoxGeometry(p[0], p[1], p[2]);
    const mat = new THREE.MeshStandardMaterial({ color: p[6], roughness: .7, metalness: 0, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: '#f3eee4', transparent: true, opacity: 0 }));
    mesh.add(edges);
    const home = new THREE.Vector3(p[3], p[4], p[5]);
    const from = home.clone().add(new THREE.Vector3(...p[7])).add(new THREE.Vector3((Math.random() - .5) * 2, 2 + Math.random() * 2, (Math.random() - .5) * 2));
    mesh.position.copy(from); rig.add(mesh);
    return { mesh, edges, home, from, t0: i / P.length };
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#17161a', roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.13; ground.receiveShadow = true; scene.add(ground);
  const grid = new THREE.GridHelper(40, 40, '#f3eee4', '#f3eee4'); grid.material.transparent = true; grid.material.opacity = .08; grid.position.y = -.12; scene.add(grid);

  const state = { progress: 0, mouse: new THREE.Vector2(), shown: 0 };
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const api = {
    set(p) { state.progress = p; },
    pointer(x, y) { state.mouse.set(x / innerWidth - .5, y / innerHeight - .5); },
    resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); },
    render(dt) {
      state.shown += (state.progress - state.shown) * Math.min(1, dt * 4);
      const p = state.shown;
      for (const pc of pieces) {
        const local = THREE.MathUtils.clamp((p * 1.15 - pc.t0 * 0.75) / 0.35, 0, 1);
        const e = ease(local);
        pc.mesh.position.lerpVectors(pc.from, pc.home, e);
        pc.mesh.rotation.y = (1 - e) * 1.2; pc.mesh.rotation.x = (1 - e) * .5;
        pc.edges.material.opacity = Math.min(1, local * 2) * (1 - Math.max(0, local - .6) * 1.6);
        pc.mesh.material.opacity = Math.max(0, local - .4) / .6;
      }
      const wide = innerWidth < 900;
      const orbit = -0.9 + p * 1.3 + state.mouse.x * .35;
      const rad = wide ? 15 : 11.5;
      camera.position.set(Math.sin(orbit) * rad, 4.2 + state.mouse.y * -1 + (1 - p) * 2, Math.cos(orbit) * rad);
      camera.lookAt(wide ? 0 : -2.6, 1.3, 0);
      renderer.render(scene, camera);
    },
  };
  api.resize();
  return api;
}
