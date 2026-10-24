/* Marker paint: an image is revealed through a sequence of thick marker strokes. progress 0..1 = how many strokes are down. */
const rnd = (a, b) => a + Math.random() * (b - a);
export function createPainter(canvas, src, { strokes = 26, angle = -0.35, seed = 1 } = {}) {
  const ctx = canvas.getContext('2d');
  const img = new Image(); img.decoding = 'async'; img.src = src;
  let W = 0, H = 0, paths = [], ready = false, last = -1, dpr = 1;
  const build = () => {
    paths = [];
    const diag = Math.hypot(W, H);
    for (let i = 0; i < strokes; i++) {
      // strokes sweep across the sheet in bands, with a hand's wobble; later strokes fill the gaps
      const band = (i + 0.5) / strokes;
      const y0 = band * H * 1.15 - H * 0.08 + rnd(-H * 0.03, H * 0.03);
      const pts = []; const n = 6;
      for (let k = 0; k <= n; k++) { const t = k / n; const x = -W * 0.12 + t * W * 1.24; const y = y0 + Math.sin(t * Math.PI * rnd(1, 2.4) + i) * H * 0.025 + Math.tan(angle) * (x - W / 2) * 0.12; pts.push([x, y]); }
      paths.push({ pts, w: diag * rnd(0.055, 0.085), flip: i % 2 });
    }
  };
  const resize = () => { dpr = Math.min(devicePixelRatio, 2); const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); build(); last = -1; };
  img.onload = () => { ready = true; last = -1; };
  const cover = () => { const ir = img.width / img.height, cr = W / H; let w = W, h = H, x = 0, y = 0; if (ir > cr) { w = H * ir; x = (W - w) / 2; } else { h = W / ir; y = (H - h) / 2; } return [x, y, w, h]; };
  const api = {
    resize,
    draw(p) {
      if (!ready || W === 0) return; p = Math.max(0, Math.min(1, p)); if (Math.abs(p - last) < 0.004 && last !== -1) return; last = p;
      ctx.clearRect(0, 0, W, H); if (p <= 0) return;
      ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000';
      const total = p * paths.length;
      paths.forEach((s, i) => {
        const local = Math.max(0, Math.min(1, total - i)); if (local <= 0) return;
        ctx.lineWidth = s.w; ctx.beginPath();
        const pts = s.flip ? [...s.pts].reverse() : s.pts; const upto = Math.max(1, Math.floor(local * (pts.length - 1)));
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let k = 1; k <= upto; k++) ctx.lineTo(pts[k][0], pts[k][1]);
        if (upto < pts.length - 1) { const f = local * (pts.length - 1) - upto; const a = pts[upto], b = pts[upto + 1]; ctx.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); }
        ctx.stroke();
      });
      ctx.globalCompositeOperation = 'source-in'; ctx.drawImage(img, ...cover()); ctx.restore();
    },
  };
  resize(); return api;
}
