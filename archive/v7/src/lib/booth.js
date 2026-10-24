/* The card you take home. Drawn on canvas, flash, download. */
export function createBooth(canvas, { name, line, card }) {
  const dpr = 2, W = 900, H = 560; canvas.width = W * dpr; canvas.height = H * dpr; const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  ctx.fillStyle = '#f3ecde'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#ff4d2e'; ctx.fillRect(0, 0, W, 14);
  ctx.fillStyle = '#15120e'; ctx.font = '500 16px "JetBrains Mono", monospace'; ctx.fillText('GUEST', 48, 72);
  ctx.font = '800 92px "Archivo", sans-serif'; const n = name.toUpperCase(); let size = 92; while (ctx.measureText(n).width > W - 96 && size > 40) { size -= 4; ctx.font = `800 ${size}px "Archivo", sans-serif`; } ctx.fillText(n, 44, 180);
  ctx.font = 'italic 34px "Instrument Serif", serif'; const words = line.split(' '); let ln = '', y = 270; for (const w of words) { const t = ln + w + ' '; if (ctx.measureText(t).width > W - 96) { ctx.fillText(ln, 48, y); ln = w + ' '; y += 42; } else ln = t; } ctx.fillText(ln, 48, y);
  ctx.fillStyle = '#6f6a62'; ctx.font = '500 14px "JetBrains Mono", monospace'; ctx.fillText(card, 48, H - 48);
  ctx.strokeStyle = '#15120e'; ctx.lineWidth = 2; ctx.strokeRect(W - 150, H - 150, 100, 100); ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.fillText('SIGNED, YK', W - 142, H - 60);
  return { download() { const a = document.createElement('a'); a.download = `guest-of-yasser-${name.toLowerCase().replace(/\s+/g, '-')}.png`; a.href = canvas.toDataURL('image/png'); a.click(); } };
}
