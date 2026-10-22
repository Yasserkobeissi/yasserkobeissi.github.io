import gsap from 'gsap';
/* Scene changes: his hand wipes the screen. A flat colour sweeps diagonally, a hand silhouette leads it. */
export function createWipe() {
  const el = document.createElement('div'); el.className = 'wipe'; el.innerHTML = `<svg viewBox="0 0 120 160" class="wipe__hand" aria-hidden="true"><path d="M30 150 C 10 120 8 90 14 70 C 18 56 30 58 34 70 L 38 88 L 36 40 C 36 30 50 30 50 40 L 52 80 L 54 28 C 54 18 68 18 68 28 L 68 80 L 72 36 C 72 26 86 26 86 36 L 84 86 L 92 60 C 96 50 110 54 108 66 L 100 110 C 96 130 86 150 70 156 Z" fill="currentColor"/></svg>`; document.body.appendChild(el);
  let busy = false;
  return { go(color = '#ffb45c') { if (busy) return; busy = true; el.style.setProperty('--c', color); gsap.timeline({ onComplete: () => (busy = false) }).set(el, { clipPath: 'polygon(0 0, 0 0, -30% 100%, -30% 100%)', opacity: 1 }).to(el, { clipPath: 'polygon(0 0, 130% 0, 100% 100%, -30% 100%)', duration: .45, ease: 'power3.in' }).to(el, { clipPath: 'polygon(130% 0, 130% 0, 100% 100%, 100% 100%)', duration: .5, ease: 'power3.out' }).set(el, { opacity: 0 }); } };
}
