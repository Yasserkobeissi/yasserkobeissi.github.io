# Yasser Kobeissi — portfolio site (handover)

Read this file first. Then open `site/index.html` in a browser (serve the folder over HTTP, not file://, so the images and `data/coast.json` load) and scroll the whole page once before changing anything.

## What this is

A single-file, story-driven portfolio for Yasser Kobeissi, Creative Director (events, exhibitions, motion, 3D) in Riyadh, born in Beirut. It is a life story first and a work showcase second. The owner (Tamim) wants it at Awwwards level: cinematic, interactive, personal, and not "AI-looking". Current state is a working v10 prototype; your job is to make it look and feel much better without losing what already works.

Live reference of the current build: ask Tamim for the artifact link if you need to compare.

## Stack (keep it)

- One `index.html`, no build step, no framework. Inline CSS and JS.
- Libraries from CDN, pinned: three.js r128 (UMD), GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.14. Google Fonts.
- If you move to a build (Vite is fine), keep the output deployable as static files. Do not introduce React unless Tamim asks.
- Hosting target: static (Vercel/Netlify). No server.

## Files

```
site/index.html        the whole site (CSS + HTML + JS), ~2,000 lines
site/img/*.jpg         23 Behance project covers (1600px max), 6 "disposable camera" snapshots of Yasser (snap-*.jpg),
                       carsketch.jpg + carbody.jpg (aligned pair), cartop.png (top-down drift car sprite, transparent)
site/data/coast.json   world coastlines (rings) + land dots, lon/lat, used by the globe
```

The portrait is embedded in the JS as a base64 JPEG (`const PORTRAIT = ...`), 420×420. A higher-resolution portrait would improve the particle hero and the Who chapter; ask Tamim.

## The person (content truth — do not invent beyond this)

- Yasser Kobeissi, Lebanese, grew up in Beirut, now Riyadh. Creative Director / Head of Creative at Sovyal Events (2024–). Before: Thakwa Events (Art Director/CEO, 2022–24), Lezof-Hi Deer (Creative Strategist, 2021–22), Maestro Group / Saudi Broadcasting Authority (Head of Creative, 2019–21, four TV channels), Lebanese TV (Head of Graphics, 2017–19), then ten years of 2D/3D motion design in Beirut production houses (2008–2017), Maliks Book Shop (graphic designer, 2006–08).
- B.Sc. Graphic Design, Lebanese American University 2010 (he says he was first in his class). Car design programme 2022 (designer out of the Volkswagen Audi Group); also worked in carbon-fibre manufacturing and jewelry design.
- Personality, in his words: "I'm a fun guy. I love drift and I do drift. I'm crazy about cars." Loud, warm, quick, sure. Speaks Lebanese Arabic, English, likes to drop into French. Asked what he wants next: "crazy goals, crazy challenges, big teams, big operations".
- Clients (CV + Behance): PepsiCo (3 editions of MDL Beast), SBA, McDonald's, Gold's Gym, Othaim Mall, DJI Enterprise, Monshaat, Misk, GOSI, SIMAH, Seder Group, Al Rajhi Takaful, Bank Al Jazira, Thiqah, Urpay, neoleap, Looptech, The Financial Academy, Quality of Life Program, SCE, JDA, MOMAH, LCGPA.
- Contact: yasserkobeissi98@gmail.com, +966 55 790 5388, behance.net/yaserkobeissi. LinkedIn URL unknown (placeholder points to linkedin.com).
- PRIVACY: a WhatsApp voice note existed earlier; it was removed on purpose. Do not add audio of him, and do not clone his voice.

## Chapter map (current order, top to bottom)

| # | id | bg | what it is | tech |
|---|----|----|------------|------|
| 00 | `#hero` | black | Loader (000→100, name decodes), red marker stroke, 25,600-point particle portrait; hover reveals the real photo through a soft circle; scroll scatters points | three.js Points, CPU sim |
| 01 | `#story` | black | "No second take" manifesto, words light with scroll, giant outlined "01" parallax | GSAP |
| 01b | `#journey` | black | Globe with real coastlines + land dots, Beirut→Riyadh great-circle flight, plane, km counter, 4 story beats | three.js |
| 02 | `#who` | paper | Marker-hatched portrait canvas with cursor light, bio, facts, tool chips, 3D tilt | canvas 2D |
| 02b | `#voice` | paper | "Hear him": his lines in his register (AR/EN/FR) + 3 pull quotes | CSS/GSAP |
| 02c | `#snaps` | paper | 6 draggable disposable-camera photos, French handwritten captions, flash/reshuffle | GSAP |
| 02d | `#says` | paper | Floating "what the office says" pills you push with the cursor | canvas-free physics |
| 03 | `#car` | paper | Cars: chassis image, cursor lens reveals the marker sketch (images are pixel-aligned) | CSS mask |
| 03b | `#drift` | dark | Top-down drift: sprite car, camera follow, tyre marks, smoke, kerbs, HUD, engine sound | canvas 2D |
| 04 | `#timeline` | paper | Horizontal 2006→2026 timeline with playhead, polaroid per year | GSAP pin |
| 05 | `#live` | black | Four TV monitors (static burst), 20+/4/3× counters | CSS |
| 06 | `#services` | paper | Six giant lines, scramble on hover, image plate follows cursor | GSAP |
| 06b | `#helix` | black | 23 projects on a 3D helix, scroll turns it, drag spins it, front card captioned | three.js |
| 06c | `#build` | paper→black | A generic stand assembles from parts as you scroll, then lights on | three.js |
| 07 | `#process` | paper | Sketch → Plan → Render → Built, frames wipe in | GSAP |
| 08 | `#lights` | black | Cursor spotlight on a photo, letterbox bars, room opens | CSS mask |
| 08b | `#reel` | black | Draggable 35 mm filmstrip of all work | JS |
| 09 | `#work` | paper | 3 features (RGB split on scroll, x-ray hover) + 16-row index with cursor preview | CSS/GSAP |
| — | `.obj` | paper | Trophies and boxes | CSS |
| 10 | `#contact` | paper | "What do I want next?", CTA, ON AIR switch, email/phone with copy | CSS |

Global chrome: hidden native cursor + custom cursor (dot, VIEW/DRAG/LIGHT/STEER/SKETCH discs, crosshair), nav with timecode, sound toggle (all audio is synthesised with Web Audio, no files), chapter counter bottom-left, dot rail on the right, scene slates on chapter change, diagonal "marker wipe" between colour changes, film grain overlay.

## Design tokens (in `:root`)

- Ink `#0B0A0A`, ink-2 `#161414`, paper `#EFE9DF`, paper-2 `#E3DCCF`, marker `#1E1B1A`, fog `#A09A90`, tally red `#FF2A1C`.
- Type: Anton (display), Instrument Serif italic (voice/captions), Instrument Sans (body), IBM Plex Mono (labels, 0.14–0.2em tracking), Caveat (handwritten captions), IBM Plex Sans Arabic for Arabic snippets.
- Motion: one easing `cubic-bezier(.22,.9,.24,1)`, 1.2–1.4 s reveals, 160–600 ms hovers, nothing bounces. `prefers-reduced-motion` is respected everywhere.
- Light sections use the `.lt` class, which swaps `--paper`/`--ink`/`--fog` inside the section. Tamim does not want "too much dark": keep roughly half the page on paper.

## Important implementation notes

- Every sticky chapter computes its own progress from `getBoundingClientRect()` via `secProg(el)` each tick. Do NOT switch these back to ScrollTrigger progress: the pinned timeline before them shifts ScrollTrigger's positions and the chapters misfire. The chapter counter, side rail and scene slates are geometry-based for the same reason.
- `.line` is used by the services rows. Do not add a global `.line` rule (a leftover one once made that section 20 screens tall).
- WebGL contexts in use: hero particles, globe, helix, build (4). Chrome drops contexts past ~16; do not add many more.
- Images for the helix are loaded by `THREE.TextureLoader` from `img/`; keep relative paths.
- The site must serve over HTTP (fetch of `data/coast.json`).
- Mobile (390 px) works but is a reduced experience; keep `scrollWidth === innerWidth` at all widths.

## What Tamim has asked for and what is still open

Done and approved in principle: particles hero with photo reveal, globe with map, project spiral, lighter palette, drift scene, chassis→sketch lens, French touches, disposable-camera photos.

Open / wanted:
1. Overall visual polish to "world-class": better typography rhythm, spacing, transitions between chapters, micro-interactions. He explicitly wants more interactive and reactive elements, and transitions that feel designed, not stacked.
2. Drift chapter: a planned moment where the camera pushes in and cuts to a clip of Yasser at the wheel, window down (needs real footage or an AI clip; placeholder slot not built yet).
3. Real content to swap in when it arrives: higher-res portrait, his real LinkedIn URL, his own car sketch (then regenerate the chassis from it so the lens pair is from the same drawing), a real 3D stand model for the build chapter (replace the generic boxes), a showreel for the Lights chapter.
4. Lottie: if a Jitter-made animated YK monogram arrives, use it in the loader and nav (lottie-web from cdnjs).
5. Performance pass: the hero particle sim is CPU-side (25,600 points); on a 2020 MacBook Air it should hold 60 fps, on mid-range Android ~30. Consider moving the sim to a GPU texture if you touch it.
6. Accessibility: focus states exist; verify keyboard reach of the filmstrip, spiral button and copy buttons; add `aria-live` to the chapter counter if you keep it.

## Rules

- Tamim's taste: premium, minimal, cinematic, generous whitespace, no decorative clutter, no stock "AI" looks (no purple gradients, no Inter, no emoji, no rounded-card grids). Dark for covers/dividers, light for content.
- Do not invent facts about Yasser. Placeholders must look like placeholders.
- No exclamation marks or superlatives in site copy. No em-dashes in Arabic text.
- Keep brand names in English inside Arabic text.
- Keep the chapter order: his life first, the work after.
- Check every change in a real browser at 1440 px and 390 px before reporting it done.

## Suggested first tasks

1. Serve `site/`, scroll end to end, write down the ten weakest moments.
2. Typography and spacing pass across all chapters (consistent type scale, baseline rhythm, max line lengths).
3. Chapter transitions: replace the diagonal wipe with something richer where it matters (e.g. the paper tearing to black before Drift, the globe dissolving into the Who portrait).
4. Mobile: design the phone layout properly instead of degrading the desktop one.
5. Then the open list above, in order.
