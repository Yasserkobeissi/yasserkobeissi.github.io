/* The visitor draws on the site. A marker line that follows the cursor and slowly dries. */
export function createInk(canvas, { reduced }) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, last = null, strokes = [];
  const color = () => getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#ff4d2e';
  const resize = () => { dpr = Math.min(devicePixelRatio, 2); w = innerWidth; h = innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  if (reduced || matchMedia('(hover:none)').matches) return { clear() {} };
  let drawing = false;
  addEventListener('pointerdown', (e) => { if (e.target.closest('.wall, .case, button, a')) return; drawing = true; last = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointerup', () => { drawing = false; last = null; });
  addEventListener('pointermove', (e) => {
    const p = { x: e.clientX, y: e.clientY, t: performance.now(), c: color() };
    if (last) { const d = Math.hypot(p.x - last.x, p.y - last.y); strokes.push({ a: last, b: p, t: p.t, hold: drawing, w: drawing ? 7 : Math.max(1.5, 6 - d * 0.05) }); }
    last = drawing || true ? p : null;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { last = null; });
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    const now = performance.now();
    strokes = strokes.filter((s) => s.hold || now - s.t < 1400);
    for (const s of strokes) {
      const age = now - s.t; const a = s.hold ? 0.9 : 1 - age / 1400;
      ctx.strokeStyle = s.a.c; ctx.globalAlpha = a; ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  };
  tick();
  return { clear() { strokes = []; } };
}
