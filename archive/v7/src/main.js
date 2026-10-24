import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { projects, byId, night as script } from './data.js';
import { createHost } from './lib/host.js';
import { createSound } from './lib/sound.js';
import { createTV } from './lib/tv.js';
import { createKnob } from './lib/knob.js';
import { createLetters } from './lib/physics.js';
import { createCar3D } from './lib/car3d.js';
import { createTimeline } from './lib/timeline.js';
import { createSlot } from './lib/slot.js';
import { createBooth } from './lib/booth.js';
import { createWall } from './lib/wall.js';
import { createArchive } from './lib/archive.js';
import { createWipe } from './lib/wipe.js';
import { createCase } from './lib/case.js';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Flip);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
const sound = createSound(); sound.key = () => sound.pin?.();
const soundBtn = document.getElementById('soundBtn'); soundBtn.addEventListener('click', () => soundBtn.classList.toggle('on', sound.toggle()));
let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .09, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; lenis.scrollTo(0, { immediate: true }); lenis.stop(); }
window.__ST = ScrollTrigger; gsap.ticker.add(() => sound.tick());
const wipe = createWipe();

/* cursor: a glyph that changes with the mood of the bit, and a line when it has something to say */
const cursor = document.querySelector('.cursor'), cursorSay = document.getElementById('cursorSay'); let hovers = 0;
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .15, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .15, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
  const says = { '.slot__lever': ['pull. i dare you.'], '.knob': ['grab it. all the way.'], '.pol': ['open it.', 'that one was a good night.'], '.acc__label': ['change it. i did, for ten years.'], '.tl__track': ['drag. the years talk.'], '.carcanvas': ['spin it. then ruin it with the sliders.'], '.top__btn': ['that opens something.'], 'button': ['press it.'], 'a': ['a link. brave.'], 'input': ['type. i can wait.'] };
  document.addEventListener('pointerover', (e) => { const sel = Object.keys(says).find((s) => e.target.closest(s)); cursor.classList.toggle('is-link', !!e.target.closest('a, button, input, .knob, .pol, .tl__track, .carcanvas')); if (sel) { hovers++; const list = says[sel]; cursorSay.textContent = hovers > 16 && Math.random() < .25 ? 'you hover a lot. good taste.' : list[hovers % list.length]; cursor.classList.add('is-say'); } else cursor.classList.remove('is-say'); }); }

/* his script vars */
const riyadhTime = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }).format(new Date());
const riyadhHour = () => +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date());
const clock = document.getElementById('clock'); const tick = () => (clock.textContent = `${riyadhTime()} riyadh`); tick(); setInterval(tick, 20000);
let guest = 'friend';
const vars = () => { const h = riyadhHour(); const len = guest.length; return { name: guest, len, time: riyadhTime(), nameJoke: script.nameJokes[len <= 4 ? 'short' : len >= 10 ? 'long' : 'mid'].replace('{len}', len), timeJoke: script.timeJokes[h < 5 || h >= 23 ? 'night' : h < 11 ? 'morning' : h < 18 ? 'day' : 'evening'] }; };

/* opening: he types; his name line then becomes the header */
const hostOpen = createHost(document.getElementById('hostOpen'), { sound });
const askForm = document.getElementById('askForm'), askInput = document.getElementById('askInput');
const beginScroll = () => {
  const line = document.querySelector('#hostOpen .host__line:nth-child(3)'); const name = document.querySelector('.top__name');
  if (line) { const ghost = document.createElement('span'); ghost.textContent = 'yasser kobeissi'; ghost.className = 'morph'; ghost.style.cssText = 'position:fixed;z-index:80;font-family:var(--mono);color:#ffb45c;pointer-events:none'; document.body.appendChild(ghost); const a = line.getBoundingClientRect(); gsap.set(ghost, { left: a.left, top: a.top, fontSize: getComputedStyle(line).fontSize }); const b = name.getBoundingClientRect(); gsap.to(ghost, { left: b.left, top: b.top, fontSize: 16, duration: 1.1, ease: 'expo.inOut', onComplete: () => { ghost.remove(); gsap.to('#top', { opacity: 1, duration: .4 }); } }); }
  document.getElementById('openHint').style.opacity = 1; gsap.to('#aside', { opacity: 1, duration: .8, delay: 1 }); lenis?.start(); ScrollTrigger.refresh(); };
(async () => { await new Promise((r) => setTimeout(r, 600)); const r = await hostOpen.say(script.opening); if (r === 'ask') { askForm.classList.add('on'); askInput.focus(); } })();
askForm.addEventListener('submit', async (e) => { e.preventDefault(); const v = askInput.value.trim(); if (!v) return; guest = v.slice(0, 24); askForm.classList.remove('on'); hostOpen.type(guest, { speed: 20, pause: 200, cls: 'host__you' }); await hostOpen.say(script.afterName, vars()); document.getElementById('hostOpen').classList.add('is-done'); beginScroll(); });

/* bits: a host each, a mood each, a note each, a wipe on entry */
const sideHosts = {}; const side = (id) => (sideHosts[id] ??= createHost(document.getElementById(id), { sound, max: 2 }));
const once = (trigger, start, fn) => ScrollTrigger.create({ trigger, start, once: true, onEnter: fn });
const asideLabel = document.getElementById('asideLabel');
const moods = { flight: '#ffb45c', timeline: '#39d353', tv: '#f3ecde', loud: '#ff2f7b', car: '#121212', next: '#ffb45c', drawer: '#2a1f12', bye: '#ff4d2e' };
const bit = (id, text) => { ScrollTrigger.create({ trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => { if (st.isActive) { asideLabel.textContent = text; document.body.dataset.mood = id; } } }); once(`#${id}`, 'top 70%', () => { if (!reduced) wipe.go(moods[id]); const n = document.querySelector(`#${id} .note`); if (n) { n.textContent = script.notes[id] || ''; setTimeout(() => n.classList.add('on'), 1800); } }); };
const bodyBg = () => { const mid = innerHeight * .5; let cur = '#0d0d10'; document.querySelectorAll('.bit').forEach((b) => { if (b.getBoundingClientRect().top <= mid) cur = getComputedStyle(b).getPropertyValue('--bg').trim() || cur; }); document.body.style.setProperty('--bg', cur); };
ScrollTrigger.create({ onUpdate: bodyBg, onRefresh: bodyBg });

/* 01 the flight */
{ const J = script.journey; bit('flight', J.label);
  const lights = document.getElementById('cityLights'); let h = ''; [[330, 150, 60], [1010, 470, 110], [900, 430, 30], [700, 300, 20], [500, 220, 18], [1100, 520, 24], [250, 170, 16]].forEach(([x, y, n]) => { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, d = Math.pow(Math.random(), .5) * (n > 50 ? 60 : 26); h += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d * .6).toFixed(1)}" r="${(Math.random() * 1.6 + .4).toFixed(1)}" opacity="${(Math.random() * .7 + .2).toFixed(2)}"/>`; } }); lights.innerHTML = h;
  const route = document.getElementById('route'); const len = route.getTotalLength(); route.style.strokeDasharray = `${len}`; route.style.strokeDashoffset = `${len}`;
  const km = document.getElementById('flightKm'), yr = document.getElementById('flightYear'); const host = side('hostFlight'); let said = -1;
  const place = (p) => gsap.set('#plane', { motionPath: { path: route, align: route, alignOrigin: [.5, .5], autoRotate: true, start: 0, end: Math.max(.001, p) } }); place(0);
  ScrollTrigger.create({ trigger: '#flight', start: 'top top', end: () => `+=${innerHeight * 3.2}`, pin: '#flight .pin', scrub: .6, onUpdate: (st) => { const p = st.progress; place(p); route.style.strokeDashoffset = `${len * (1 - p)}`; km.textContent = `${Math.round(p * J.km).toLocaleString()} km`; yr.textContent = String(2006 + Math.round(p * 15)); const idx = J.stops.reduce((a, s, i) => (p >= s.at - .02 ? i : a), -1); if (idx > said) { said = idx; host.type(J.stops[idx].line, { pause: 200 }); } } });
}
/* 02 twenty years */
{ const T = script.timeline; bit('timeline', T.label); const host = side('hostTl'); const yearEl = document.getElementById('tlYear');
  const tl = createTimeline(document.getElementById('tl'), T.years, { sound, onYear: ([y, line]) => { yearEl.textContent = y; host.type(line, { pause: 100, speed: 16 }); } });
  once('#timeline', 'top 60%', async () => { await host.type(T.intro, { pause: 300 }); tl.set(0); });
}
/* 03 the tv years */
{ const T = script.tv; bit('tv', T.label); const host = side('hostTv');
  document.getElementById('remotePad').innerHTML = T.channels.map((c) => `<button class="remote__btn">${c.n}</button>`).join('');
  const tv = createTV(document.getElementById('tvset'), T.channels, { sound, onChannel: (c) => host.type(c.line, { pause: 100 }) });
  once('#tv', 'top 60%', async () => { await host.type(T.intro, { pause: 300 }); tv.set(0); });
}
/* 04 loud: the knob, and the letters that fall past nine */
{ const Lo = script.loud; bit('loud', Lo.label); const host = side('hostLoud'); let lastLvl = -1;
  const letters = createLetters(document.getElementById('loudBig'), 'LOUD');
  createKnob(document.getElementById('knobwrap'), { sound, onLevel: (v) => { document.getElementById('loud').style.setProperty('--lvl', Math.min(v, 8) / 11); const step = Lo.levels.reduce((a, l) => (v >= l[0] ? l : a), Lo.levels[0]); if (step[0] !== lastLvl) { lastLvl = step[0]; host.type(step[1], { pause: 100, speed: 18 }); } if (v >= 9 && !letters.dropped) letters.drop(); if (v < 3 && letters.dropped) letters.reset(); if (v > 6 && v < 9) gsap.to('#loud .pin', { x: (Math.random() - .5) * v * 1.4, y: (Math.random() - .5) * v, duration: .08 }); } });
  once('#loud', 'top 60%', () => host.type(Lo.intro, { pause: 300 }));
  ScrollTrigger.create({ trigger: '#loud', start: 'top bottom', end: 'bottom top', onLeave: () => letters.reset(), onLeaveBack: () => letters.reset() });
}
/* 05 the car geek: 3d, lines first, surfaces as you scroll, turns as you scroll */
{ const C = script.car; bit('car', C.label); const host = side('hostCar'); let lastKey = '', t = null;
  const car = createCar3D(document.getElementById('carCanvas'), { onChange: (key) => { if (key === lastKey) return; lastKey = key; clearTimeout(t); t = setTimeout(() => host.type(C.critique[key], { pause: 100, speed: 18 }), 700); } });
  document.querySelectorAll('#studio input[type=range]').forEach((r) => r.addEventListener('input', () => car.set(r.name, +r.value)));
  addEventListener('resize', car.resize); let on = false; gsap.ticker.add((tm) => { if (on) car.render(tm); });
  ScrollTrigger.create({ trigger: '#car', start: 'top top', end: () => `+=${innerHeight * 1.6}`, pin: '#car .pin', scrub: .5, onToggle: (st) => (on = true), onUpdate: (st) => { car.setSpin(st.progress * Math.PI * 1.6 - .4); car.setFill(gsap.utils.clamp(0, 1, (st.progress - .35) / .4)); } });
  ScrollTrigger.create({ trigger: '#car', start: 'top bottom', end: 'bottom top', onToggle: (st) => { on = st.isActive; car.resize(); } });
  once('#car', 'top 60%', () => host.type(C.intro, { pause: 300 }));
}
/* 06 what's next */
{ const Nx = script.next; bit('next', Nx.label); const host = side('hostNext');
  createSlot(document.getElementById('slot'), Nx.reels, Nx.reactions, { sound, onStop: (phrase, reaction) => host.type(`${phrase}. ${reaction}`, { pause: 100, speed: 22 }) });
  once('#next', 'top 60%', () => host.type(Nx.intro, { pause: 300 }));
}
/* 07 the drawer, filtered by what he did */
const caseView = createCase({ lenis, reduced, sound });
{ const D = script.drawer; bit('drawer', D.label); const host = side('hostDrawer');
  const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year));
  const wall = createWall(document.getElementById('wall'), document.getElementById('wallPlane'), sorted, { onOpen: (id) => caseView.open(id), reduced, sound });
  const filters = document.getElementById('filters'); const kinds = ['All', ...new Set(projects.map((p) => p.kind))]; const did = { All: 'everything', Event: 'nights', Exhibition: 'stands', Trophy: 'things to lift', Object: 'things to open', Interior: 'rooms that stayed' };
  filters.innerHTML = kinds.map((k, i) => `<button class="${i ? '' : 'on'}" data-k="${k}">${did[k] || k}</button>`).join('');
  filters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; filters.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); wall.filter(b.dataset.k); sound.pin(); });
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a || a.closest('.wall')) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });
  once('#drawer', 'top 60%', () => host.type(D.intro, { pause: 300 }));
}
/* the work, if you insist: the strip */
{ const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year)); const arc = createArchive(document.getElementById('archive'), sorted, { onOpen: (id) => caseView.open(id), sound }); document.getElementById('archiveBtn').addEventListener('click', arc.open); }
/* the office, over any scene */
{ const O = script.office; document.getElementById('officeTitle').textContent = O.title; document.getElementById('officeList').innerHTML = O.lines.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); const m = document.getElementById('officeMail'); m.href = `mailto:${script.contact.email}`; m.textContent = script.contact.email; document.getElementById('officeBe').href = script.contact.behance; document.getElementById('officePhone').textContent = script.contact.phone;
  const office = document.getElementById('office'); const open = () => { office.classList.add('on'); office.setAttribute('aria-hidden', 'false'); sound.flip?.(); }; const close = () => { office.classList.remove('on'); office.setAttribute('aria-hidden', 'true'); };
  document.getElementById('officeBtn').addEventListener('click', open); document.getElementById('officeClose').addEventListener('click', close); office.addEventListener('click', (e) => { if (e.target === office) close(); }); addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }); }
/* 08 goodbye */
{ const B = script.bye; bit('bye', B.label); const host = side('hostBye');
  const ml = document.getElementById('mailLink'); ml.href = `mailto:${script.contact.email}`; ml.textContent = script.contact.email; document.getElementById('behanceLink').href = script.contact.behance; document.getElementById('phoneLine').textContent = script.contact.phone;
  once('#bye', 'top 55%', async () => { for (const l of B.lines) await host.type(l.replace('{name}', guest), { pause: 500 }); document.getElementById('hostBye').classList.add('is-done');
    const booth = createBooth(document.getElementById('card'), { name: guest, line: B.lines[1], card: B.card.replace('{date}', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) });
    const flash = document.createElement('div'); flash.className = 'flash'; document.body.appendChild(flash); sound.flip?.();
    gsap.timeline().to(flash, { opacity: 1, duration: .08 }).to(flash, { opacity: 0, duration: .8 }).to('#card', { opacity: 1, scale: 1, rotate: -2, duration: 1, ease: 'expo.out' }, .1).to('#cardDl', { opacity: 1, duration: .5 }, .8);
    document.getElementById('cardDl').addEventListener('click', () => booth.download()); });
}
addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));
