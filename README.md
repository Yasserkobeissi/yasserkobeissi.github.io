# Yasser Kobeissi — portfolio

The live site is `site/` (The Drawing Set, v12). Everything else is history or tooling.

| Folder | What it is |
|---|---|
| `site/` | The website. One HTML file, images in `img/`, map data in `data/`, 3D stands in `models/` with `manifest.json`, project galleries in `img/projects/` listed in `data/projects.json`. Deployed to GitHub Pages on every push to `main`. |
| `site/ASSETS-SPEC.md` | What to export for the site: GLB settings for the stands, photo sizes, scans, facts per project. Give this to Yasser. |
| `site/CONCEPT.md` | Design notes, round by round. |
| `handover/` | The original brief (`CLAUDE.md`) and the v10 site it was built on. Facts come from here. |
| `archive/` | Earlier concepts v1–v8, the v11 pass and the v14 "Night build" prototype. Kept for reference, not deployed. |
| `scripts/` | Tooling: publishing the models to a bucket if the site ever outgrows GitHub Pages. |

Run locally: `python3 -m http.server 8082 --directory site` and open http://localhost:8082.

Models: `site/models/*.glb` are Draco + WebP compressed exports of Tamim's Blender concepts (69 MB for 27). The uncompressed originals live in `site/models-src/`, which is not committed.
