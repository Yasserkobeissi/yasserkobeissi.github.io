import gsap from 'gsap';
export function playLoader({ reduced, onDone }) {
  const el = document.getElementById('loader');
  const path = document.getElementById('markPath');
  const len = path.getTotalLength();
  const count = document.getElementById('loaderCount');
  if (reduced) { el.remove(); onDone(); return; }
  path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  const n = { v: 0 };
  gsap.timeline({ onComplete: () => { el.remove(); onDone(); } })
    .to(path, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut' }, 0)
    .to(n, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(3, '0')) }, 0)
    .to('.loader__line', { opacity: 1, y: -8, duration: .8, ease: 'power3.out' }, 1.1)
    .to('.loader__mark', { scale: .86, duration: .9, ease: 'expo.inOut' }, 2.2)
    .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut' }, 2.4);
}
