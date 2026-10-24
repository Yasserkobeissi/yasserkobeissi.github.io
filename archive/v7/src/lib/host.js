/* He types. With his tempo: pauses, a word deleted, a retype. */
export function createHost(el, { sound, max = 0 } = {}) {
  let cancel = false;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const type = async (line, { speed = 34, pause = 500, cls = '' } = {}) => {
    const p = document.createElement('p'); p.className = `host__line ${cls}`; el.appendChild(p); el.scrollTop = el.scrollHeight; if (max) while (el.children.length > max) el.removeChild(el.firstChild);
    const words = line.split(' '); let text = '';
    for (let w = 0; w < words.length; w++) {
      const word = words[w] + (w < words.length - 1 ? ' ' : '');
      // once in a while he types the wrong thing and fixes it
      if (word.length > 5 && Math.random() < 0.12) { const wrong = word.slice(0, 3) + 'e'; for (const ch of wrong) { if (cancel) return; text += ch; p.textContent = text; sound?.key?.(); await wait(speed + Math.random() * 40); } await wait(260); for (let k = 0; k < wrong.length; k++) { text = text.slice(0, -1); p.textContent = text; await wait(28); } }
      for (const ch of word) { if (cancel) return; text += ch; p.textContent = text; sound?.key?.(); await wait(ch === '.' || ch === ',' ? speed * 5 : speed + Math.random() * 50); }
    }
    el.scrollTop = el.scrollHeight; await wait(pause); return p;
  };
  const say = async (lines, vars = {}) => { for (const L of lines) { const t = L.t.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ''); await type(t, { pause: L.pause ?? 500 }); if (L.ask) return 'ask'; } };
  return { type, say, clear() { el.innerHTML = ''; }, stop() { cancel = true; } };
}
