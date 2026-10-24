import gsap from 'gsap';
import { projects } from '../data.js';
/* An infinite wall of tiles. Drag it, throw it, scroll it sideways. Wraps on both axes. */
export function initArchive({ openCase, reduced }) {
  const wall = document.getElementById('wall'), plane = document.getElementById('wallPlane'), filters = document.getElementById('archiveFilters');
  const kinds = ['All', ...new Set(projects.map((p) => p.kind))];
  filters.innerHTML = kinds.map((k, i) => `<button class="${i === 0 ? 'is-on' : ''}" data-kind="${k}">${k}</button>`).join('');
  const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year));
  const cols = 7, tileW = () => Math.min(300, Math.max(200, innerWidth * .2)), gapX = 28, rowH = () => tileW() * .75 + 72;
  plane.innerHTML = sorted.map((p, i) => `
    <a class="tile" href="#project-${p.id}" data-id="${p.id}" data-kind="${p.kind}" data-cursor="open" data-cursor-label="Open" style="--rot:${((i * 37) % 7 - 3) * .8}deg">
      <div class="tile__media"><img src="${p.images[Math.min(1, p.images.length - 1)]}" alt="${p.title}" loading="lazy" draggable="false" /></div>
      <strong>${p.title}</strong><span class="mono">${p.kind} · ${p.year}</span></a>`).join('');
  const tiles = [...plane.querySelectorAll('.tile')];
  const rows = Math.ceil(tiles.length / cols);
  const pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 }; let dragging = false, moved = 0, last = null;
  const W = () => cols * (tileW() + gapX), H = () => rows * rowH();
  const layout = () => {
    const tw = tileW(), rh = rowH(), w = W(), h = H(), vw = wall.clientWidth, vh = wall.clientHeight;
    plane.style.setProperty('--w', `${tw}px`);
    tiles.forEach((t, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      let x = c * (tw + gapX) + (r % 2) * (tw / 2) + pos.x, y = r * rh + pos.y + 20;
      x = ((x % w) + w) % w; y = ((y % h) + h) % h;
      if (x > vw + tw) x -= w; if (y > vh + rh) y -= h; // keep wrapped tiles just off the visible edges
      t.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };
  const tick = () => {
    if (!dragging) { pos.x += vel.x; pos.y += vel.y; vel.x *= .94; vel.y *= .94; if (!reduced && Math.abs(vel.x) < .05) pos.x -= .25; }
    layout(); requestAnimationFrame(tick);
  };
  tick(); addEventListener('resize', layout);
  wall.addEventListener('pointerdown', (e) => { dragging = true; moved = 0; last = { x: e.clientX, y: e.clientY }; wall.setPointerCapture(e.pointerId); });
  wall.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - last.x, dy = e.clientY - last.y; pos.x += dx; pos.y += dy; vel.x = dx; vel.y = dy; moved += Math.abs(dx) + Math.abs(dy); last = { x: e.clientX, y: e.clientY }; });
  const up = () => { dragging = false; };
  wall.addEventListener('pointerup', up); wall.addEventListener('pointercancel', up);
  wall.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); pos.x -= e.deltaX; } }, { passive: false });
  tiles.forEach((t) => t.addEventListener('click', (e) => { e.preventDefault(); if (moved > 8) return; openCase(t.dataset.id, e.clientX, e.clientY); }));
  filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; filters.querySelectorAll('button').forEach((x) => x.classList.toggle('is-on', x === b)); tiles.forEach((t) => t.classList.toggle('is-hidden', b.dataset.kind !== 'All' && t.dataset.kind !== b.dataset.kind)); });
}
