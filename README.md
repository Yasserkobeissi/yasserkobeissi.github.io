# Yasser Kobeissi — portfolio

Four versions live side by side. Each is its own Vite project and its own git tag.

| Folder | Idea | Dev server |
|---|---|---|
| `v4/` | **The Sketchbook.** Every page is drawn as you scroll: marker strokes paint his sketch, the render develops over it, the built photo is taped on. Marker cursor with ink and sound, handwritten notes, stickers, a polaroid drawer of all 34 rooms. | `cd v4 && npm run dev` → http://127.0.0.1:5183 |
| `v3/` | Cinematic intro on his portrait, bold-type playground with windows, one full-screen scene per room in its own palette. | `cd v3 && npm run dev` → http://127.0.0.1:5182 |
| `v2/` | Inside the mind: depth-mapped head, x-ray on hover, a walk through a neural space where rooms are neurons. | `cd v2 && npm run dev` → http://127.0.0.1:5181 |
| `v1/` | Everything starts as a line: chapters, 3D booth that assembles on scroll, archive wall. | `cd v1 && npm run dev` → http://127.0.0.1:5180 |

Shared: `v1/public/img/<behance id>/` holds the 419 frames of the 34 Behance projects; the other versions symlink to it.
Copy per version lives in each `content/` folder. Nothing in the copy is a fact unless it is in the CV or on Behance; the rest is the studio's voice, written to be replaced.
