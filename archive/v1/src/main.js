import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { createInk } from './lib/ink.js';
import { createCursor } from './lib/cursor.js';
import { playLoader } from './chapters/loader.js';
import { initHero } from './chapters/hero.js';
import { initManifesto } from './chapters/manifesto.js';
import { initBorn } from './chapters/born.js';
import { initProcess } from './chapters/process.js';
import { initWork } from './chapters/work.js';
import { initArchive } from './chapters/archive.js';
import { initStudio } from './chapters/studio.js';
import { initContact } from './chapters/contact.js';
import { createCase } from './chapters/case.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);

let lenis = null;
if (!reduced) { lenis = new Lenis({ lerp: .1, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.__lenis = lenis; } window.__ST = ScrollTrigger;
const ticker = (fn) => gsap.ticker.add((t, dt) => fn(dt / 1000));

// chapter colour: body background and foreground follow the chapter in view
const themes = { paper: ['#f3eee4', '#121110', '#ff4d2e'], coral: ['#ff4d2e', '#121110', '#121110'], ink: ['#121110', '#f3eee4', '#ffc94a'], yellow: ['#ffc94a', '#121110', '#1b35ff'] };
const setTheme = (name) => { const [bg, fg, ac] = themes[name]; document.body.style.setProperty('--bg', bg); document.body.style.setProperty('--fg', fg); document.body.style.setProperty('--accent', ac); document.body.dataset.theme = name; };
const themed = [...document.querySelectorAll('section[data-theme]')]; let currentTheme = '';
const pickTheme = () => { const mid = innerHeight * .5; let name = themed[0].dataset.theme; for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= mid) name = s.dataset.theme; } if (name !== currentTheme) { currentTheme = name; setTheme(name); } };
ScrollTrigger.create({ onUpdate: pickTheme, onRefresh: pickTheme }); pickTheme();

// nav
const goTo = (hash) => { const t = document.querySelector(hash); if (!t) return; lenis ? lenis.scrollTo(t, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) }) : t.scrollIntoView(); };
document.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('menu').classList.remove('is-open'); goTo(a.getAttribute('href')); }));
document.getElementById('burger').addEventListener('click', () => document.getElementById('menu').classList.toggle('is-open'));
let lastY = 0; ScrollTrigger.create({ onUpdate: (st) => { const y = st.scroll(); gsap.to('#nav', { yPercent: y > lastY && y > innerHeight * .8 ? -130 : 0, duration: .6, ease: 'expo.out', overwrite: true }); lastY = y; } });

const ink = createInk(document.getElementById('ink'), { reduced });
createCursor();
const caseView = createCase({ lenis, reduced });
const openCase = (id) => caseView.open(id);
const hero = initHero({ reduced });
initManifesto({ reduced });
initBorn({ reduced });
initProcess({ reduced, ticker });
initWork({ openCase, reduced });
initArchive({ openCase, reduced });
initStudio({ reduced });
initContact({ reduced, ink });

lenis?.stop();
document.fonts.ready.then(() => playLoader({ reduced, onDone: () => { lenis?.start(); lenis?.scrollTo(0, { immediate: true }); hero.enter(); ScrollTrigger.refresh(); } }));
addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));
