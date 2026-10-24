import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studio } from '../data.js';
export function initHero({ reduced }) {
  const s = studio.hero;
  document.getElementById('heroSketch').src = s.sketch;
  const render = document.getElementById('heroRender'); render.style.backgroundImage = `url('${s.render}')`;
  document.getElementById('heroKicker').textContent = s.kicker;
  const mq = document.getElementById('heroMarquee'); const html = s.marquee.map((w) => `<span>${w}</span>`).join(''); mq.innerHTML = html + html;
  if (!reduced) gsap.to(mq, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
  document.querySelectorAll('.hero__wordmark [data-chars]').forEach((w) => new SplitText(w, { type: 'chars', charsClass: 'char' }));
  const chars = document.querySelectorAll('.hero__wordmark .char');
  // cursor reveals the render under the sketch; the reveal grows while you move and shrinks when you rest
  const art = document.getElementById('heroArt');
  const mx = gsap.quickTo(render, '--mx', { duration: .45, ease: 'power3' }), my = gsap.quickTo(render, '--my', { duration: .45, ease: 'power3' });
  const r = { v: 0 }; let idle;
  const setR = () => render.style.setProperty('--r', `${r.v}px`);
  art.addEventListener('pointermove', (e) => {
    const b = art.getBoundingClientRect(); mx(`${((e.clientX - b.left) / b.width) * 100}%`); my(`${((e.clientY - b.top) / b.height) * 100}%`);
    gsap.to(r, { v: Math.min(innerWidth, innerHeight) * .32, duration: .8, ease: 'power3.out', onUpdate: setR, overwrite: true });
    clearTimeout(idle); idle = setTimeout(() => gsap.to(r, { v: 0, duration: 1.4, ease: 'power3.inOut', onUpdate: setR, overwrite: true }), 1600);
  });
  art.addEventListener('pointerleave', () => gsap.to(r, { v: 0, duration: 1, ease: 'power3.inOut', onUpdate: setR, overwrite: true }));
  // touch: a slow breathing reveal in the middle so phones still see the room
  if (matchMedia('(hover:none)').matches && !reduced) { render.style.setProperty('--mx', '55%'); render.style.setProperty('--my', '45%'); gsap.to(r, { v: innerWidth * .5, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', onUpdate: setR }); }
  // scroll: wordmark parallax
  gsap.to('.hero__wordmark', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__art', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  return {
    enter() {
      if (reduced) { gsap.set(chars, { y: 0 }); return; }
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to(chars, { y: 0, duration: 1.3, stagger: { each: .035, from: 'start' } }, 0)
        .to(['.hero__kicker', '.hero__hint', '.hero__ar', '#nav'], { opacity: 1, duration: 1.1, stagger: .1 }, .6)
        .fromTo(r, { v: 0 }, { v: Math.min(innerWidth, innerHeight) * .28, duration: 1.6, ease: 'power3.inOut', onUpdate: setR, onStart: () => { render.style.setProperty('--mx', '62%'); render.style.setProperty('--my', '46%'); } }, .4)
        .to(r, { v: 0, duration: 1.2, ease: 'power3.inOut', onUpdate: setR }, 2.6);
    },
  };
}
