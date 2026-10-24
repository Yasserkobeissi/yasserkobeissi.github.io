import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { studio } from '../data.js';
export function initContact({ reduced, ink }) {
  const c = studio.contact;
  document.getElementById('contactTitle').innerHTML = c.title.map((l) => `<span><span data-chars>${l}</span></span>`).join('');
  document.getElementById('mailBtn').href = `mailto:${c.email}`;
  const ml = document.getElementById('mailLink'); ml.href = `mailto:${c.email}`; ml.textContent = c.email;
  document.getElementById('behanceLink').href = c.behance; document.getElementById('phoneLine').textContent = c.phone; document.getElementById('cityLine').textContent = c.city;
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('clearInk').addEventListener('click', () => ink.clear());
  document.querySelectorAll('#contactTitle [data-chars]').forEach((w) => new SplitText(w, { type: 'chars', charsClass: 'char' }));
  const chars = document.querySelectorAll('#contactTitle .char');
  if (reduced) { gsap.set(chars, { y: 0 }); return; }
  gsap.to(chars, { y: 0, duration: 1.2, stagger: .02, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 70%' } });
}
