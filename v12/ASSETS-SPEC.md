# What to export for the site

One page for Yasser. Everything on it goes into the hall on sheet 08A or the sheets around it.

## 3D stands (the hall)

**Format: GLB** (glTF 2.0 binary), one file per stand.

From Cinema 4D: File → Export → glTF. Set:
- **Binary (.glb)**, textures **embedded**.
- **Y up** (the glTF default; leave the exporter's axis setting alone).
- Units metres, real size. A 10 × 12 m stand should measure 10 × 12 in the file.
- Delete the hall floor, hall walls, hall lights, people and cameras before exporting. Keep the stand, its furniture and its screens.
- Keep objects as separate objects (do not merge everything into one mesh). The site builds the stand piece by piece in the order floor, walls, roof and header, screens, counters, furniture, small things, and it needs the pieces.
- Textures: JPEG or PNG, 2048 px or smaller. The site shrinks them to 1024 and compresses the file, so bigger does nothing.
- Bake lighting into nothing: the site lights the stand itself. Plain materials with a colour or a texture are best. Emissive materials on the LED screens are good; they switch on at the end of the build.
- Size: under 40 MB before compression. The site compresses to roughly a fifth.
- Name the file after the project, lowercase, dashes: `looptech-2024.glb`, `misk-2025.glb`.

**Second choice: FBX** with embedded media. It goes through one extra step on our side.

**Not usable:** Lumion files, Cinema 4D project files, renders alone. Lumion cannot export a mesh the web can read.

## Photographs of the built work

- 3 to 10 per project, the built stand on the night, people in them is fine.
- **3000 px on the long side or larger**, JPEG, best quality. Phone originals are fine; nothing from WhatsApp or Instagram, they are recompressed.
- One wide shot from the aisle, one of the front, one of the LED or the hero element, a few details.

## Portrait and candids

- One portrait, **2000 px or larger**, plain background, looking at the lens.
- 3 to 5 candids on site: building, drawing, at the desk, on the night.

## Sketches

- Marker sketches and car sketches scanned at **300 dpi**, JPEG or PNG, one sketch per file, straight.

## Facts per project (fill once)

For each stand: client, city and hall, date, area in m², what was built (platform, walls, LED, double deck), and one line in Yasser's words. There is a dashed "to fill" slot for each on the site.

## How a file gets onto the site

Drop the GLB into `site/models/`, add a line to `site/models/manifest.json` (title, kind, file, size from the model, `front` angle), and the stand appears in the hall. The manifest format is the same for all 27 stands already in there; copy one line.
