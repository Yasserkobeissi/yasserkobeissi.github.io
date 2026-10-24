import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studio } from '../data.js';
export function initStudio({ reduced }) {
  const s = studio.studio;
  document.getElementById('studioTitle').innerHTML = s.title.replace(', one line', ',<br/><em class="serif">one line</em>');
  document.getElementById('studioIntro').textContent = s.intro;
  document.getElementById('founderImg').src = s.founder.photo; document.getElementById('founderCap').textContent = s.founder.caption;
  document.getElementById('numbers').innerHTML = s.numbers.map((n) => `<div><strong data-count="${n.n}">${n.n}</strong><span>${n.l}</span></div>`).join('');
  document.getElementById('caps').innerHTML = s.capabilities.map((c) => `<li>${c}</li>`).join('');
  document.getElementById('tools').innerHTML = s.tools.map((c) => `<li>${c}</li>`).join('');
  document.getElementById('voices').innerHTML = s.voices.map((v) => `<blockquote class="voice"><p>“${v.quote}”</p><span class="mono">${v.who}</span></blockquote>`).join('');
  const cl = document.getElementById('clients'); const html = s.clients.map((c) => `<span>${c}</span>`).join(''); cl.innerHTML = html + html;
  if (!reduced) gsap.to(cl, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 });
  // timeline: items on a grid, a drawn line that connects them as you scroll
  const list = document.getElementById('timelineList');
  list.innerHTML = s.timeline.map((t) => `<li class="timeline__item"><span class="mono">${t.y}</span><strong>${t.co}</strong><span>${t.role}</span></li>`).join('');
  const items = [...list.querySelectorAll('li')], svg = document.getElementById('timelineSvg'), path = document.getElementById('timelinePath');
  const draw = () => {
    const r = svg.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    const pts = items.map((li) => { const b = li.getBoundingClientRect(); return [b.left - r.left + 6, b.top - r.top + 6]; });
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const c = 60; d += ` C ${x0 + c} ${y0}, ${x1 - c} ${y1}, ${x1} ${y1}`; }
    path.setAttribute('d', d); const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = reduced ? 0 : len; return len;
  };
  let len = draw(); addEventListener('resize', () => { len = draw(); ScrollTrigger.refresh(); });
  if (reduced) { items.forEach((i) => i.classList.add('is-on')); return; }
  ScrollTrigger.create({ trigger: '#timeline', start: 'top 75%', end: 'bottom 60%', scrub: true, onUpdate: (st) => { path.style.strokeDashoffset = len * (1 - st.progress); items.forEach((li, i) => li.classList.toggle('is-on', i / items.length < st.progress)); } });
  ScrollTrigger.create({ trigger: '#numbers', start: 'top 80%', once: true, onEnter: () => document.querySelectorAll('[data-count]').forEach((el) => { const m = el.dataset.count.match(/^(\d+)(.*)$/); if (!m) return; const o = { v: 0 }; gsap.to(o, { v: +m[1], duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v) + m[2]) }); }) });
  gsap.from('#founder', { rotate: -6, y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#founder', start: 'top 85%' } });
}
