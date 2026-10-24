import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createBooth } from '../lib/booth.js';
import { studio } from '../data.js';
export function initProcess({ reduced, ticker }) {
  document.getElementById('processTitle').textContent = studio.process.title;
  const ol = document.getElementById('processSteps');
  ol.innerHTML = studio.process.steps.map((s, i) => `<li class="process__step ${i === 0 ? 'is-on' : ''}"><span class="mono">${s.n}</span><div><strong>${s.word}</strong><p>${s.text}</p></div></li>`).join('');
  const lis = ol.querySelectorAll('li');
  const booth = createBooth(document.getElementById('booth'), { reduced });
  addEventListener('resize', booth.resize);
  addEventListener('pointermove', (e) => booth.pointer(e.clientX, e.clientY), { passive: true });
  let visible = false;
  ticker((dt) => { if (visible) booth.render(dt); });
  if (reduced) { booth.set(1); booth.render(1); visible = true; lis.forEach((l) => l.classList.add('is-on')); return; }
  ScrollTrigger.create({
    trigger: '#process', start: 'top top', end: () => `+=${innerHeight * 2.6}`, pin: '.process__pin', scrub: true, invalidateOnRefresh: true,
    onToggle: (st) => { visible = st.isActive; },
    onUpdate: (st) => { booth.set(st.progress); const i = Math.min(4, Math.floor(st.progress * 5.2)); lis.forEach((l, k) => l.classList.toggle('is-on', k === i)); },
  });
  ScrollTrigger.create({ trigger: '#process', start: 'top bottom', end: 'bottom top', onToggle: (st) => { visible = st.isActive; booth.resize(); } });
}
