import gsap from 'gsap';
/* A slot machine for what's next. He pulls it himself. */
export function createSlot(root, reels, reactions, { onStop, sound }) {
  const cols = [...root.querySelectorAll('.slot__reel')]; let spinning = false, pulls = 0;
  cols.forEach((c, i) => { c.innerHTML = reels[i].concat(reels[i]).map((t) => `<span>${t}</span>`).join(''); });
  const pull = () => { if (spinning) return; spinning = true; pulls++; sound?.flip?.(); const picks = reels.map((r) => Math.floor(Math.random() * r.length));
    cols.forEach((c, i) => { const h = c.firstElementChild.offsetHeight; const target = -(reels[i].length + picks[i]) * h; gsap.fromTo(c, { y: 0 }, { y: target, duration: 1.6 + i * .5, ease: 'power3.out', onComplete: () => { if (i === cols.length - 1) { spinning = false; const phrase = picks.map((p, k) => reels[k][p]).join(' '); onStop?.(phrase, reactions[Math.min(reactions.length - 1, pulls === 1 ? 0 : Math.floor(Math.random() * reactions.length))], pulls); } } }); });
  };
  root.querySelector('.slot__lever').addEventListener('click', pull);
  return { pull };
}
