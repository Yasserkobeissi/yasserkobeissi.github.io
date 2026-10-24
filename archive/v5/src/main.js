import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects, byId, night } from './data.js';
import { createInk } from './lib/ink.js';
import { createSound } from './lib/sound.js';
import { createReveal } from './lib/reveal.js';
import { createLed } from './lib/led.js';
import { createCase } from './lib/case.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .09, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; lenis.scrollTo(0, { immediate: true }); lenis.stop(); }
window.__ST = ScrollTrigger;
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.getAttribute('href')); }));

/* sound, ink, cursor */
const sound = createSound(); const soundBtn = document.getElementById('soundBtn');
soundBtn.addEventListener('click', () => { const on = sound.toggle(); soundBtn.classList.toggle('on', on); soundBtn.lastChild.textContent = on ? 'Sound on' : 'Sound off'; });
const ink = createInk(document.getElementById('ink'), { reduced, onStroke: (d) => sound.scratch(d * .4) }); ink.setColor('#ffb23e');
gsap.ticker.add(() => sound.tick());
const cursor = document.querySelector('.cursor'), cursorLabel = document.getElementById('cursorLabel');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .18, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .18, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => { const l = e.target.closest('[data-label]'); const a = e.target.closest('a, button'); cursor.classList.toggle('is-label', !!l); cursor.classList.toggle('is-link', !l && !!a); if (l) cursorLabel.textContent = l.dataset.label; }); }

/* copy */
const B = Object.fromEntries(night.beats.map((b) => [b.id, b]));
for (const id of ['brief', 'line', 'model', 'build', 'doors', 'credits']) { const s = document.getElementById(`${id}Say`); if (s) s.textContent = B[id].line; const c = document.getElementById(`${id}Copy`); if (c) c.textContent = B[id].copy; }
document.getElementById('secret').textContent = night.yasser.secret;
document.getElementById('proud').innerHTML = night.yasser.proud.map((p) => `<li>${p}</li>`).join('');
document.getElementById('says').innerHTML = night.yasser.says.map((p) => `<li>${p}</li>`).join('');
document.getElementById('clients').innerHTML = night.clients.map((c) => `<span>${c}</span>`).join('').repeat(2);
const ml = document.getElementById('mailLink'); ml.href = `mailto:${night.contact.email}`; ml.textContent = night.contact.email; document.getElementById('behanceLink').href = night.contact.behance; document.getElementById('phoneLine').textContent = night.contact.phone; document.getElementById('year').textContent = new Date().getFullYear();
const S = night.sequence; const P = (id, i) => byId[id].images[Math.min(i, byId[id].images.length - 1)];
document.getElementById('lineRender').src = P(S.line, S.lineRender);
document.getElementById('modelWhite').src = P(S.model, S.modelWhite); document.getElementById('modelDay').src = P(S.model, S.modelDay); document.getElementById('modelNight').src = P(S.model, S.modelNight);
document.getElementById('doorsRoom').src = P(S.doors, S.doorsFrame);

/* 18:00 the brief: the phone */
const msgs = document.getElementById('msgs'); const replyBtn = document.getElementById('replyBtn');
const thread = [['in', 'Hi Yasser. We need a stand for Riyadh Front. Opening is in three weeks.'], ['in', 'Budget is… tight. Can you send something we can see by Sunday?']];
const addMsg = (dir, text) => { const m = document.createElement('div'); m.className = `msg ${dir}`; m.textContent = text; msgs.appendChild(m); gsap.to(m, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }); sound.pin(); return m; };
const typing = () => { const m = document.createElement('div'); m.className = 'msg in typing'; m.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(m); gsap.to(m, { opacity: 1, y: 0, duration: .3 }); return m; };
let briefStarted = false;
const playBrief = async () => { if (briefStarted) return; briefStarted = true; for (const [d, t] of thread) { const ty = typing(); await new Promise((r) => setTimeout(r, 900)); ty.remove(); addMsg(d, t); await new Promise((r) => setTimeout(r, 700)); } };
replyBtn.addEventListener('click', () => { if (replyBtn.classList.contains('done')) return; replyBtn.classList.add('done'); addMsg('out', 'On it. Sketch by tonight. Render by Sunday.'); setTimeout(() => addMsg('out', 'Two weeks, if the coffee is good.'), 900); setTimeout(() => goTo('#line'), 2200); });

/* 19:30 the first line: draw to reveal */
const sheet = document.getElementById('sheet'), lineBar = document.getElementById('lineBar'), linePct = document.getElementById('linePct'), sheetTag = document.getElementById('sheetTag'), prompt = document.getElementById('sheetPrompt'), lineRender = document.getElementById('lineRender');
const reveal = createReveal(document.getElementById('revealCanvas'), P(S.line, S.lineSketch), { sound,
  onProgress: (p) => { const pct = Math.min(100, Math.round(p / .42 * 100)); lineBar.style.width = `${pct}%`; linePct.textContent = `${pct}%`; if (p > .03) gsap.to(prompt, { opacity: 0, duration: .4 }); sheetTag.textContent = p < 1 ? 'You are drawing' : 'Sketch'; },
  onDone: () => { sheetTag.textContent = 'Sketch → render'; gsap.to(lineRender, { clipPath: 'inset(0 0 0% 0)', duration: 1.6, delay: .6, ease: 'expo.inOut', onStart: () => sound.flip(), onComplete: () => (sheetTag.textContent = 'Render') }); } });
// if the visitor scrolls past without drawing, the marker does it
ScrollTrigger.create({ trigger: '#line', start: 'bottom 60%', onEnter: () => { if (!reveal.done) reveal.finish(); } });

/* 22:00 the model: drag the sun */
const sun = document.getElementById('sunRange'), sunLabel = document.getElementById('sunLabel'), mDay = document.getElementById('modelDay'), mNight = document.getElementById('modelNight');
const setSun = (v) => { const t = v / 100; mDay.style.opacity = Math.min(1, t * 2); mNight.style.opacity = Math.max(0, (t - .5) * 2); sunLabel.textContent = t < .3 ? 'White model · proportions first' : t < .6 ? 'Render · 16:00' : t < .85 ? 'Render · dusk' : 'Render · 22:00, as built'; };
sun.addEventListener('input', () => { setSun(+sun.value); sound.scratch(14); });
ScrollTrigger.create({ trigger: '#model', start: 'top 60%', end: 'bottom 40%', scrub: true, onUpdate: (st) => { if (document.activeElement !== sun) { sun.value = Math.round(st.progress * 100); setSun(+sun.value); } } });

/* 03:00 the build: power the wall */
const ledStatus = document.getElementById('ledStatus');
const led = createLed(document.getElementById('ledWall'), P(S.build, S.buildFrame), { sound, onLit: (f) => { const n = Math.round(f * 40); ledStatus.textContent = n < 40 ? `${n} of 40 panels on · keep going` : 'All panels on · stage ready'; if (f >= 1) gsap.to('#napkin', { opacity: 1, y: -10, duration: .8, ease: 'expo.out', onComplete: () => gsap.to('#carPath', { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }) }); } });
ScrollTrigger.create({ trigger: '#build', start: 'bottom 55%', onEnter: () => led.all() });

/* 06:00 doors: scroll pushes them */
ScrollTrigger.create({ trigger: '#doors', start: 'top top', end: () => `+=${innerHeight * 1.4}`, pin: '#doors .beat__pin', scrub: .5, onUpdate: (st) => { const p = st.progress; const o = Math.min(1, p / .7); document.getElementById('doorL').style.transform = `translateX(${-o * 100}%)`; document.getElementById('doorR').style.transform = `translateX(${o * 100}%)`; document.getElementById('doorsRoom').style.transform = `scale(${1.12 - o * .12})`; document.getElementById('doorsCopy').style.opacity = p > .55 ? 1 : 0; if (p > .4 && !window.__crowd) { window.__crowd = true; sound.flip(); } } });
document.getElementById('doorL').addEventListener('click', () => goTo('#credits'));

/* credits: every room */
const list = document.getElementById('creditsList'), peek = document.getElementById('peek'), peekImg = peek.querySelector('img');
const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
list.innerHTML = sorted.map((p, i) => `<li class="row" data-id="${p.id}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><a href="#room-${p.id}" data-open-room="${p.id}" data-label="Open"><strong>${p.name}</strong></a><em>${p.thought || ''}</em><span class="mono row__k">${p.kind} · ${p.year}</span></li>`).join('');
const caseView = createCase({ lenis, reduced, sound });
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });
if (!touch) { const px = gsap.quickTo(peek, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .5, ease: 'power3' }); list.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }); list.addEventListener('pointerover', (e) => { const r = e.target.closest('.row'); if (!r) return; peekImg.src = byId[r.dataset.id].cover; peek.classList.add('on'); list.classList.add('hov'); }); list.addEventListener('pointerleave', () => { peek.classList.remove('on'); list.classList.remove('hov'); }); }
gsap.to('#clients', { xPercent: -50, duration: 46, ease: 'none', repeat: -1 });

/* the night: clock, sky and sun follow the scroll */
const sky = document.getElementById('sky'), clock = document.getElementById('clock'), beatEl = document.getElementById('beat'), nightBar = document.getElementById('nightBar');
const beats = night.beats.map((b) => ({ ...b, el: document.getElementById(b.id) }));
const stops = [ // scroll fraction → [clock minutes from 18:00, sun x%, sun y%, sun opacity, c1, c2, c3]
  [0.00, 0, 72, 78, .95, '#ff7a3d', '#7a2a1f', '#15101a'], [0.14, 90, 80, 96, .5, '#ff5a3d', '#4a1b22', '#100d16'], [0.30, 240, 85, 120, 0, '#2a1d4d', '#171329', '#0a0912'],
  [0.55, 540, 85, 130, 0, '#120f1c', '#0d0b14', '#07060a'], [0.72, 720, 20, 100, .25, '#4b2a4f', '#1c1428', '#0a0912'], [0.86, 810, 30, 80, .8, '#ff9a5c', '#8a3d4a', '#2a1d3a'], [1.00, 840, 40, 60, 1, '#ffd38a', '#ff9a5c', '#6a3f5a'],
];
const lerp = (a, b, t) => a + (b - a) * t; const mix = (a, b, t) => gsap.utils.interpolate(a, b, t);
const applySky = (p) => { let i = 0; while (i < stops.length - 2 && p > stops[i + 1][0]) i++; const a = stops[i], b = stops[i + 1]; const t = gsap.utils.clamp(0, 1, (p - a[0]) / (b[0] - a[0]));
  const min = lerp(a[1], b[1], t); const h = Math.floor((18 * 60 + min) / 60) % 24, m = Math.floor(min % 60); clock.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  sky.style.setProperty('--sx', `${lerp(a[2], b[2], t)}%`); sky.style.setProperty('--sy', `${lerp(a[3], b[3], t)}%`); sky.style.setProperty('--so', lerp(a[4], b[4], t)); sky.style.setProperty('--c1', mix(a[5], b[5], t)); sky.style.setProperty('--c2', mix(a[6], b[6], t)); sky.style.setProperty('--c3', mix(a[7], b[7], t));
  nightBar.style.width = `${p * 100}%`;
  const mid = innerHeight * .5; let cur = beats[0]; for (const b of beats) if (b.el.getBoundingClientRect().top <= mid) cur = b; beatEl.textContent = cur.label; };
ScrollTrigger.create({ onUpdate: (st) => applySky(st.progress), onRefresh: (st) => applySky(st.progress) });

/* reveals per beat */
document.querySelectorAll('.beat').forEach((b) => { const items = b.querySelectorAll('.beat__copy > *'); gsap.from(items, { opacity: 0, y: 24, duration: .9, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 60%' } }); });
ScrollTrigger.create({ trigger: '#brief', start: 'top 70%', once: true, onEnter: playBrief });

/* loader: the clock runs to 18:00 */
const lt = document.getElementById('loaderTime'); const o = { v: 0 };
const tl = gsap.timeline({ onComplete: () => { document.getElementById('loader').remove(); lenis?.start(); lenis?.scrollTo(0, { immediate: true }); ScrollTrigger.refresh(); playBrief(); } });
tl.to(o, { v: 1, duration: reduced ? 0 : 1.6, ease: 'power2.inOut', onUpdate: () => { const m = 17 * 60 + 58 + Math.round(o.v * 2); lt.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; } }, 0)
  .to('#loader', { yPercent: -100, duration: .9, ease: 'expo.inOut' }, reduced ? 0 : 1.8)
  .to('.h1 .ln span', { y: 0, duration: 1.1, stagger: .1, ease: 'expo.out' }, reduced ? 0 : 2.1)
  .to('#hud', { opacity: 1, duration: .8 }, reduced ? 0 : 2.6);
addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));
