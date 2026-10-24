import gsap from 'gsap';
/* Twenty years. A playhead you drag. The years answer. */
export function createTimeline(root, years, { onYear, sound }) {
  const track = root.querySelector('.tl__track'), head = root.querySelector('.tl__head'), ticks = root.querySelector('.tl__ticks');
  ticks.innerHTML = years.map((y) => `<span><i></i><b>${y[0].slice(2)}</b></span>`).join('');
  let pos = 0, last = -1, drag = false;
  const set = (p) => { pos = Math.max(0, Math.min(1, p)); gsap.to(head, { left: `${pos * 100}%`, duration: .15, ease: 'power2.out' }); const i = Math.round(pos * (years.length - 1)); ticks.children[i]?.classList.add('on'); if (i !== last) { last = i; [...ticks.children].forEach((t, k) => t.classList.toggle('on', k === i)); sound?.pin?.(); onYear?.(years[i], i); } };
  const at = (e) => { const r = track.getBoundingClientRect(); return (e.clientX - r.left) / r.width; };
  track.addEventListener('pointerdown', (e) => { drag = true; track.setPointerCapture?.(e.pointerId); set(at(e)); }); track.addEventListener('pointermove', (e) => { if (drag) set(at(e)); }); const up = () => (drag = false); track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
  return { set, get pos() { return pos; } };
}
