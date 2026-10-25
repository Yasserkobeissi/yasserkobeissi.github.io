# Yasser Kobeissi — portfolio

The live site is `site/` (v15, one dark page with a ring of work). Everything else is history or tooling.

| Folder | What it is |
|---|---|
| `site/` | The website. One HTML file; project galleries in `img/projects/` listed in `data/projects.json`, his Vimeo pieces in `data/motion.json`, ring textures in `img/ring/`, portrait and certificate scans in `img/`. Deployed to GitHub Pages on every push to `main`, at https://yasserkobeissi.github.io (repository Yasserkobeissi/yasserkobeissi.github.io). |
| `site/CONCEPT.md` | Design notes for v15. |
| `handover/` | The original brief (`CLAUDE.md`) and the v10 site it was built on. Facts come from here. |
| `archive/v12-drawing-set/` | The Drawing Set, live until 25 Oct 2026: its page, the Al Rsayis stand model and the asset spec. Its images and data are the shared ones in `site/img` and `site/data`. |
| `archive/` | Earlier concepts v1–v8, the v11 pass and the v14 "Night build" prototype. Kept for reference, not deployed. |
| `scripts/` | Tooling: publishing models to a bucket if a 3D version ever returns. |

Run locally: `python3 -m http.server 8082 --directory site` and open http://localhost:8082.

Adding a project: drop the renders in `site/img/projects/<key>/01.jpg…`, a cover at `site/img/<key>.jpg`, a 900 px copy at `site/img/ring/<key>.jpg`, add the entry to `site/data/projects.json` (`cat` is `events`, `exhibitions` or `objects`, which shows as Gift items), and if the client is new, add it to the `CLIENTS` list in `site/index.html` so its name opens the work.
