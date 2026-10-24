import gsap from 'gsap';
import { projects, byId } from '../data.js';
export function createCase({ lenis, reduced }) {
  const el = document.getElementById('case'), scroll = document.getElementById('caseScroll'), gallery = document.getElementById('caseGallery');
  let current = null, io = null; const widths = ['w12', 'w6', 'w6', 'w8', 'w4', 'w12', 'w4', 'w8', 'w6', 'w6'];
  const fill = (p) => {
    const i = projects.indexOf(p);
    document.getElementById('caseTitle').textContent = p.title; document.getElementById('caseKind').textContent = p.kind; document.getElementById('caseYear').textContent = p.year; document.getElementById('caseFields').textContent = p.fields.join(', '); document.getElementById('caseLink').href = p.url;
    document.getElementById('caseCount').textContent = `${String(i + 1).padStart(2, '0')} / ${projects.length}`;
    gallery.innerHTML = p.images.map((src, k) => `<figure class="case__fig ${widths[k % widths.length]}"><img src="${src}" alt="${p.title} frame ${k + 1}" loading="lazy" /></figure>`).join('');
    const next = projects[(i + 1) % projects.length]; document.getElementById('caseNextTitle').textContent = next.title; document.getElementById('caseNext').dataset.id = next.id;
    scroll.scrollTop = 0; io?.disconnect();
    io = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; gsap.to(en.target, { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0 : 1, ease: 'expo.out' }); io.unobserve(en.target); }), { root: scroll, rootMargin: '0px 0px -6% 0px' });
    gallery.querySelectorAll('.case__fig').forEach((f) => io.observe(f));
  };
  const open = (id) => { const p = byId[id]; if (!p) return; current = p; fill(p); el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); lenis?.stop(); history.replaceState(null, '', `#room-${id}`); gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: reduced ? 0 : .9, ease: 'expo.inOut' }); };
  const close = () => { if (!current) return; gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: reduced ? 0 : .7, ease: 'expo.inOut', onComplete: () => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); current = null; } }); lenis?.start(); history.replaceState(null, '', ' '); };
  document.getElementById('caseClose').addEventListener('click', close);
  document.getElementById('caseNext').addEventListener('click', (e) => open(e.currentTarget.dataset.id));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  return { open, close, isOpen: () => !!current };
}
