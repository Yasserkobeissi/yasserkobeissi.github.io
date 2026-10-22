/* The LED wall: a dark grid of panels over the stage. Click to power them. After a few, the rest cascade on. */
export function createLed(root, src, { cols = 8, rows = 5, sound, onLit } = {}) {
  root.style.setProperty('--cols', cols); root.style.setProperty('--rows', rows);
  root.innerHTML = Array.from({ length: cols * rows }, (_, i) => `<button class="led" style="--x:${(i % cols) / (cols - 1) * 100}%;--y:${Math.floor(i / cols) / (rows - 1) * 100}%;background-image:url('${src}')" aria-label="Panel ${i + 1}"></button>`).join('');
  const tiles = [...root.children]; let lit = 0, clicks = 0, cascading = false;
  const light = (t, delay = 0) => { if (t.classList.contains('on')) return; setTimeout(() => { t.classList.add('on'); sound?.pin?.(); lit++; onLit?.(lit / tiles.length); }, delay); };
  tiles.forEach((t, i) => t.addEventListener('click', () => { if (!t.classList.contains('on')) clicks++; light(t); if (clicks >= 5 && !cascading) { cascading = true; const c = i % cols, r = Math.floor(i / cols); tiles.forEach((u, j) => { const cc = j % cols, rr = Math.floor(j / cols); light(u, Math.hypot(cc - c, rr - r) * 70 + 120); }); } }));
  return { all() { if (cascading) return; cascading = true; tiles.forEach((u, j) => light(u, j * 25)); } };
}
