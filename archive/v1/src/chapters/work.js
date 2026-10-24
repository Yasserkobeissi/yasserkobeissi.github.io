import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featured } from '../data.js';
/* Horizontal pinned track. Each card cycles sketch, model, render, built as it crosses the middle. Velocity skews the cards. */
export function initWork({ openCase, reduced }) {
  const track = document.getElementById('workTrack');
  track.innerHTML = featured.map((p, i) => `
    <article class="card" data-id="${p.id}">
      <a class="card__media" href="#project-${p.id}" data-cursor="open" data-cursor-label="Open" aria-label="${p.title}">
        ${p.frames.map((f, k) => `<img src="${f}" alt="" class="${k === 0 ? 'is-on' : ''}" loading="${i < 2 ? 'eager' : 'lazy'}" />`).join('')}
        <div class="card__dots">${p.frames.map((_, k) => `<i class="${k === 0 ? 'is-on' : ''}"></i>`).join('')}</div>
      </a>
      <div class="card__row"><span class="card__n">0${i + 1}</span><h3 class="card__title">${p.title}</h3><span class="mono card__kind">${p.kind} · ${p.year}</span><p class="card__note serif">${p.note}</p></div>
    </article>`).join('');
  track.querySelectorAll('.card__media').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openCase(a.closest('.card').dataset.id, e.clientX, e.clientY); }));
  const cards = [...track.querySelectorAll('.card')];
  const counter = document.getElementById('workCounter');
  const cycle = (card, t) => { const imgs = card.querySelectorAll('img'), dots = card.querySelectorAll('.card__dots i'); const k = Math.min(imgs.length - 1, Math.floor(t * imgs.length)); imgs.forEach((im, i) => im.classList.toggle('is-on', i === k)); dots.forEach((d, i) => d.classList.toggle('is-on', i === k)); };
  if (reduced || innerWidth < 900) {
    cards.forEach((c) => ScrollTrigger.create({ trigger: c, start: 'top 80%', end: 'bottom 20%', scrub: true, onUpdate: (st) => cycle(c, st.progress) }));
    return;
  }
  const dist = () => track.scrollWidth - innerWidth;
  const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
    trigger: '#work', start: 'top top', end: () => `+=${dist() * 1.05}`, pin: '.work__pin', scrub: .6, invalidateOnRefresh: true,
    onUpdate: (st) => {
      const v = st.getVelocity() / 1000; const skew = gsap.utils.clamp(-8, 8, -v * 2);
      gsap.to(cards, { skewX: skew, duration: .5, ease: 'power3.out', overwrite: 'auto' });
      const x = -st.progress * dist();
      let nearest = 0, best = 1e9;
      cards.forEach((c, i) => { const cx = c.offsetLeft + x + c.offsetWidth / 2 - innerWidth / 2; const d = Math.abs(cx); if (d < best) { best = d; nearest = i; } const t = gsap.utils.clamp(0, .999, .5 + cx / (innerWidth * 1.4)); cycle(c, 1 - t); });
      counter.textContent = `0${nearest + 1} / 0${cards.length}`;
    } } });
  return tween;
}
