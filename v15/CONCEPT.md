# v15 — The Ring

Started from scratch on 25 Oct 2026. Nothing carried over from the drawing set, the hall, the drift or the earlier sheets.

## What Tamim pointed at

- oumahi.art: a dark room, one 3D ring of pieces you drag to rotate, category pills on the left, click a piece and a file opens with the image, a few lines and a filmstrip.
- ingrassiadaniel.it: almost no text, small type, a lot of dark space, one living object on screen.
- pacomepertant.com: black, a spiral of work cards you scroll along, a "spiral / list" toggle, a menu button, a project page with the piece and one paragraph.

What they share: one screen, one object, a handful of words. The work is the interface.

## The idea

One black room. His projects hang on a ring in the middle of it, tilted like a record on a turntable. You drag it round, or scroll. The card at the front is the one you are looking at, its title sits large behind the ring. Click it and the project opens on top: the cover big, the rest of the gallery in a strip, three lines of facts (dashed "to fill" where we do not know yet), previous and next.

Five pills on the left filter the ring: all, events, exhibitions, objects, motion. Motion puts his ten Vimeo pieces on the ring; opening one plays it.

"ring / list" at the top switches to a plain list of titles, large, centred, the cover floating behind the one under the pointer.

Menu: about, contact. About is one portrait and six sentences in his voice, his tools, his seven certificates as a row of small scans. Contact is an email, a WhatsApp line, Behance, LinkedIn (to fill).

## Rules kept

First person, warm, no superlatives, facts only from the handover. Placeholders look like placeholders. Native pointer stays visible. One WebGL context. Works at 1440, the pane width, and a phone (touch drag on the ring, list view one tap away).

## Files

- `v15/index.html` — the whole thing
- `v15/img/ring/` — 900 px covers for the ring textures
- `v15/img/motion/` — Vimeo thumbnails, 900 px
- reads `../site/data/projects.json`, `../site/data/motion.json`, galleries from `../site/img/projects/`, portrait and certificates from `../site/img/` (served from the repo root, launch config `v15`, port 8083)
