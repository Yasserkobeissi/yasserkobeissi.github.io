# Step 2: typography, spacing and transition pass

Applied to `site/index.html` on 23 October 2026. The original v10 file is unchanged in the zip; `STEP2.diff` is the full diff. Checked in the browser at 1440×900 and 390×844 after every round; no console errors; no horizontal scroll at either width.

## Changed

**Document**
- Added the missing skeleton: doctype, `<html lang="en">`, `<head>`, UTF‑8 charset, device‑width viewport, a description meta, `<body>`. The page now runs in standards mode, every `·`, `→`, quote and Arabic line renders, and phones get the phone layout.
- Added IBM Plex Sans Arabic to the Google Fonts request (the CSS already asked for it). Arabic spans carry `lang="ar"`, the French closing line `lang="fr"`.

**Tokens (in `:root`)**
- Gutters: 16 px → `clamp(16px, 2.6vw, 40px)` (37 px at 1440, 16 px on phones).
- Type scale: `--t-body` 17–20 px (19 px at 1440), `--t-lede` 20–30 px serif italic, `--t-label` 0.72 rem mono. Body copy in Who, Voice, Live, Cars, Objects uses `--t-body` at a `--measure` of 58ch; Process steps and the Build caption use the lede size.
- Rhythm: `--sec-pad` for every static chapter, `--top` for every kicker, `--stage-bot` for every stage caption, so the bottom 72–120 px of each sticky stage is a chrome band (chapter counter, hints) and content sits above it. Phones get smaller values.

**Hero**: kicker moved into the title block directly above the name; lede moved to the bottom right on the name's baseline (top right under REC below 1100 px); scroll hint no longer wraps; on phones the kicker shrinks instead of overprinting the nav.

**Timeline**: the active year used class `live`, which is also the Live chapter's section class, so the active column inherited a black background and 90 px of padding. Renamed to `on`. Pin shortened from 1.1× to 1.0× the rail and column width from 34vw to 27vw (6,466 px → 5,177 px at 1440). Header is one line in a band; copy sits in the upper part of the stage so the polaroid (smaller) never covers it.

**Work**: section is now positioned, so its wipe anchors to it instead of drawing a paper wedge over the hero.

**Contact**: two‑column grid, question left, answer and CTA right, contact row and footer full width. Phones stack.

**Helix**: title and Behance button share one bottom bar; title 80 px max instead of 110; camera lowered so the ring sits higher; phones get a nearer camera and a stacked bar.

**Build**: parts start just above their final place with small rotations and fade in, instead of flying across the screen as giant planes; lit palette is paper, ink and tally red plus a warm stage white (the teal is gone); parts list moved in from the dot rail.

**Reel**: a full viewport, strip centred, kicker and hint visible (the strip's max‑content width had been inflating the grid column).

**Cars**: a full viewport with the content centred.

**Services plate and Work preview**: sit to the right of the cursor and clamp to the viewport instead of covering the hovered line.

**Voice**: quote mark 2.4 rem; quotes get 44 px gaps on phones so the mark no longer overprints the previous label.

**Snaps / Office says**: captions on the stage band; on phones the pile starts below the kicker, the shutter button moves to the bottom right, the pills keep clear of the nav, the drag/push hints hide.

**Drift**: hint reads "drag a finger = steering" on touch devices; the caption says "steer with the mouse or a finger".

**Phones**: feature and object captions stack; features stack in one column; Process steps clear the kicker.

**Wipes**: 24vh deep with a 3 px marker edge.

## Not changed
- Chapter order, palette, fonts, libraries, every interaction (particles, globe, portrait light, pile, pills, lens, drift, pinned timeline, monitors, scramble, spiral, build, process, spotlight, filmstrip, x‑ray, RGB split, on‑air switch, copy buttons).
- Facts about Yasser; no audio.
- The generic build stand, the hero CPU particle sim, the Lights photo and the placeholder LinkedIn link (all on the open list in CLAUDE.md).
- The diagonal wipe is kept and tuned; a richer paper‑tear before Drift (suggested task 3) is a separate piece of work.
- Dead code left in place (the old `#gl` sketch→built block, `.player-unused`, `.yk-unused`).

## Assumed
- 19 px body at 1440 with a 58ch measure is the right reading size for this audience.
- Removing teal from the lit stand follows the palette rule in CLAUDE.md; say so if the teal was wanted.
- The timeline reads better at one screen per 1.0× rail; it can go back to 1.1× by one number.
- The in‑app browser renders 1440 px at about a third scale, so composition and overlaps were verified there and type sizes from the CSS; a pass in a real Chrome at 1440 is worth doing before publishing.
