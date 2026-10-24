import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { projects, featured, site } from './data.js';
import { createScene } from './lib/scene.js';
import { createWindows } from './lib/windows.js';
import { createCase } from './lib/case.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .09, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; }
window.__ST = ScrollTrigger; lenis?.scrollTo(0, { immediate: true }); lenis?.stop();
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.getAttribute('href')); }));

// cursor with labels
const cursor = document.querySelector('.cursor'), cursorLabel = document.getElementById('cursorLabel');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .22, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .22, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => { const l = e.target.closest('[data-label]'); const a = e.target.closest('a, button'); cursor.classList.toggle('is-label', !!l); cursor.classList.toggle('is-link', !l && !!a); if (l) cursorLabel.textContent = l.dataset.label; }); }

// copy
const clock = document.getElementById('clock'); const tick = () => (clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }).format(new Date())); tick(); setInterval(tick, 20000);
document.getElementById('introStatus').textContent = site.intro.status; document.getElementById('introSub').textContent = site.intro.sub; document.getElementById('introAr').textContent = site.ar;
document.getElementById('introTitle').innerHTML = site.intro.serif.split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
document.getElementById('philLines').innerHTML = site.philosophy.map((l) => l.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ')).join('<br/>');
document.getElementById('moves').innerHTML = site.moves.map(([n, w, t]) => `<li><span class="mono">${n}</span><strong>${w}</strong><p>${t}</p></li>`).join('');
document.getElementById('clients').innerHTML = (site.clients.map((c) => `<span>${c}</span>`).join('')).repeat(2);
document.getElementById('career').innerHTML = site.career.map(([y, c, r]) => `<div><span class="mono">${y}</span><strong>${c}</strong><span>${r}</span></div>`).join('');
document.getElementById('contactLine').textContent = site.contact.line; const ml = document.getElementById('mailLink'); ml.href = `mailto:${site.contact.email}`; ml.textContent = site.contact.email; document.getElementById('behanceLink').href = site.contact.behance; document.getElementById('phoneLine').textContent = site.contact.phone; document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('roomsCount').textContent = `${featured.length} of ${projects.length}`;

// playground lines
const playLines = document.getElementById('playLines');
playLines.innerHTML = site.playground.lines.map((l) => `<button class="pl ${l.pos}" data-open="${l.id}" data-label="${l.id === 'work' ? 'Scroll' : 'Open'}">${l.text}</button>`).join('');
playLines.addEventListener('pointerover', (e) => { if (e.target.closest('.pl')) playLines.classList.add('is-hover'); });
playLines.addEventListener('pointerleave', () => playLines.classList.remove('is-hover'));

// scenes, one per featured room, each in its own palette and layout
const scenesEl = document.getElementById('scenes');
scenesEl.innerHTML = featured.map((p, i) => {
  const n = String(i + 1).padStart(2, '0'); const title = p.name.split(' ').map((w) => `<span class="ln"><span>${w}</span></span>`).join('');
  const top = `<div class="scene__top"><span class="mono">${n} · ${p.kind} · ${p.year}</span><span class="mono">${p.client}</span></div>`;
  const open = `<a class="scene__open" href="#room-${p.id}" data-open-room="${p.id}" data-label="Open"><span>Open the room</span><span>→</span></a>`;
  const text = `<h3 class="scene__title">${title}</h3><p class="scene__thought">${p.thought}</p><p class="scene__line">${p.line || ''}</p>${open}`;
  const L = p.layout || 'split';
  let media = '';
  if (L === 'hero') media = `<div class="scene__media"><img src="${p.frames[0]}" alt="${p.name}" loading="lazy" /></div>`;
  else if (L === 'wipe') media = `<div class="scene__media" data-label="Scroll"><img src="${p.frames[0]}" alt="${p.name} sketch" /><img src="${p.frames[1]}" alt="${p.name} built" /><div class="scene__tag mono"><span>Sketch</span><span>Built</span></div></div>`;
  else if (L === 'strip') media = `<div class="scene__media">${p.frames.map((f, k) => `<img src="${f}" alt="${p.name} ${k + 1}" loading="lazy" style="--ty:${(k % 2) * 40}px" />`).join('')}</div>`;
  else if (L === 'object') media = `<div class="scene__media" data-tilt><img src="${p.frames[0]}" alt="${p.name}" loading="lazy" /></div>`;
  else if (L === 'night') media = `<div class="scene__media" data-torch data-label="Light"><img src="${p.frames[0]}" alt="${p.name}" loading="lazy" /></div>`;
  else media = `<div class="scene__media"><img src="${p.frames[0]}" alt="${p.name}" loading="lazy" /></div>`;
  const body = (L === 'split' || L === 'object') ? `<div class="scene__text">${top}${text}</div>${media}` : `${top}${media}${text}`;
  return `<article class="scene scene--${L}" data-id="${p.id}" style="--sbg:${p.bg};--sfg:${p.fg};--ac:${p.accent}">${body}</article>`;
}).join('');

// index
const list = document.getElementById('indexList'), filters = document.getElementById('filters'), peek = document.getElementById('peek'), peekImg = peek.querySelector('img');
const kinds = ['All', ...new Set(projects.map((p) => p.kind))];
filters.innerHTML = kinds.map((k, i) => `<button class="${i ? '' : 'on'}" data-k="${k}">${k}</button>`).join('');
const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
list.innerHTML = sorted.map((p, i) => `<li class="row" data-id="${p.id}" data-k="${p.kind}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><a href="#room-${p.id}" data-open-room="${p.id}" data-label="Open"><strong>${p.name}</strong></a><em>${p.thought || ''}</em><span class="mono row__k">${p.kind} · ${p.year}</span></li>`).join('');
filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; filters.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); list.querySelectorAll('.row').forEach((r) => r.classList.toggle('hide', b.dataset.k !== 'All' && r.dataset.k !== b.dataset.k)); ScrollTrigger.refresh(); });
if (!touch) { const px = gsap.quickTo(peek, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .5, ease: 'power3' }); list.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }); list.addEventListener('pointerover', (e) => { const r = e.target.closest('.row'); if (!r) return; const p = projects.find((x) => x.id === r.dataset.id); peekImg.src = p.cover; peek.classList.add('on'); list.classList.add('hov'); }); list.addEventListener('pointerleave', () => { peek.classList.remove('on'); list.classList.remove('hov'); }); }

// overlays
const caseView = createCase({ lenis, reduced });
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });

// WebGL head
const gl = await createScene(document.getElementById('gl'), { reduced });
addEventListener('resize', gl.resize); addEventListener('pointermove', (e) => gl.pointer(e.clientX, e.clientY), { passive: true });
gsap.ticker.add((t, dt) => gl.render(Math.min(.05, dt / 1000)));
const pokeCount = document.getElementById('pokeCount');
const windows = createWindows({ onPoke: (n) => { gl.poke(); pokeCount.textContent = `Pokes: ${n}`; } });
playLines.addEventListener('click', (e) => { const b = e.target.closest('.pl'); if (!b) return; if (b.dataset.open === 'work') return goTo('#work'); windows.open(b.dataset.open); });

// scroll choreography
const themes = { intro: ['#0f0e0c', '#ffffff', '#ff5a36'], cream: ['#efe9df', '#0f0e0c', '#ff5a36'], ink: ['#0f0e0c', '#efe9df', '#ff5a36'] };
const setTheme = (bg, fg, ac) => { document.body.style.setProperty('--bg', bg); document.body.style.setProperty('--fg', fg); document.body.style.setProperty('--ac', ac); };
const bands = [{ el: '#intro', t: themes.intro }, { el: '#play', t: themes.cream }, { el: '#phil', t: themes.ink }, ...featured.map((p) => ({ el: `.scene[data-id="${p.id}"]`, t: [p.bg, p.fg, p.accent] })), { el: '#index', t: themes.cream }, { el: '#studio', t: themes.cream }, { el: '#contact', t: themes.ink }].map((b) => ({ ...b, node: document.querySelector(b.el) }));
let cur = ''; const pick = () => { const mid = innerHeight * .5; let b = bands[0]; for (const x of bands) { if (x.node.getBoundingClientRect().top <= mid) b = x; } if (b.el !== cur) { cur = b.el; setTheme(...b.t); } };
ScrollTrigger.create({ onUpdate: pick, onRefresh: pick });
// intro → playground: the head walks from the cinematic frame to the centre of the playground
ScrollTrigger.create({ trigger: '#intro', start: 'top top', end: () => `+=${innerHeight * 1.2}`, pin: '.intro__pin', scrub: true, onUpdate: (st) => { gl.st.t = st.progress; } });
gsap.to('.intro__copy', { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: '#intro', start: 'top top', end: () => `+=${innerHeight * .5}`, scrub: true } });
ScrollTrigger.create({ trigger: '#play', start: 'top 40%', end: () => `+=${innerHeight * 2.0}`, onToggle: (st) => document.body.classList.toggle('is-play', st.isActive) });
ScrollTrigger.create({ trigger: '#play', start: 'top top', end: () => `+=${innerHeight * 1.6}`, pin: '#playPin', scrub: true, onUpdate: (st) => { gl.st.hide = st.progress > .7 ? (st.progress - .7) / .3 : 0; } });
ScrollTrigger.create({ trigger: '#play', start: 'top 60%', once: true, onEnter: () => gsap.to('.pl', { opacity: 1, duration: .1 }) });
gsap.set('.pl', { opacity: 0 }); gsap.to('.pl', { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '#play', start: 'top 55%' } });
// philosophy words
const pw = document.querySelectorAll('.phil__lines .w'); ScrollTrigger.create({ trigger: '#phil', start: 'top 60%', end: 'center 40%', scrub: true, onUpdate: (st) => { const n = Math.floor(st.progress * (pw.length + 2)); pw.forEach((w, i) => w.classList.toggle('on', i < n)); } });
// scenes
document.querySelectorAll('.scene').forEach((sc) => {
  const words = sc.querySelectorAll('.scene__title .ln span');
  gsap.to(words, { y: 0, duration: 1.1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: sc, start: 'top 55%', toggleActions: 'play none none reverse' } });
  gsap.from([sc.querySelector('.scene__thought'), sc.querySelector('.scene__line'), sc.querySelector('.scene__open')], { opacity: 0, y: 24, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: sc, start: 'top 45%' } });
  const media = sc.querySelector('.scene__media');
  if (sc.classList.contains('scene--wipe')) gsap.to(media.querySelector('img + img'), { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: media, start: 'top 75%', end: 'bottom 35%', scrub: .5 } });
  if (sc.classList.contains('scene--strip')) media.querySelectorAll('img').forEach((im, k) => gsap.fromTo(im, { y: (k % 2 ? -1 : 1) * 60 }, { y: (k % 2 ? 1 : -1) * 60, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } }));
  if (sc.classList.contains('scene--hero')) gsap.fromTo(media.querySelector('img'), { scale: 1.15, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: sc, start: 'top bottom', end: 'bottom top', scrub: true } });
  if (sc.classList.contains('scene--split') || sc.classList.contains('scene--object')) gsap.from(media, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: sc, start: 'top 55%' } });
  if (media.hasAttribute('data-tilt') && !touch) { const img = media.querySelector('img'); const rx = gsap.quickTo(img, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(img, 'rotationY', { duration: .6, ease: 'power3' }); media.addEventListener('pointermove', (e) => { const r = media.getBoundingClientRect(); rx(-((e.clientY - r.top) / r.height - .5) * 22); ry(((e.clientX - r.left) / r.width - .5) * 26); }); media.addEventListener('pointerleave', () => { rx(0); ry(0); }); }
  if (media.hasAttribute('data-torch') && !touch) { const mx = gsap.quickTo(media, '--mx', { duration: .4, ease: 'power3' }), my = gsap.quickTo(media, '--my', { duration: .4, ease: 'power3' }); media.addEventListener('pointermove', (e) => { const r = media.getBoundingClientRect(); mx(`${((e.clientX - r.left) / r.width) * 100}%`); my(`${((e.clientY - r.top) / r.height) * 100}%`); }); }
});
gsap.to('#clients', { xPercent: -50, duration: 46, ease: 'none', repeat: -1 });

// loader → intro
const ln = document.getElementById('loaderN'); const o = { v: 0 };
await gsap.to(o, { v: 100, duration: reduced ? 0 : 1.6, ease: 'power2.inOut', onUpdate: () => (ln.textContent = Math.round(o.v)) });
gsap.timeline({ onComplete: () => { lenis?.start(); lenis?.scrollTo(0, { immediate: true }); ScrollTrigger.refresh(); } })
  .to('#loader', { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: () => document.getElementById('loader').remove() }, 0)
  .to(gl.head.u.uReveal, { value: 1.4, duration: reduced ? 0 : 2, ease: 'power2.inOut' }, .3)
  .to('.intro__title .w span', { y: 0, duration: 1.2, stagger: .08, ease: 'expo.out' }, .9)
  .to(['.intro__kicker', '.intro__sub', '.intro__meta', '#nav'], { opacity: 1, duration: 1, stagger: .12 }, 1.4);
