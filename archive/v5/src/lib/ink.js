/* The cursor is a marker. It leaves ink that dries. */
export function createInk(canvas, { reduced, onStroke }) {
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, last = null, strokes = []; let color = '#e0271c';
  const resize = () => { const dpr = Math.min(devicePixelRatio, 2); w = innerWidth; h = innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  if (reduced || matchMedia('(hover:none)').matches) return { setColor() {}, clear() {} };
  addEventListener('pointermove', (e) => {
    const p = { x: e.clientX, y: e.clientY, t: performance.now() };
    if (last) { const d = Math.hypot(p.x - last.x, p.y - last.y); if (d > 1) { strokes.push({ a: last, b: p, t: p.t, w: Math.max(2.5, 9 - d * 0.08), c: color }); onStroke?.(d); } }
    last = p;
  }, { passive: true });
  document.addEventListener('mouseleave', () => (last = null));
  const tick = () => { ctx.clearRect(0, 0, w, h); const now = performance.now(); strokes = strokes.filter((s) => now - s.t < 1800); for (const s of strokes) { const a = 1 - (now - s.t) / 1800; ctx.globalAlpha = a * 0.85; ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke(); } ctx.globalAlpha = 1; requestAnimationFrame(tick); };
  tick();
  return { setColor(c) { color = c; }, clear() { strokes = []; } };
}
