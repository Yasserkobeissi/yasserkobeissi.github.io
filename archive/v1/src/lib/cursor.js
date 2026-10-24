import gsap from 'gsap';
export function createCursor() {
  const el = document.querySelector('.cursor');
  if (!el || matchMedia('(hover:none)').matches) return;
  const x = gsap.quickTo(el, 'x', { duration: .3, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: .3, ease: 'power3' });
  addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); el.classList.remove('is-hidden'); }, { passive: true });
  document.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
  const label = el.querySelector('.cursor__label');
  const set = (mode, text) => { ['open', 'drag', 'brush', 'link'].forEach((m) => el.classList.toggle(`is-${m}`, mode === m)); if (text) label.textContent = text; };
  document.addEventListener('pointerover', (e) => { const t = e.target.closest('[data-cursor], a, button'); if (!t) return set(''); set(t.dataset.cursor || 'link', t.dataset.cursorLabel); });
  document.addEventListener('pointerout', (e) => { if (e.target.closest('[data-cursor], a, button')) set(''); });
}
