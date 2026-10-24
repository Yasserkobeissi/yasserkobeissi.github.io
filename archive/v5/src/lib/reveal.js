/* Draw to reveal: the visitor's own strokes uncover the image. Past a threshold the marker finishes the sheet by itself. */
export function createReveal(canvas, src, { onProgress, onDone, sound } = {}) {
  const ctx = canvas.getContext('2d'); const img = new Image(); img.src = src; let W = 0, H = 0, dpr = 1, ready = false, mask = document.createElement('canvas'), mctx = mask.getContext('2d'), covered = 0, done = false, last = null, auto = null;
  const resize = () => { dpr = Math.min(devicePixelRatio, 2); const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = mask.width = W * dpr; canvas.height = mask.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); mctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint(); };
  img.onload = () => { ready = true; paint(); };
  const cover = () => { const ir = img.width / img.height, cr = W / H; let w = W, h = H, x = 0, y = 0; if (ir > cr) { w = H * ir; x = (W - w) / 2; } else { h = W / ir; y = (H - h) / 2; } return [x, y, w, h]; };
  const paint = () => { if (!ready) return; ctx.clearRect(0, 0, W, H); ctx.save(); ctx.drawImage(mask, 0, 0, W, H); ctx.globalCompositeOperation = 'source-in'; ctx.drawImage(img, ...cover()); ctx.restore(); };
  const stroke = (a, b, w) => { mctx.strokeStyle = '#000'; mctx.lineCap = 'round'; mctx.lineJoin = 'round'; mctx.lineWidth = w; mctx.beginPath(); mctx.moveTo(a.x, a.y); mctx.lineTo(b.x, b.y); mctx.stroke(); };
  const measure = () => { const s = 24; const d = mctx.getImageData(0, 0, mask.width, mask.height).data; let n = 0, t = 0; for (let y = 0; y < mask.height; y += s) for (let x = 0; x < mask.width; x += s) { t++; if (d[(y * mask.width + x) * 4 + 3] > 0) n++; } return n / t; };
  const finish = () => { if (done) return; done = true; onProgress?.(1);
    // the marker takes over: sweeping strokes until the sheet is full
    let i = 0; const total = 22; const step = () => { const y = (i / total) * H * 1.1 - H * .05; stroke({ x: -W * .1, y: y + Math.sin(i) * 12 }, { x: W * 1.1, y: y + Math.cos(i) * 12 }, Math.max(W, H) * .09); paint(); sound?.scratch?.(60); i++; if (i <= total) auto = setTimeout(step, 55); else { onDone?.(); } }; step(); };
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  let n = 0;
  canvas.addEventListener('pointermove', (e) => { if (done) return; const p = pos(e); if (last) { stroke(last, p, Math.max(W, H) * .07); paint(); if (++n % 3 === 0) { covered = measure(); onProgress?.(covered); if (covered > .42) finish(); } } last = p; sound?.scratch?.(Math.hypot(e.movementX, e.movementY)); }, { passive: true });
  canvas.addEventListener('pointerleave', () => (last = null));
  canvas.addEventListener('pointerup', () => { if (done) return; covered = measure(); onProgress?.(covered); if (covered > .42) finish(); });
  canvas.addEventListener('pointerdown', (e) => { last = pos(e); });
  resize(); addEventListener('resize', resize);
  return { finish, resize, get done() { return done; } };
}
