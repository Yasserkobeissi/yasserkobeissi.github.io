import gsap from 'gsap';
import { site } from '../data.js';
/* Little windows, like a desktop. Draggable, closable, one per topic. */
export function createWindows({ onPoke, cursor }) {
  const root = document.getElementById('windows'); let z = 1, pokes = 0;
  const bodies = {
    about: () => `<div>${site.about.paras.map((p) => `<p>${p}</p>`).join('')}</div><dl class="win__facts">${site.about.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`,
    tools: () => `<div class="win__tools">${site.tools.groups.map((g) => `<div><h4>${g.k}</h4><div class="chips">${g.items.map((i) => `<span>${i}</span>`).join('')}</div></div>`).join('')}</div>`,
    hi: () => `<div class="win__hi"><p>${site.contact.line}</p><a class="mail" href="mailto:${site.contact.email}">${site.contact.email}</a><p class="mono">${site.contact.phone} · <a href="${site.contact.behance}" target="_blank" rel="noopener">Behance ↗</a></p></div>`,
    poke: () => `<div class="win__poke"><strong id="pokeSay">${site.pokes[Math.min(pokes, site.pokes.length - 1)]}</strong><p class="mono">Pokes today: <span id="pokeN">${pokes}</span></p><button id="pokeAgain">Poke again</button></div>`,
  };
  const titles = { about: site.about.title, tools: site.tools.title, hi: 'sayhi.msg', poke: 'yasser.exe' };
  const open = (id) => {
    const existing = root.querySelector(`[data-win="${id}"]`); if (existing) { existing.style.zIndex = ++z; if (id === 'poke') poke(existing); return existing; }
    const w = document.createElement('div'); w.className = 'win'; w.dataset.win = id;
    const n = root.children.length; const x = Math.min(innerWidth - 560, 80 + n * 40 + Math.random() * 80), y = Math.min(innerHeight - 420, 120 + n * 36 + Math.random() * 60);
    w.style.left = `${Math.max(16, x)}px`; w.style.top = `${Math.max(80, y)}px`; w.style.zIndex = ++z;
    w.innerHTML = `<div class="win__bar"><button class="win__x" aria-label="Close"></button><span class="mono">${titles[id]}</span></div><div class="win__body">${bodies[id]()}</div>`;
    root.appendChild(w);
    gsap.to(w, { opacity: 1, scale: 1, y: 0, duration: .6, ease: 'expo.out' });
    w.querySelector('.win__x').addEventListener('click', () => gsap.to(w, { opacity: 0, scale: .94, y: 16, duration: .3, ease: 'power2.in', onComplete: () => w.remove() }));
    const bar = w.querySelector('.win__bar'); let drag = null;
    bar.addEventListener('pointerdown', (e) => { drag = { dx: e.clientX - w.offsetLeft, dy: e.clientY - w.offsetTop }; w.style.zIndex = ++z; bar.setPointerCapture(e.pointerId); });
    bar.addEventListener('pointermove', (e) => { if (!drag) return; w.style.left = `${e.clientX - drag.dx}px`; w.style.top = `${e.clientY - drag.dy}px`; });
    bar.addEventListener('pointerup', () => (drag = null));
    if (id === 'poke') { poke(w); w.querySelector('#pokeAgain').addEventListener('click', () => poke(w)); }
    return w;
  };
  const poke = (w) => { pokes++; onPoke?.(pokes); const say = w.querySelector('#pokeSay'); if (say) { say.textContent = site.pokes[Math.min(pokes - 1, site.pokes.length - 1)]; gsap.fromTo(say, { scale: .9, opacity: .3 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }); } const n = w.querySelector('#pokeN'); if (n) n.textContent = pokes; };
  return { open };
}
