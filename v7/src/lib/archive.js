import gsap from 'gsap';
/* The work, if you insist. A full-screen strip you drag. */
export function createArchive(root, items, { onOpen, sound }) {
  const strip = root.querySelector('.arc__strip'); strip.innerHTML = items.map((p) => `<a class="arc__item" href="#room-${p.id}" data-id="${p.id}"><img src="${p.cover}" alt="${p.name}" loading="lazy" draggable="false" /><span class="arc__cap"><b>${p.name}</b><i class="mono">${p.kind} · ${p.year}</i></span></a>`).join('');
  let x = 0, vel = 0, drag = null, moved = 0; const max = () => strip.scrollWidth - innerWidth + 80;
  const tick = () => { if (!drag) { x += vel; vel *= .92; } x = Math.max(-max(), Math.min(0, x)); strip.style.transform = `translate3d(${x}px,0,0)`; requestAnimationFrame(tick); }; tick();
  root.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, s: x }; moved = 0; root.setPointerCapture?.(e.pointerId); }); root.addEventListener('pointermove', (e) => { if (!drag) return; const nx = drag.s + (e.clientX - drag.x); vel = nx - x; x = nx; moved += Math.abs(vel); }); const up = () => (drag = null); root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up);
  root.addEventListener('wheel', (e) => { e.preventDefault(); x -= (e.deltaY + e.deltaX) * 1.2; }, { passive: false });
  strip.querySelectorAll('.arc__item').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (moved > 8) return; onOpen(a.dataset.id); }));
  const open = () => { root.classList.add('on'); root.setAttribute('aria-hidden', 'false'); sound?.flip?.(); gsap.fromTo(strip.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .03, ease: 'expo.out' }); };
  const close = () => { root.classList.remove('on'); root.setAttribute('aria-hidden', 'true'); };
  root.querySelector('.arc__close').addEventListener('click', close); addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  return { open, close };
}
