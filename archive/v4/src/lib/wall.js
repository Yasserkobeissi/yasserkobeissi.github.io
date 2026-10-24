/* The drawer: every room as a polaroid on a desk you can drag around, wrapping forever. */
export function createWall(wall, plane, items, { onOpen, reduced, sound }) {
  const cols = 7, rows = Math.ceil(items.length / cols);
  const tw = () => Math.min(280, Math.max(190, innerWidth * 0.19)), th = () => tw() * 1.18 + 20, gap = 36;
  plane.innerHTML = items.map((p, i) => `<a class="pol" href="#room-${p.id}" data-id="${p.id}" data-k="${p.kind}" style="--rot:${((i * 53) % 9 - 4) * 1.1}deg" data-label="Open"><span class="pol__ph"><img src="${p.cover}" alt="${p.name}" loading="lazy" draggable="false" /></span><span class="hand">${p.name}</span><span class="mono">${p.kind} · ${p.year}</span></a>`).join('');
  const tiles = [...plane.children]; const pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 }; let drag = false, moved = 0, last = null;
  const W = () => cols * (tw() + gap), H = () => rows * th();
  const layout = () => { const w = W(), h = H(), vw = wall.clientWidth, vh = wall.clientHeight, t = tw(), r = th(); plane.style.setProperty('--w', `${t}px`); tiles.forEach((el, i) => { const c = i % cols, rr = Math.floor(i / cols); let x = c * (t + gap) + (rr % 2) * (t / 2) + pos.x, y = rr * r + pos.y + 24; x = ((x % w) + w) % w; y = ((y % h) + h) % h; if (x > vw + t) x -= w; if (y > vh + r) y -= h; el.style.transform = `translate3d(${x}px,${y}px,0) rotate(var(--rot))`; }); };
  const tick = () => { if (!drag) { pos.x += vel.x; pos.y += vel.y; vel.x *= .93; vel.y *= .93; if (!reduced && Math.abs(vel.x) < .05) pos.x -= .2; } layout(); requestAnimationFrame(tick); };
  tick(); addEventListener('resize', layout);
  wall.addEventListener('pointerdown', (e) => { drag = true; moved = 0; last = { x: e.clientX, y: e.clientY }; wall.setPointerCapture(e.pointerId); });
  wall.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - last.x, dy = e.clientY - last.y; pos.x += dx; pos.y += dy; vel.x = dx; vel.y = dy; moved += Math.abs(dx) + Math.abs(dy); last = { x: e.clientX, y: e.clientY }; });
  const up = () => (drag = false); wall.addEventListener('pointerup', up); wall.addEventListener('pointercancel', up);
  wall.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); pos.x -= e.deltaX; } }, { passive: false });
  tiles.forEach((t) => { t.addEventListener('click', (e) => { e.preventDefault(); if (moved > 8) return; sound?.pin(); onOpen(t.dataset.id); }); });
  return { filter(k) { tiles.forEach((t) => t.classList.toggle('dim', k !== 'All' && t.dataset.k !== k)); } };
}
