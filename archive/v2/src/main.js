import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects, studio } from './data.js';
import { createScene } from './lib/scene.js';
import { createCase } from './chapters/case.js';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);

// the rooms, placed along the corridor in chapters
const chapters = [
  { k: 'Event', kicker: 'Chapter 01 · Events', title: 'Nights people drive home from.', desc: 'National days, Ramadan tents, founding days, fun days. The rooms that only exist for one evening and are remembered for a year.', range: [0.04, 0.32] },
  { k: 'Exhibition', kicker: 'Chapter 02 · Exhibitions', title: 'Stands built as small architecture.', desc: 'Booths that visitors walk into rather than past. Drawn with a marker first, then modelled to the last cable.', range: [0.36, 0.62] },
  { k: 'Trophy', kicker: 'Chapter 03 · Objects', title: 'Things that hold a moment in the hand.', desc: 'Trophies, invitation boxes and gifts. The small objects that leave with the guest.', range: [0.65, 0.82] },
  { k: 'Interior', kicker: 'Chapter 04 · Interiors', title: 'Rooms that stay.', desc: 'Offices and permanent spaces, drawn with the same pen as the one-night rooms.', range: [0.84, 0.92] },
];
const rooms = [];
chapters.forEach((c) => {
  const list = projects.filter((p) => (c.k === 'Trophy' ? (p.kind === 'Trophy' || p.kind === 'Object') : p.kind === c.k));
  list.forEach((p, i) => { const f = (i + 0.5) / list.length; rooms.push({ project: p, t: c.range[0] + f * (c.range[1] - c.range[0]), angle: i * 2.4 + c.range[0] * 10, r: 1.1 + (i % 3) * 0.55 }); });
});

let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .085, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; }
window.__ST = ScrollTrigger;
lenis?.stop();

// copy
const c = studio.contact;
document.getElementById('mailBtn').href = `mailto:${c.email}`; const ml = document.getElementById('mailLink'); ml.href = `mailto:${c.email}`; ml.textContent = c.email;
document.getElementById('behanceLink').href = c.behance; document.getElementById('phoneLine').textContent = c.phone; document.getElementById('cityLine').textContent = c.city; document.getElementById('year').textContent = new Date().getFullYear();

// rooms list
const list = document.getElementById('roomsList'), peek = document.getElementById('roomsPeek'), peekImg = peek.querySelector('img');
const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year));
list.innerHTML = sorted.map((p, i) => `<li class="room" data-id="${p.id}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><a href="#room-${p.id}"><strong>${p.title}</strong></a><span class="mono room__k">${p.kind} · ${p.year}</span></li>`).join('');
const caseView = createCase({ lenis, reduced });
list.addEventListener('click', (e) => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); caseView.open(a.closest('li').dataset.id); });
if (!touch) {
  const px = gsap.quickTo(peek, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .5, ease: 'power3' });
  list.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); });
  list.addEventListener('pointerover', (e) => { const li = e.target.closest('.room'); if (!li) return; const p = projects.find((x) => x.id === li.dataset.id); peekImg.src = p.images[Math.min(1, p.images.length - 1)]; peek.classList.add('is-on'); list.classList.add('is-hovering'); });
  list.addEventListener('pointerleave', () => { peek.classList.remove('is-on'); list.classList.remove('is-hovering'); });
}
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 2, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.getAttribute('href')); }));

// cursor
const cursor = document.querySelector('.cursor');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .25, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true }); document.addEventListener('pointerover', (e) => cursor.classList.toggle('is-link', !!e.target.closest('a, button'))); }

// scene
const bar = document.getElementById('loaderBar'), ltext = document.getElementById('loaderText');
const gl = await createScene(document.getElementById('gl'), { rooms, reduced, onProgress: (p) => gsap.to(bar, { width: `${p * 100}%`, duration: .6 }) });
addEventListener('resize', gl.resize);
addEventListener('pointermove', (e) => gl.pointer(e.clientX, e.clientY), { passive: true });
gsap.ticker.add((t, dt) => gl.render(Math.min(0.05, dt / 1000)));

// scroll choreography
const nav = document.getElementById('nav'), navState = document.getElementById('navState');
const chapterEl = document.getElementById('chapter'), chK = document.getElementById('chapterK'), chT = document.getElementById('chapterT'), chD = document.getElementById('chapterD');
const depthEl = document.getElementById('depth'), depthBar = document.getElementById('depthBar'), depthN = document.getElementById('depthN');
let currentChapter = -1;
ScrollTrigger.create({ trigger: '#head', start: 'top top', end: () => `+=${innerHeight * 1.6}`, pin: '.head__pin', scrub: true, onUpdate: (st) => { gl.st.enter = st.progress; } });
ScrollTrigger.create({ trigger: '#inside', start: 'top top', end: () => `+=${innerHeight * 9}`, pin: '.inside__pin', scrub: true,
  onUpdate: (st) => {
    const w = st.progress; gl.st.walk = w; depthEl.classList.toggle('is-on', w > 0.01 && w < 0.95); depthBar.style.width = `${w * 100}%`; depthN.textContent = String(Math.round(w * 99)).padStart(2, '0');
    const ci = chapters.findIndex((ch) => w >= ch.range[0] && w <= ch.range[1]);
    if (ci !== currentChapter) { currentChapter = ci; if (ci < 0) chapterEl.classList.remove('is-on'); else { chK.textContent = chapters[ci].kicker; chT.textContent = chapters[ci].title; chD.textContent = chapters[ci].desc; chapterEl.classList.add('is-on'); navState.textContent = `Inside · ${chapters[ci].k === 'Trophy' ? 'Objects' : chapters[ci].k + 's'}`; } }
  } });
// one place decides whether we are inside: used for text colour, nav state and labels
const labels = Array.from({ length: 10 }, () => { const d = document.createElement('div'); d.className = 'label mono'; document.body.appendChild(d); return d; });
let wasInside = null;
gsap.ticker.add(() => {
  const inside = gl.st.enter > 0.55 && gl.st.walk < 0.95;
  if (inside !== wasInside) { wasInside = inside; document.body.classList.toggle('is-inside', inside); if (!inside) navState.textContent = 'Outside'; else if (currentChapter < 0) navState.textContent = 'Inside'; }
  // labels on the nearest room neurons ahead of the camera
  if (!inside || gl.st.enter < 1) { labels.forEach((l) => (l.style.opacity = 0)); return; }
  const cands = gl.brain.roomPositions.map((p, i) => ({ i, s: gl.project(p) })).filter((c) => c.s.inFront && c.s.z < 0.9992 && c.s.x > 40 && c.s.x < innerWidth - 160 && c.s.y > 80 && c.s.y < innerHeight - 60).sort((a, b) => a.s.z - b.s.z).slice(0, labels.length);
  labels.forEach((l, k) => { const c = cands[k]; if (!c) { l.style.opacity = 0; return; } const p = rooms[c.i].project; l.textContent = p.title; l.style.transform = `translate(${c.s.x + 14}px, ${c.s.y - 8}px)`; l.style.opacity = (1 - (c.s.z - 0.995) / 0.0042) * 0.9; });
});

// room neurons: hover shows the room, click opens it
const node = document.getElementById('node'), nodeImg = document.getElementById('nodeImg'), nodeT = document.getElementById('nodeT'), nodeK = document.getElementById('nodeK');
let mouse = { x: -1, y: -1 }, hot = null;
addEventListener('pointermove', (e) => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
const headEl = document.getElementById('head');
addEventListener('pointermove', (e) => { gl.st.hoverHead = true; }, { passive: true });
gsap.ticker.add(() => {
  if (gl.st.enter < 1 || gl.st.walk > 0.95 || caseView.isOpen()) { if (hot) { hot = null; node.classList.remove('is-on'); cursor.classList.remove('is-hot'); } return; }
  let best = null, bd = touch ? 44 : 30;
  gl.brain.roomPositions.forEach((p, i) => { const s = gl.project(p); if (!s.inFront) return; const d = Math.hypot(s.x - mouse.x, s.y - mouse.y); if (d < bd) { bd = d; best = i; } });
  if (best !== hot) { hot = best; if (best === null) { node.classList.remove('is-on'); cursor.classList.remove('is-hot'); } else { const p = rooms[best].project; nodeImg.src = p.images[Math.min(1, p.images.length - 1)]; nodeT.textContent = p.title; nodeK.textContent = `${p.kind} · ${p.year} · click to walk in`; node.classList.add('is-on'); cursor.classList.add('is-hot'); } }
  if (hot !== null) { node.style.transform = `translate(${mouse.x + 24}px, ${mouse.y - node.offsetHeight / 2}px)`; }
});
document.getElementById('gl').addEventListener('click', (e) => { if (touch) mouse = { x: e.clientX, y: e.clientY }; if (hot !== null) caseView.open(rooms[hot].project.id); });
document.getElementById('gl').style.pointerEvents = 'auto';

// loading him in
ltext.textContent = 'Loading him in';
await new Promise((r) => setTimeout(r, 300));
const loader = document.getElementById('loader');
window.scrollTo(0, 0);
const tl = gsap.timeline({ onComplete: () => { lenis?.start(); lenis?.scrollTo(0, { immediate: true }); ScrollTrigger.refresh(); } });
tl.to(loader, { opacity: 0, duration: .6, onComplete: () => loader.remove() }, 0)
  .to(gl.head.u.uReveal, { value: 1.4, duration: reduced ? 0 : 2.4, ease: "power2.inOut" }, 0.1)
  .to('#nav', { opacity: 1, duration: 1 }, 1.2)
  .to(['#titleA', '#titleB'], { opacity: 1, y: 0, duration: 1.1, stagger: .12, ease: 'expo.out' }, 1.4)
  .to(['#headSub', '#headHint', '.head__ar'], { opacity: 1, duration: 1, stagger: .1 }, 1.9);
