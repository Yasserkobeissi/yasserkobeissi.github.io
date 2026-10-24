import raw from '../content/behance-raw.json';
import rooms from '../content/rooms.json';
import show from '../content/rooms-walk.json';
const kind = (t) => { const s = t.toLowerCase(); if (s.includes('trophy')) return 'Trophy'; if (s.includes('booth') || s.includes('seamless') || s.includes('big 5')) return 'Exhibition'; if (s.includes('box')) return 'Object'; if (s.includes('interior')) return 'Interior'; return 'Event'; };
const img = (id, f) => `/img/${id}/${f.replace(/\.[^.]+$/, '')}.jpg`;
export const projects = raw.map((p) => { const r = rooms[p.id] || {}; const images = p.imgs.map((f) => img(p.id, f)); return { ...p, ...r, name: r.name || p.title, kind: kind(p.title), year: String(p.date).slice(0, 4), url: `https://www.behance.net/gallery/${p.id}/${p.slug}`, images, cover: images[Math.min(1, images.length - 1)] }; });
export const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
export { show };
