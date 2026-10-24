import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studio, byId } from '../data.js';
/* Pinned. Scroll scrubs one project from marker sketch to opening night, using its own Behance frames. */
export function initBorn({ reduced }) {
  const b = studio.born; const p = byId[b.project];
  document.getElementById('bornTitle').textContent = b.title;
  document.getElementById('bornProject').textContent = p.title;
  const steps = document.getElementById('bornSteps');
  steps.innerHTML = b.steps.map((s, i) => `<li class="born__step ${i === 0 ? 'is-on' : ''}"><span class="mono">0${i + 1}</span><div><strong>${s.label}</strong><p>${s.text}</p></div></li>`).join('');
  const stack = document.getElementById('bornStack');
  stack.innerHTML = b.steps.map((s) => `<img src="${p.images[s.img]}" alt="${p.title}, ${s.label}" />`).join('');
  const imgs = stack.querySelectorAll('img'); const lis = steps.querySelectorAll('li');
  const tagN = document.getElementById('bornTagN'), tagL = document.getElementById('bornTagL'), bar = document.getElementById('bornBar');
  const n = b.steps.length; let cur = 0;
  const show = (i) => { if (i === cur) return; cur = i; imgs.forEach((im, k) => gsap.to(im, { opacity: k === i ? 1 : 0, duration: .5, ease: 'power2.out' })); lis.forEach((li, k) => li.classList.toggle('is-on', k === i)); tagN.textContent = `0${i + 1}`; tagL.textContent = b.steps[i].label; };
  if (reduced || innerWidth < 900) { // phones: stack is static, tap the steps
    lis.forEach((li, i) => li.addEventListener('click', () => show(i)));
    return;
  }
  ScrollTrigger.create({
    trigger: '#born', start: 'top top', end: () => `+=${innerHeight * (n + 1)}`, pin: '.born__pin', scrub: true, invalidateOnRefresh: true,
    onUpdate: (st) => { bar.style.width = `${st.progress * 100}%`; show(Math.min(n - 1, Math.floor(st.progress * n * 1.04))); gsap.set(imgs[cur], { scale: 1 + (st.progress * n - cur) * .02 }); },
  });
}
