import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects, featured, book, byId } from './data.js';
import { createPainter } from './lib/paint.js';
import { createInk } from './lib/ink.js';
import { createSound } from './lib/sound.js';
import { circle, underline, arrow, svg } from './lib/draw.js';
import { createWall } from './lib/wall.js';
import { createCase } from './lib/case.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .09, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; lenis.scrollTo(0, { immediate: true }); lenis.stop(); }
window.__ST = ScrollTrigger;
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.getAttribute('href')); }));

/* score + ink */
const sound = createSound();
const soundBtn = document.getElementById('soundBtn');
soundBtn.addEventListener('click', () => { const on = sound.toggle(); soundBtn.classList.toggle('on', on); soundBtn.lastChild.textContent = on ? 'Sound on' : 'Sound off'; });
const ink = createInk(document.getElementById('ink'), { reduced, onStroke: (d) => sound.scratch(d) });
gsap.ticker.add(() => sound.tick());
const cursor = document.querySelector('.cursor'), cursorLabel = document.getElementById('cursorLabel');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .18, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .18, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => { const l = e.target.closest('[data-label]'); const a = e.target.closest('a, button'); cursor.classList.toggle('is-label', !!l); cursor.classList.toggle('is-link', !l && !!a); if (l) cursorLabel.textContent = l.dataset.label; }); }

/* copy */
document.getElementById('coverName').textContent = book.name; document.getElementById('coverRole').textContent = `${book.role}, ${book.city}`; document.getElementById('coverAr').textContent = book.ar; document.getElementById('coverLine').textContent = book.cover.line; document.getElementById('coverYears').textContent = book.years;
document.getElementById('coverStamp').innerHTML = '<span><i>SKETCH</i></span><span><i>BOOK</i></span>';
const first = featured[0];
document.getElementById('firstCopy').textContent = 'The sheet on the right is the first drawing of the Quality of Life stand. Scroll and watch the marker go down. Then the render develops over it. Hover the render to see the line underneath. That is the whole method, on one page.';
document.getElementById('backLine').textContent = book.contact.line; const ml = document.getElementById('mailLink'); ml.href = `mailto:${book.contact.email}`; ml.textContent = book.contact.email; document.getElementById('behanceLink').href = book.contact.behance; document.getElementById('phoneLine').textContent = book.contact.phone; document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('tools').innerHTML = book.hand.tools.map(([t, n]) => `<li><strong>${t}</strong><span class="hand">${n}</span></li>`).join('');
document.getElementById('moves').innerHTML = book.hand.moves.map(([w, t]) => `<li><span class="box">${svg(34, 34, 'M 6 18 L 14 26 L 30 8')}</span><div><strong>${w}</strong><span>${t}</span></div></li>`).join('');
document.getElementById('aboutLines').innerHTML = book.about.lines.map((l) => `<p class="l">${l}</p>`).join('');
document.getElementById('facts').innerHTML = book.about.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
document.getElementById('clients').innerHTML = book.clients.map((c) => `<span>${c}</span>`).join('').repeat(2);

/* project pages */
const pagesEl = document.getElementById('pages');
pagesEl.innerHTML = featured.map((p, i) => {
  const no = String(i + 2).padStart(2, '0'); const V = p.variant || 'A';
  const title = p.name.split(' ').map((w) => `<span class="ln"><span>${w}</span></span>`).join('');
  const notes = (p.notes || []).map((n, k) => `<p class="note n${k}">${n}</p>`).join('');
  const stick = (p.stickers || []).map((s, k) => `<span class="sticker s${k}" style="--r:${k ? 5 : -7}deg">${s}</span>`).join('');
  const sheet = (sk, rn, tag = true) => `<div class="sheet" data-label="Erase"><canvas class="paint" data-src="${sk}"></canvas><img class="render" src="${rn}" alt="${p.name} render" loading="lazy" /><img class="erase" src="${sk}" alt="" loading="lazy" />${tag ? `<span class="tag mono">Sketch</span>` : ''}<span class="tape"></span>${svg(300, 300, circle(300, 300), 'circle')}</div>`;
  const pol = (src, cap) => `<div class="pol" data-open-room="${p.id}" data-label="Open"><span class="pin"></span><img src="${src}" alt="${p.name} built" loading="lazy" /><span class="hand">${cap}</span></div>`;
  const text = `<h3 class="pp__title">${title}</h3><p class="pp__thought">${p.thought}</p><p class="pp__line">${p.line || ''}</p><a class="pp__open" href="#room-${p.id}" data-open-room="${p.id}" data-label="Open"><span>Open the page</span><span>→</span></a>`;
  let media = '';
  if (V === 'D') media = `<div class="strip">${p.frames.map((f, k) => sheet(k === 0 ? f : p.images[Math.max(0, p.images.indexOf(f) - 1)], f, false)).join('')}</div>`;
  else media = sheet(p.frames[0], p.frames[1]) + pol(p.frames[2] || p.frames[1], 'built. ' + p.year);
  return `<section class="page page--${p.paper || 'cream'} pp pp--${V}" id="p${i + 2}" data-id="${p.id}" style="--ac:${p.accent};--pfg:${p.fg};--pbg:${p.bg}"><p class="mono pp__no">Page ${no} · ${p.kind}</p><p class="mono pp__client">${p.client}</p>${text}${media}${notes}${stick}</section>`;
}).join('');
// where the notes and stickers sit on each page (percent of the page box)
const spots = { A: [[62, 14], [54, 70], [8, 82]], B: [[6, 12], [60, 60], [20, 86]], C: [[70, 72], [44, 12], [6, 90]], D: [[6, 14], [62, 24], [84, 88]] };
document.querySelectorAll('.pp').forEach((pg) => {
  const V = [...pg.classList].find((c) => c.startsWith('pp--')).slice(4);
  pg.querySelectorAll('.note').forEach((n, k) => { const [x, y] = spots[V][k] || [50, 50]; n.style.position = 'absolute'; n.style.left = `${x}%`; n.style.top = `${y}%`; n.style.zIndex = 4; });
  pg.querySelectorAll('.sticker').forEach((s, k) => { const [x, y] = spots[V][(k + 2) % 3]; s.style.left = `calc(${x}% + ${k * 90}px)`; s.style.top = `calc(${y}% - 60px)`; });
  const [x, y] = spots[V][0]; pg.insertAdjacentHTML('beforeend', svg(220, 120, arrow(10, 100, 200, 20), 'arrow').replace('class="ink arrow"', `class="ink arrow" style="position:absolute;left:${x - 14}%;top:${y + 7}%;z-index:3"`));
});

/* paint engines */
const painters = [];
const wirePaint = (sheet, { start = 'top 85%', end = 'bottom 30%', scrub = .6 } = {}) => {
  const c = sheet.querySelector('canvas'); const render = sheet.querySelector('img.render'); const erase = sheet.querySelector('img.erase'); const tag = sheet.querySelector('.tag'); const ring = sheet.querySelector('svg.circle path'); const tape = sheet.querySelector('.tape');
  const painter = createPainter(c, c.dataset.src, { strokes: 24 }); painters.push(painter);
  if (ring) { ring.closest('svg').style.cssText = 'position:absolute;right:6%;top:8%;width:38%;height:auto;z-index:3'; }
  if (reduced) { painter.draw(1); if (render) render.style.clipPath = 'none'; if (tape) tape.style.opacity = 1; if (ring) ring.style.strokeDashoffset = 0; return; }
  ScrollTrigger.create({ trigger: sheet, start, end, scrub, onUpdate: (st) => {
    const p = st.progress; painter.draw(Math.min(1, p / .55));
    if (render) render.style.clipPath = `inset(0 0 ${100 - Math.max(0, (p - .6) / .35) * 100}% 0)`;
    if (tag) tag.textContent = p < .6 ? 'Sketch' : p < .95 ? 'Rendering…' : 'Render';
    if (ring) ring.style.strokeDashoffset = 1 - Math.max(0, Math.min(1, (p - .25) / .3));
    if (tape && p > .9) gsap.to(tape, { opacity: 1, duration: .3, overwrite: true });
  } });
  if (erase && !touch) { const mx = gsap.quickTo(erase, '--mx', { duration: .25, ease: 'power3' }), my = gsap.quickTo(erase, '--my', { duration: .25, ease: 'power3' }); sheet.addEventListener('pointermove', (e) => { const r = sheet.getBoundingClientRect(); mx(`${((e.clientX - r.left) / r.width) * 100}%`); my(`${((e.clientY - r.top) / r.height) * 100}%`); erase.style.clipPath = `circle(${Math.min(r.width, r.height) * .22}px at var(--mx) var(--my))`; }); sheet.addEventListener('pointerleave', () => { erase.style.clipPath = 'circle(0px at var(--mx) var(--my))'; }); }
};
// first page sheet
{ const sheet = document.getElementById('firstSheet'); const c = document.getElementById('firstPaint'); c.dataset.src = first.frames[0]; const r = document.getElementById('firstRender'); r.src = first.frames[1]; r.classList.add('render'); r.alt = `${first.name} render`;
  sheet.insertAdjacentHTML('beforeend', `<img class="erase" src="${first.frames[0]}" alt="" /><span class="tape"></span>`); const tag = document.getElementById('firstTag'); tag.classList.add('tag');
  wirePaint(sheet, { start: 'top 70%', end: 'bottom 20%', scrub: .5 }); }
document.querySelectorAll('.pp .sheet').forEach((s) => wirePaint(s));
addEventListener('resize', () => painters.forEach((p) => p.resize()));

/* page choreography */
const sections = [...document.querySelectorAll('.page')];
const bandColor = () => { const mid = innerHeight * .5; let cur = sections[0]; for (const s of sections) if (s.getBoundingClientRect().top <= mid) cur = s; const cs = getComputedStyle(cur); document.body.style.setProperty('--bg', cs.getPropertyValue('--pbg') || '#f2ecdf'); document.body.style.setProperty('--fg', cs.getPropertyValue('--pfg') || '#15120e'); document.body.style.setProperty('--ac', cs.getPropertyValue('--ac') || '#e0271c'); const i = sections.indexOf(cur); document.getElementById('pageNo').textContent = i === 0 ? 'Cover' : i === sections.length - 1 ? 'Back cover' : `Page ${String(i).padStart(2, '0')} / ${sections.length - 2}`; ink.setColor(cs.getPropertyValue('--ac').trim() || '#e0271c'); };
ScrollTrigger.create({ onUpdate: bandColor, onRefresh: bandColor });
// cover: scroll peels it
gsap.to('.cover__pin', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#cover', start: 'top top', end: 'bottom top', scrub: true } });
// first page
gsap.to('#p1 .ln span', { y: 0, duration: 1.1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '#p1', start: 'top 60%' } });
gsap.to('#firstNote', { opacity: 1, duration: .8, scrollTrigger: { trigger: '#firstSheet', start: 'top 50%' } });
// project pages
document.querySelectorAll('.pp').forEach((pg) => {
  gsap.to(pg.querySelectorAll('.pp__title .ln span'), { y: 0, duration: 1.1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: pg, start: 'top 55%', toggleActions: 'play none none reverse' } });
  gsap.from([pg.querySelector('.pp__thought'), pg.querySelector('.pp__line'), pg.querySelector('.pp__open')], { opacity: 0, y: 20, duration: .9, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: pg, start: 'top 45%' } });
  gsap.to(pg.querySelectorAll('.note'), { opacity: 1, duration: .6, stagger: .35, ease: 'power2.out', scrollTrigger: { trigger: pg, start: 'top 30%' }, onStart: () => sound.pin() });
  gsap.to(pg.querySelectorAll('.sticker'), { scale: 1, duration: .5, stagger: .2, ease: 'back.out(2.5)', scrollTrigger: { trigger: pg, start: 'top 25%' }, onStart: () => sound.tape() });
  const arr = pg.querySelector('svg.arrow path'); if (arr) gsap.to(arr, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: pg, start: 'top 20%' } });
  const pol = pg.querySelector('.pol'); if (pol) gsap.from(pol, { y: 80, rotate: 12, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: pg, start: 'top 15%' }, onStart: () => sound.tape() });
});
// the hand
gsap.to('.tools li', { opacity: 1, x: 0, duration: .7, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '#tools', start: 'top 75%' } });
document.querySelectorAll('.moves .box path').forEach((p, i) => gsap.to(p, { strokeDashoffset: 0, duration: .5, delay: i * .25, ease: 'power2.out', scrollTrigger: { trigger: '#moves', start: 'top 70%' } }));
gsap.to('#clients', { xPercent: -50, duration: 50, ease: 'none', repeat: -1 });

/* drawer */
const caseView = createCase({ lenis, reduced, sound });
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a || a.closest('.wall')) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });
const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year));
const wall = createWall(document.getElementById('wall'), document.getElementById('wallPlane'), sorted, { onOpen: (id) => caseView.open(id), reduced, sound });
const filters = document.getElementById('filters'); const kinds = ['All', ...new Set(projects.map((p) => p.kind))];
filters.innerHTML = kinds.map((k, i) => `<button class="${i ? '' : 'on'}" data-k="${k}">${k}</button>`).join('');
filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; filters.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); wall.filter(b.dataset.k); sound.pin(); });

/* loader → cover */
const path = document.getElementById('ykPath');
const tl = gsap.timeline({ onComplete: () => { document.getElementById('loader').remove(); lenis?.start(); lenis?.scrollTo(0, { immediate: true }); ScrollTrigger.refresh(); } });
tl.to(path, { strokeDashoffset: 0, duration: reduced ? 0 : 1.4, ease: 'power2.inOut' }, 0)
  .to('#loaderT', { opacity: 1, duration: .5 }, .6)
  .to('#loader', { yPercent: -100, duration: .9, ease: 'expo.inOut' }, reduced ? 0 : 1.9)
  .to('.cover__stamp span>i', { y: 0, duration: 1, stagger: .1, ease: 'expo.out' }, reduced ? 0 : 2.2)
  .to(['#nav', '#coverOpen'], { opacity: 1, duration: .8 }, reduced ? 0 : 2.8);
addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));
