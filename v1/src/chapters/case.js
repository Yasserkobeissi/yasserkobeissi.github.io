import gsap from 'gsap';
import { projects, byId, studio } from '../data.js';
export function createCase({ lenis, reduced }) {
  const el = document.getElementById('case'), scroll = document.getElementById('caseScroll'), gallery = document.getElementById('caseGallery'), hero = document.getElementById('caseHero');
  let current = null, io = null; const widths = ['w12', 'w6', 'w6', 'w8', 'w4', 'w12', 'w4', 'w8', 'w6', 'w6'];
  const notes = Object.fromEntries(studio.featured.map((f) => [f.id, f.note]));
  const fill = (p) => {
    const i = projects.indexOf(p);
    document.getElementById('caseTitle').textContent = p.title; document.getElementById('caseNote').textContent = notes[p.id] || `${p.kind} in ${studio.brand.city}, drawn first, then built.`;
    document.getElementById('caseKind').textContent = p.kind; document.getElementById('caseYear').textContent = p.year; document.getElementById('caseFields').textContent = p.fields.join(', '); document.getElementById('caseLink').href = p.url;
    document.getElementById('caseCount').textContent = `${String(i + 1).padStart(2, '0')} / ${projects.length} · ${p.images.length} frames`;
    hero.src = p.images[Math.min(1, p.images.length - 1)];
    gallery.innerHTML = p.images.map((src, k) => `<figure class="case__fig ${widths[k % widths.length]}"><img src="${src}" alt="${p.title} frame ${k + 1}" loading="lazy" /></figure>`).join('');
    const next = projects[(i + 1) % projects.length]; document.getElementById('caseNextTitle').textContent = next.title; document.getElementById('caseNext').dataset.id = next.id;
    scroll.scrollTop = 0; io?.disconnect();
    io = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; const f = en.target; f.classList.add('is-in'); gsap.to(f, { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0 : 1.1, ease: 'expo.out' }); io.unobserve(f); }), { root: scroll, rootMargin: '0px 0px -8% 0px' });
    gallery.querySelectorAll('.case__fig').forEach((f) => io.observe(f));
  };
  const open = (id) => {
    const p = byId[id]; if (!p) return; current = p; fill(p);
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); lenis?.stop(); history.replaceState(null, '', `#project-${id}`);
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: reduced ? 0 : .9, ease: 'expo.inOut' });
    gsap.fromTo(hero, { scale: 1.15 }, { scale: 1, duration: reduced ? 0 : 1.6, ease: 'expo.out' });
  };
  const close = () => { if (!current) return; gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: reduced ? 0 : .8, ease: 'expo.inOut', onComplete: () => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); current = null; } }); lenis?.start(); history.replaceState(null, '', ' '); };
  document.getElementById('caseClose').addEventListener('click', close);
  document.getElementById('caseNext').addEventListener('click', (e) => open(e.currentTarget.dataset.id));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  scroll.addEventListener('scroll', () => { hero.style.transform = `translateY(${scroll.scrollTop * .3}px)`; }, { passive: true });
  const m = location.hash.match(/^#project-(\d+)$/); if (m && byId[m[1]]) setTimeout(() => open(m[1]), 600);
  return { open, close };
}
