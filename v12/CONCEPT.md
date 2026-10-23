# v12 — The Drawing Set

A new concept, not a re-skin. The whole site is a set of technical drawings that Yasser issues himself: fourteen sheets, each with a frame, a sheet number, a kicker and a title block, stacked like drawings pulled from a flat file. Cyanotype blue with light lines for covers and scenes, whiteprint paper with blue lines for content, one safety-orange redline. It ties to the one habit every version has tried to show: he draws the first line by hand.

Built from scratch in `v12/index.html` (same stack: one file, three.js, GSAP + ScrollTrigger, Lenis, Google Fonts). v10 and v11 are untouched.

## Voice
First person throughout. It is his set. "I drift." "I draw the first line by hand." The quoted lines from his voice notes stay verbatim. "Loud in the room" is gone; the elevation sheet is now **Drawn first, built as drawn**, with the subline "first in the room, last to ask", and the portrait paragraph reads "Warm, quick and sure: I say what I think and I draw it before the meeting ends." The crew notes drop "the loud one" and "Beirut volume" for "draws before the meeting ends" and "says yes, then draws it". No facts added beyond the CV, Behance and the voice notes.

## Type and colour
- Archivo (variable, wide and black for titles, narrow for labels), JetBrains Mono for annotations, Fraunces italic for the first-person asides, IBM Plex Sans Arabic for the Arabic lines.
- Cyanotype `#0B2A55`, ink `#EAF1FF`, whiteprint `#F3F0E8`, blueprint blue `#173F86`, redline `#FF5A1F`. Roughly half the sheets are paper, as Tamim prefers.

## The sheets
| No. | Sheet | What it does |
|---|---|---|
| 00 | Cover | Name, role, method. Portrait plotted as 14,400 dots; the photo shows under the cursor; the dots scatter as you pull the next sheet. |
| 01 | General notes | Five numbered notes draw in with the scroll. The marker sketch as Detail 1. |
| 02 | Site plan | A real chart drawn from `coast.json`: graticule, coastlines, land dots. The route Beirut → Riyadh draws as a redline arc with a plane; the kilometres count; four beats in his words. |
| 03 | Elevation | The portrait as a measured drawing: dimension lines, leader tags, a lens that restores colour. His specification lines appear one by one. |
| 04 | Photo log | Six pinned disposable-camera frames you drag; flash reshuffles; margin notes from the crew. |
| 05 | Vehicle | A skid-pad plan: track edges, station marks, kerbs; the car follows the line, slips, leaves dashed tyre marks; HUD with speed and slip; the chassis/sketch lens as Detail 2. |
| 06 | Schedule | Every job as a Gantt bar, Riyadh in red, the NOW line at 2026, the four-channel TV years as a callout. |
| 07 | Scope of work | Six scope items with a callout plate under the cursor. |
| 08 | Drawing index | 23 project sheets as a 3D stack you pull through; drag tilts it; click opens Behance. |
| 09 | Register | Sixteen rows that roll like end credits with a preview under the cursor. |
| 10 | Assembly | A wireframe stand assembles in blue line, part by part; at the end the walls fill and the lights turn red; the Sketch / Plan / Render / Built sequence is stamped as you pass. |
| 11 | Lighting plot | Twelve moving heads and four washes draw as a plot; the spotlight opens the real photo; letterbox; the photo log reel slides in. |
| 12 | Details | Trophy, invitation box, gift box at 1:1 with dimension lines. |
| 13 | Issue | "What do I want next?" fills in red, the "Issued for construction" stamp slams, contact and revision log. |

## Round 2 (24 Oct)
- **Sheet depth.** The sheet underneath sinks and darkens as the next one slides over it, like a card stack in a flat file.
- **Cyanotype develop.** Blue sheets arrive pale and develop to deep blue as they land, the way a cyanotype darkens in light.
- **Drawing list (sheet 00A).** Every sheet listed with its scale and a status stamp (Issued, Checked, As built, IFC); each row pulls that sheet.
- **Drafting ruler.** A tick per sheet on the right edge with a red marker for where you are; hover names the sheet, click pulls it.
- **Plotter head.** A red pen on the top frame line of every sheet tracks how far through that sheet you are.
- **Lighting plot.** Twelve fixtures draw in and their beams follow the cursor once drawn (the plot had been hidden by a class-name clash with the progress line; fixed).
- **Client tape.** Two-speed client list running under the scope of work.
- **Cover.** Portrait dissolves into the sheet with no edges, labels or ring; the photo shows through a soft oval under the cursor. Car on the skid pad a third bigger.

## Round 3: nothing sits still (24 Oct)
Every sheet has a life of its own while you read, and scrolling adds to it rather than restarting it.
- **Vehicle.** The skid pad is now a closed course. The car laps on its own (one lap every sixteen seconds); scrolling is throttle on top; the HUD, tyre marks and smoke run continuously.
- **Cover.** The plotted dots breathe and drift. **Site plan.** The route's dash runs and a glow travels the arc. **Elevation.** The light sweeps the portrait when nobody is pointing.
- **Photo log.** The pinned frames sway. **Schedule.** A light sweeps the chart. **Drawing index.** The stack rocks. **Register.** The credits keep rolling, and scrolling back winds them back.
- **Assembly.** The camera keeps orbiting. **Lighting plot.** The beams sweep the stage when the cursor rests. **Details.** Slow pans on the three objects. **Issue.** The arrow nudges.
- The plotter head on every frame twitches like a real pen. All of it respects reduced-motion.

## Round 4 (24 Oct): the car and the continuity
- **Drift physics.** Slip now rotates the nose into the corner (it was pointing out of it). Scrolling in either direction is throttle, so the car never runs backwards; idle lap time nine seconds; the HUD reads up to 190.
- **Scenes complete before the next sheet.** Every scrolling scene (site plan, vehicle, drawing index, register, assembly, lighting) reaches its end at 86% of its scroll; the last 14% is a hold, so the drawing index shows sheet 23 of 23 before the register covers it. The index got a longer scroll (4.2 screens).
- **Phone breakpoint lowered to 720 px**, so a narrow desktop window keeps the full layout, including the chassis-sketch blueprint on the vehicle sheet.

## Round 5 (24 Oct): breathing room
- **Chassis image removed** from the vehicle sheet; the caption is shorter and sits on a soft backdrop so the lapping car never runs through the words.
- **Compact widths (under 1100 px)** keep one voice per corner: hints, the km counter, elevation leader tags, photo-log margin notes, the TV callout, assembly thumbnails and parts list, and the bottom-left HUD all step aside; the schedule tightens to fit eleven rows.
- **Assembly flashes fixed**: every sheet now keeps a constant compositing layer, so the WebGL canvas is no longer re-layered when the next sheet starts to cover it.

## System
- Sheets are sticky; a spacer after each one drives its scene, so every scene has its own scroll length and the next sheet slides over the last. On phones the stack is off and sheets flow.
- Crosshair cursor with live coordinates, labels on anything you can open or drag. Plotter progress line under the nav, sheet tabs, Riyadh clock.
- Sound synthesised: plotter ticks, a paper slide on every sheet change, the engine on the skid pad, tones when the lights come on.
- Loader: the plotter draws the sheet frame and title block, the name plots in, "Plotting the set 000%".

## Not done / to confirm
- Verified at 1440×900 and 390×844 in the in‑app browser; no console errors; no horizontal scroll. A pass in real Chrome before publishing.
- Build sheet still uses the generic stand; Lights sheet uses the Saudi National Day photo; LinkedIn link still a placeholder.
- The Arabic lines sit inside English sentences as in v10; if Tamim wants a full Arabic sheet, that is a separate piece of work.

## Two alternates I considered and did not build
- **Backstage, cue by cue**: the site as a lighting desk; every section is a cue you GO; stage lights state the mood. Strong, but closest to the broadcast rundown already built.
- **The hall**: one exhibition-hall floor plan as the whole navigation; the camera flies from stand to stand. Spectacular but heavy to build and hard on phones.
