import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import gsap from 'gsap';
import { studio } from '../data.js';
export function initManifesto({ reduced }) {
  const el = document.getElementById('manifestoText');
  el.innerHTML = studio.manifesto.map((l, i) => `<span class="${i === 1 ? 'is-serif' : ''}">${l}</span>`).join(' ');
  const split = new SplitText(el, { type: 'words', wordsClass: 'word' });
  el.querySelectorAll('.is-serif .word, .is-serif').forEach((w) => w.classList.add('is-serif'));
  const words = split.words;
  if (reduced) { words.forEach((w) => w.classList.add('is-on')); return; }
  ScrollTrigger.create({ trigger: '#manifesto', start: 'top 60%', end: 'bottom 70%', scrub: true, onUpdate: (st) => { const n = Math.floor(st.progress * (words.length + 3)); words.forEach((w, i) => w.classList.toggle('is-on', i < n)); } });
  gsap.to('#scribble', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.manifesto__scribble', start: 'top 85%', end: 'top 45%', scrub: true } });
}
