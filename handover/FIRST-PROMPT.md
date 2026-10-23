# Paste this into Claude Code from inside the `handover` folder

Read CLAUDE.md first. Then serve the `site` folder over HTTP (`python3 -m http.server 8080` inside `site/`) and open it in the browser. Scroll the whole page slowly, hover everything, drag the spiral and the filmstrip, try the drift with the mouse. Do this at 1440 px and at 390 px.

Then:

1. Write me a short audit: the ten weakest moments in the current site, ranked, with what you would change in each (one line each). Do not change code yet.
2. After I reply, do a typography, spacing and transition pass across every chapter. Keep the stack (single HTML, three.js r128, GSAP, Lenis), keep the chapter order, keep the palette and fonts unless you can show me a better pairing side by side first.
3. Keep every interaction that exists. If you rewrite one, it must do at least what it did before.
4. Do not touch the facts about Yasser, and do not add audio of him.
5. Check at 1440 px and 390 px in the browser before reporting. Report what you changed, what you could not, and what you assumed.

Stop after step 1 and wait for me.
