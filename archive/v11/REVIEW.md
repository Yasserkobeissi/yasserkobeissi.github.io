# v11 review and brief

Reviewed the v10 site (after the step‑2 pass) the way an Awwwards jury scores: design, usability, creativity, content. Reference points: the Awwwards "scroll transition" and portfolio collections, Ripplix's library of real micro‑interactions, Swishy's kinetic‑type templates. Same stack, same chapter order, same facts.

## What already works (keep, do not touch)
1. The idea: a life story first, work second, told as a live broadcast rundown. Few portfolios have a spine like this.
2. The particle portrait with the photo reveal under the cursor. It is the one moment people will screenshot.
3. Marker language: red stroke, paper, hatching, polaroids, French captions. A real voice, not a template.
4. The drift scene and the chassis lens. Personal, odd, memorable.
5. The horizontal timeline with the red playhead and the timecode nav. The "scroll is time" metaphor holds the whole page together.
6. The helix of projects and the filmstrip. Two ways to browse the same work without a grid of cards.
7. Scene slates and the chapter counter. The site knows where you are.
8. Sound as synthesis, no files. Cheap, consistent, honest.

## What a jury would mark down
1. **Transitions are stacked, not designed.** One diagonal wedge is reused twelve times. Awwwards‑level sites change the transition with the meaning: a tear before the drift, an iris between the globe and the face, a CRT switch‑off before the TV chapter, letterbox bars closing on the reel.
2. **No act structure.** Nineteen chapters in a row with no breath. Three act slates (Beirut, Riyadh, The room) give the scroll a rhythm and the story a shape.
3. **Headings appear, they do not arrive.** Every h2 fades in as a block. Word‑by‑word mask reveals, image clip reveals and a slow parallax inside the feature images are the difference between a page and a film.
4. **The loader is a counter.** A monogram drawn as two marker strokes, continuing into the hero's red stroke, ties the identity to the gesture. A Jitter Lottie slot is wired for when the real monogram arrives.
5. **Cursor is a dot.** A lagging ring behind the dot gives weight to every move; it disappears under the labelled states.
6. **Nothing tells you how far you are.** A 2 px tally‑red progress line under the nav.
7. **The client tape is one line.** Two rows, opposite directions, one solid and one outlined, read as kinetic type rather than a ticker.
8. **Hover states are flat on the work grid.** Clip reveals on scroll, and the images drift inside their frames.
9. **The transitions are silent.** One synthesised whoosh (noise through a sweeping band‑pass) on act slates and chapter crossings, only when sound is on.
10. **Build chapter is still generic boxes and the Lights photo is a stand‑in.** Content, not design; both stay on the open list in CLAUDE.md.

## Misplaced elements (v10, now fixed in step 2 or here)
- Hero kicker in the corner (moved above the name). Lede fighting REC (moved to the baseline).
- Stage captions under the chapter counter (one baseline band everywhere).
- Timeline polaroid over the copy, title over numerals, and the active year inheriting the Live chapter's black (class clash, fixed).
- Helix title over the cards (one bottom bar). Reel squeezed to a band (full viewport).

## How the named resources were used
- **Ripplix**: reference for the lagging cursor ring, the clip‑path image reveals, the masked word reveals and the "opening" patterns behind the act slates.
- **Swishy**: kinetic‑type direction for the two‑row client tape and the act titles that rise letter by letter.
- **Jitter**: exports Lottie. The loader has a Lottie slot (`YK_MONOGRAM_LOTTIE`): set it to the exported JSON path and lottie‑web loads from cdnjs; until then an SVG monogram is drawn by GSAP.
- **Resourceboy / Design Resources**: asset directories. Nothing was downloaded; paper grain and torn edges are generated in SVG so there is nothing to license.
- **Color Hunt**: cross‑checked the palette. Paper `#EFE9DF`, ink `#0B0A0A`, one red `#FF2A1C` is already the cream / near‑black / single‑accent family that scores well; no change.
- **Awwwards scroll‑transition collection**: mask wipes, close transitions and footer transitions are the vocabulary behind the chapter‑specific wipes here.

## v11 build list (this round)
Loader monogram with Lottie slot · three act slates · chapter‑specific transitions (marker bands, paper tear, iris, CRT off, letterbox close) · word and image reveals · feature parallax · cursor ring · progress line · two‑row kinetic tape · transition whoosh.

Everything is in `v11/` so v10 stays as it was; we pick what moves across.
