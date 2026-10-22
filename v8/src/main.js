import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects, byId, night as M } from './data.js';
import { createHeroGl } from './lib/heroGl.js';
import { createCase } from './lib/case.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .08, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; lenis.scrollTo(0, { immediate: true }); lenis.stop(); }
window.__ST = ScrollTrigger;
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.getAttribute('href')); }));
const cursor = document.querySelector('.cursor');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .2, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .2, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true }); document.addEventListener('pointerover', (e) => cursor.classList.toggle('is-link', !!e.target.closest('a, button'))); }
const clock = document.getElementById('clock'); const tick = () => (clock.textContent = `Riyadh ${new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }).format(new Date())}`); tick(); setInterval(tick, 20000);
const img = (id, i) => byId[id].images[Math.min(i, byId[id].images.length - 1)];
/* entrance reveals: observed, once, never dependent on scroll maths */
const reveal = (nodes, { y = 16, stagger = .08, duration = 1 } = {}) => { const list = typeof nodes === 'string' ? [...document.querySelectorAll(nodes)] : [...nodes]; gsap.set(list, { opacity: 0, y }); const io = new IntersectionObserver((es) => { es.forEach((e) => { if (!e.isIntersecting) return; const i = list.indexOf(e.target); gsap.to(e.target, { opacity: 1, y: 0, duration, delay: Math.min(i, 8) * stagger * .5, ease: 'expo.out', overwrite: true }); io.unobserve(e.target); }); }, { rootMargin: '0px 0px -8% 0px' }); list.forEach((n) => io.observe(n)); };

/* hero */
document.getElementById('heroKicker').textContent = `${M.name} · ${M.role}`;
document.getElementById('heroTitle').innerHTML = M.hero.line.map((l) => `<span class="ln"><span>${l}</span></span>`).join('');
document.getElementById('heroSub').textContent = M.hero.sub;
const gl = createHeroGl(document.getElementById('heroGl'), img(...M.hero.image)); gl.resize(); addEventListener('resize', gl.resize);
const heroEl = document.getElementById('hero'); addEventListener('pointermove', (e) => { const r = heroEl.getBoundingClientRect(); gl.pointer(e.clientX, e.clientY, e.clientY < r.bottom); }, { passive: true });
let heroOn = true; gsap.ticker.add((t, dt) => { if (heroOn) gl.render(Math.min(.05, dt / 1000)); });
ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', end: 'bottom top', onToggle: (st) => (heroOn = st.isActive) });
gsap.to('.hero__body', { yPercent: 18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

/* statement */
const stEl = document.getElementById('statementText'); stEl.innerHTML = M.statement.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
const sw = stEl.querySelectorAll('.w'); ScrollTrigger.create({ trigger: '#statement', start: 'top 70%', end: 'bottom 60%', scrub: true, onUpdate: (st) => { const n = Math.floor(st.progress * (sw.length + 2)); sw.forEach((w, i) => w.classList.toggle('on', i < n)); } });

/* director */
document.getElementById('directorLabel').textContent = M.portrait.label; document.getElementById('directorCopy').innerHTML = M.portrait.copy.map((p) => `<p>${p}</p>`).join(''); document.getElementById('facts').innerHTML = M.portrait.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
gsap.to('#portraitFrame', { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '#director', start: 'top 70%' } });
gsap.to('#portraitFrame img', { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '#director', start: 'top 70%' } });
reveal('.director__copy p, .facts div');

/* range: cursor image reveal */
document.getElementById('rangeLabel').textContent = M.range.label;
const rl = document.getElementById('rangeList'); rl.innerHTML = M.range.items.map(([t, d, id, i], k) => `<li class="range__item" data-src="${img(id, i)}"><span class="mono">0${k + 1}</span><strong>${t}</strong><span>${d}</span></li>`).join('');
const peek = document.getElementById('peek'), peekImg = peek.querySelector('img');
if (!touch) { const px = gsap.quickTo(peek, 'x', { duration: .6, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .6, ease: 'power3' }); rl.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }); rl.addEventListener('pointerover', (e) => { const li = e.target.closest('.range__item'); if (!li) return; peekImg.src = li.dataset.src; peek.classList.add('on'); rl.classList.add('hov'); }); rl.addEventListener('pointerleave', () => { peek.classList.remove('on'); rl.classList.remove('hov'); }); }
reveal('.range__item');

/* work spreads */
document.getElementById('workLabel').textContent = M.work.label;
const layouts = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd'];
document.getElementById('spreads').innerHTML = M.work.ids.map((id, k) => { const p = byId[id]; const L = layouts[k]; const f1 = `<figure class="spread__fig"><img src="${p.images[Math.min(1, p.images.length - 1)]}" alt="${p.name}" loading="lazy" /></figure>`; const f2 = L === 'd' ? `<figure class="spread__fig"><img src="${p.images[Math.min(4, p.images.length - 1)]}" alt="" loading="lazy" /></figure>` : ''; return `<article class="spread spread--${L}" data-id="${id}">${f1}${f2}<div class="spread__text"><span class="spread__num">0${k + 1}</span><h3 class="spread__title">${p.name}</h3><p class="spread__thought">${p.thought || ''}</p><a class="spread__open" href="#room-${id}" data-open-room="${id}">Open <span>→</span></a></div></article>`; }).join('');
document.querySelectorAll('.spread').forEach((sp) => { sp.querySelectorAll('.spread__fig').forEach((f) => { gsap.fromTo(f, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 80%' } }); gsap.fromTo(f.querySelector('img'), { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.05, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } }); }); reveal(sp.querySelectorAll('.spread__text > *')); });
const caseView = createCase({ lenis, reduced, sound: null });
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });

/* years + clients */
document.getElementById('yearsLabel').textContent = M.years.label;
document.getElementById('yearsList').innerHTML = M.years.rows.map(([y, c, t]) => `<li class="years__row"><b>${y}</b><span class="mono">${c}</span><span>${t}</span></li>`).join('');
reveal('.years__row');
document.getElementById('clients').innerHTML = M.clients.map((c) => `<span>${c}</span>`).join('').repeat(2); gsap.to('#clients', { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });

/* contact */
document.getElementById('contactLabel').textContent = M.contact.label; document.getElementById('contactLine').textContent = M.contact.line; const ml = document.getElementById('mailLink'); ml.href = `mailto:${M.contact.email}`; ml.textContent = M.contact.email; document.getElementById('behanceLink').href = M.contact.behance; document.getElementById('phoneLine').textContent = M.contact.phone; document.getElementById('year').textContent = new Date().getFullYear();
gsap.to('.contact__title .w', { opacity: 1, y: 0, duration: 1.4, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 60%' } });

/* loader → hero */
const n = { v: 0 }; const ln = document.getElementById('loaderN');
gsap.timeline({ onComplete: () => { lenis?.start(); lenis?.scrollTo(0, { immediate: true }); ScrollTrigger.refresh(); } })
  .to(n, { v: 100, duration: reduced ? 0 : 1.8, ease: 'power2.inOut', onUpdate: () => (ln.textContent = Math.round(n.v)) }, 0)
  .to('#loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: () => document.getElementById('loader').remove() }, reduced ? 0 : 2)
  .to('.hero__title .ln span', { y: 0, duration: 1.4, stagger: .12, ease: 'expo.out' }, reduced ? 0 : 2.4)
  .to(['.hero__kicker', '.hero__sub', '.hero__foot', '#nav'], { opacity: 1, duration: 1.2, stagger: .12 }, reduced ? 0 : 2.9);
addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));
