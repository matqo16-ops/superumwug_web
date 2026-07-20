# Page-code templates — how to use these

Wix Studio only creates a page's code file once the page exists in the visual editor, and it
assigns the file a name you can't predict (e.g. `Home.c1dmp.js`). You **must not** rename that
generated file or create your own file with a made-up name — Wix ignores/orphans anything that
doesn't match its own naming.

Workflow for each page below:

1. Create the page in Studio with the layout/elements described in `/content/*.md` and set the
   **Element IDs** listed at the top of the matching template here.
2. Run `wix dev` (or open Dev Mode) so Wix generates `src/pages/<PageName>.<id>.js` for that page.
3. Open that generated file and paste in the **entire contents** of the matching template file
   below (everything after the ID comment block, or all of it — the ID list is just documentation
   for you, it's fine to leave it in a comment).
4. Repeat for every page. `CallbackLightbox` is a lightbox, not a page, but Wix generates a code
   file for it the same way, under `src/pages/` — same process applies.

| Studio page/lightbox | Template file |
|---|---|
| Home (`/`)              | `Home.page.js` |
| Umzug (`/umzug`)         | `Umzug.page.js` |
| Entrümpelung (`/entruempelung`) | `Entruempelung.page.js` |
| Pakete (`/pakete`)       | `Pakete.page.js` |
| B2B (`/b2b`)             | `B2B.page.js` |
| Kontakt (`/kontakt`)     | `Kontakt.page.js` |
| Lightbox `CallbackLightbox` | `CallbackLightbox.page.js` |

Impressum and Datenschutz need no page code — they're static legal text, no forms or
interactions.
