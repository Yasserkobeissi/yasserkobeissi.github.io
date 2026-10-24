import gsap from 'gsap';
/* A volume knob. Drag it round. The page takes the hit. */
export function createKnob(root, { onLevel, sound }) {
  const knob = root.querySelector('.knob'), needle = root.querySelector('.knob__needle'), out = root.querySelector('.knob__val');
  let level = 0, drag = null;
  const set = (v) => { v = Math.max(0, Math.min(11, v)); if (Math.abs(v - level) < 0.01) return; level = v; const a = -135 + (v / 11) * 270; gsap.to(needle, { rotation: a, duration: .12, ease: 'power2.out' }); out.textContent = v.toFixed(0); root.style.setProperty('--lvl', v / 11); onLevel?.(v); };
  const angle = (e) => { const r = knob.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); };
  knob.addEventListener('pointerdown', (e) => { drag = { a: angle(e), v: level }; try { knob.setPointerCapture(e.pointerId); } catch {} });
  knob.addEventListener('pointermove', (e) => { if (!drag) return; let d = angle(e) - drag.a; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; set(drag.v + d / (Math.PI * 1.5) * 11); sound?.scratch?.(6); });
  knob.addEventListener('pointerup', () => (drag = null)); knob.addEventListener('pointercancel', () => (drag = null));
  knob.addEventListener('wheel', (e) => { e.preventDefault(); set(level - Math.sign(e.deltaY) * 0.5); }, { passive: false });
  return { set, get level() { return level; } };
}
