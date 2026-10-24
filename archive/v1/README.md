# Yasser Kobeissi — portfolio

Scroll-told portfolio for a creative direction studio in Riyadh. Vite, GSAP (ScrollTrigger, SplitText), Lenis, three.js.

```bash
npm install
npm run dev      # http://127.0.0.1:5180
npm run build    # dist/
```

- `content/studio.json` — all copy, chapter order, featured projects and their frame sequences
- `content/behance-raw.json` — the 34 Behance projects and their 419 frames (images in `public/img/<id>/`)
- `src/chapters/` — one file per chapter, in page order
- `src/lib/booth.js` — the 3D booth that assembles on scroll
- `src/lib/ink.js` — the marker line the visitor draws with the cursor
- `CONTENT-NEEDED.md` — what the studio still has to supply
