import gsap from 'gsap';
import { projects, byId, show } from './data.js';
import { createWorld } from './lib/world.js';
import { createSound } from './lib/sound.js';
import { createCase } from './lib/case.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(hover:none)').matches;
history.scrollRestoration = 'manual'; window.scrollTo(0, 0);
const sound = createSound(); const soundBtn = document.getElementById('soundBtn');
soundBtn.addEventListener('click', () => { const on = sound.toggle(); soundBtn.classList.toggle('on', on); });
const cursor = document.querySelector('.cursor');
if (!touch) { const cx = gsap.quickTo(cursor, 'x', { duration: .15, ease: 'power3' }), cy = gsap.quickTo(cursor, 'y', { duration: .15, ease: 'power3' }); addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true }); document.addEventListener('pointerover', (e) => cursor.classList.toggle('is-link', !!e.target.closest('a, button'))); }

/* copy */
document.getElementById('open1').textContent = show.open[0]; document.getElementById('open2').textContent = show.open[1];
const chapters = show.chapters.map((c) => ({ ...c, src: c.room ? byId[c.room].images[Math.min(c.screen, byId[c.room].images.length - 1)] : null }));
const chEl = document.getElementById('chapters');
chEl.innerHTML = chapters.map((c, i) => (c.form === 'swirl' || c.form === 'line') ? '' : `<div class="ch" data-i="${i}"><p class="mono">${c.label}</p><p class="ch__line serif">${c.line}</p><p class="ch__sub">${c.sub}</p><a class="ch__open" href="#room-${c.room}" data-open-room="${c.room}"><span>Open the room</span><span>→</span></a></div>`).join('');
const endC = chapters[chapters.length - 1]; document.getElementById('endLine').textContent = endC.line; document.getElementById('endSub').textContent = endC.sub;
const ml = document.getElementById('mailLink'); ml.href = `mailto:${show.contact.email}`; ml.textContent = show.contact.email; document.getElementById('behanceLink').href = show.contact.behance; document.getElementById('phoneLine').textContent = show.contact.phone;

/* rooms overlay */
const rooms = document.getElementById('rooms'), list = document.getElementById('roomsList'), peek = document.getElementById('peek'), peekImg = peek.querySelector('img');
const sorted = [...projects].sort((a, b) => b.year.localeCompare(a.year) || a.name.localeCompare(b.name));
list.innerHTML = sorted.map((p, i) => `<li class="row"><span class="mono">${String(i + 1).padStart(2, '0')}</span><a href="#room-${p.id}" data-open-room="${p.id}" data-id="${p.id}"><strong>${p.name}</strong></a><em>${p.thought || ''}</em><span class="mono row__k">${p.kind} · ${p.year}</span></li>`).join('');
document.getElementById('roomsBtn').addEventListener('click', () => { rooms.classList.add('on'); rooms.setAttribute('aria-hidden', 'false'); });
document.getElementById('roomsClose').addEventListener('click', () => { rooms.classList.remove('on'); rooms.setAttribute('aria-hidden', 'true'); });
if (!touch) { const px = gsap.quickTo(peek, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .5, ease: 'power3' }); list.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }); list.addEventListener('pointerover', (e) => { const a = e.target.closest('a[data-id]'); if (!a) return; peekImg.src = byId[a.dataset.id].cover; peek.classList.add('on'); list.classList.add('hov'); }); list.addEventListener('pointerleave', () => { peek.classList.remove('on'); list.classList.remove('hov'); }); }
const caseView = createCase({ lenis: null, reduced, sound });
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open-room]'); if (!a) return; e.preventDefault(); caseView.open(a.dataset.openRoom); });

/* the world */
const world = createWorld(document.getElementById('gl'), chapters, { reduced });
addEventListener('resize', world.resize); addEventListener('pointermove', (e) => world.pointer(e.clientX, e.clientY), { passive: true });
let target = 0, progress = 0; const track = document.getElementById('track');
const max = () => document.documentElement.scrollHeight - innerHeight;
addEventListener('scroll', () => { target = Math.max(0, Math.min(1, scrollY / max())); }, { passive: true });
const walkBar = document.getElementById('walk'), walkLabel = document.getElementById('walkLabel');
const chNodes = [...document.querySelectorAll('.ch')]; const openEl = document.getElementById('open'), endEl = document.getElementById('end');
let shownCh = -1;
gsap.ticker.add((t, dtms) => {
  const dt = Math.min(.05, dtms / 1000); progress += (target - progress) * Math.min(1, dt * 4); world.st.t = progress; world.render(dt); sound.tick();
  const L = chapters.length - 1, f = progress * L, k = Math.floor(f), local = f - k;
  walkBar.style.setProperty('--p', `${progress * 100}%`);
  // text for a room shows while you are inside it: from arrival to just before leaving
  let cur = -1; if (local > 0.62 && k + 1 <= L) cur = k + 1; else if (local < 0.25 && k > 0) cur = k;
  if (cur !== shownCh) { shownCh = cur; chNodes.forEach((n) => n.classList.toggle('on', +n.dataset.i === cur)); const c = chapters[cur]; walkLabel.textContent = cur <= 0 ? 'Walk in' : cur === L ? 'The end' : c.label; }
  openEl.style.opacity = progress < 0.06 ? 1 : Math.max(0, 1 - (progress - 0.06) / 0.05);
  endEl.classList.toggle('on', progress > 0.93);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') { rooms.classList.remove('on'); } });

/* in */
const tl = gsap.timeline({ delay: .6 });
tl.to('#loader', { opacity: 0, duration: 1, onComplete: () => document.getElementById('loader').remove() })
  .to('.open__t span', { opacity: 1, y: 0, duration: 1.4, stagger: .3, ease: 'power3.out' }, .3)
  .to(['.open__hint', '#hud', '#walk'], { opacity: 1, duration: 1, stagger: .15 }, 1.6);
