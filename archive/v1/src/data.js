import raw from '../content/behance-raw.json';
import studio from '../content/studio.json';

const kind = (t) => {
  const s = t.toLowerCase();
  if (s.includes('trophy')) return 'Trophy';
  if (s.includes('booth') || s.includes('seamless') || s.includes('big 5')) return 'Exhibition';
  if (s.includes('box')) return 'Object';
  if (s.includes('interior')) return 'Interior';
  return 'Event';
};
const img = (id, f) => `/img/${id}/${f.replace(/\.[^.]+$/, '')}.jpg`;

export const projects = raw.map((p) => ({
  ...p,
  kind: kind(p.title),
  year: String(p.date).slice(0, 4),
  url: `https://www.behance.net/gallery/${p.id}/${p.slug}`,
  images: p.imgs.map((f) => img(p.id, f)),
  cover: img(p.id, p.imgs[0]),
}));
export const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
export const featured = studio.featured.map((f) => ({ ...byId[f.id], frames: f.frames.map((i) => byId[f.id].images[Math.min(i, byId[f.id].images.length - 1)]), note: f.note }));
export { studio };
