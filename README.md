# Super Umzug / Super Entrümpelung / BayReno — Wix Studio + Velo Project

This repo is built for **Wix Studio's Git Integration (Wix CLI / `wix dev`)**. It is *not* a
standalone web app — Wix CLI syncs code into an existing Wix Studio site. That means the build
happens in two interleaved tracks:

- **Track A — code I can ship now**: everything under `src/backend/`, `src/public/`, and
  `src/pages/masterPage.js`. These have stable, predictable file names and work as soon as you
  connect this repo.
- **Track B — structure you build once in the Studio editor**: pages, sections, elements, the
  CMS collection, Multilingual, and the chatbot embed. Wix does not allow creating these from
  code or from the IDE — they must exist in the visual editor first. Once they exist, `wix dev`
  generates page code files with auto-assigned IDs (e.g. `Home.c1dmp.js`), and you paste the
  matching template from `/page-code-templates/` into each.

Follow the steps below **in order**. Steps marked 🖱️ happen in the Wix dashboard/editor (I can't
do these for you). Steps marked 💻 are already done in this repo.

---

## 1. 🖱️ Connect this repo to your Wix Studio site

1. In the Wix Studio editor, open **Dev Mode** (top toolbar → `</>` icon) and enable it if not
   already on.
2. Go to **Dev Mode → Settings → Git Integration** (or **Editor Settings → Git Integration**
   depending on your Studio version).
3. Click **Connect a Repository**, authorize GitHub, and either:
   - point it at a new empty GitHub repo, then push the contents of this folder to it, or
   - let Wix create the GitHub repo for you, then merge/copy this folder's contents in.
4. Once connected, install the Wix CLI locally if you want to work from your machine:
   ```
   npm install -g @wix/cli
   wix login
   wix dev
   ```
   `wix dev` opens a live local preview connected to your real site and starts syncing
   `src/pages/*`, `src/backend/*`, `src/public/*` both ways.

⚠️ Do **not** rename any file under `src/pages/` that Wix generates for a page — Wix uses the
exact filename to bind code to that page. If you rename it, your code is silently orphaned and a
fresh blank file is created.

---

## 2. 🖱️ Build the pages in the Studio editor (no-code)

Create these pages with these exact URL slugs (Page Settings → SEO/URL):

| Page name (internal) | URL slug        |
|---|---|
| Home                  | `/` (default)   |
| Umzug                  | `/umzug`        |
| Entrümpelung           | `/entruempelung`|
| Pakete                 | `/pakete`       |
| B2B                    | `/b2b`          |
| Kontakt                | `/kontakt`      |
| Impressum               | `/impressum`    |
| Datenschutz             | `/datenschutz`  |

For section layout, cards, headline/body text, images, and buttons: use standard Studio
sections/elements (Strips, Containers, Text, Image, Button, Repeaters where useful, the built-in
Accordion widget if you prefer it over the FAQ toggle code below). All page **copy** (DE + EN) is
in `/content/*.md` — copy-paste it directly into the Studio text elements. Do not let Velo code
generate this text; keeping it in native Studio elements is what keeps the site fully editable
in the no-code editor, per your requirement.

Design tokens (colors, fonts, spacing) to set in the Studio **Design panel / Theme**: see
`DESIGN-GUIDE.md`.

### Element IDs the code expects

The page-code templates only work if you set matching **Element IDs** in the Studio Properties
panel (right-click element → Settings → ID, or the ID field at the top of the Properties panel).
Setting an ID does not lock the element's content/design — it stays fully editable. Each
`/page-code-templates/*.page.js` file lists the exact IDs it needs at the top as a comment.

---

## 3. 🖱️ Create the CMS collection `CallbackRequests`

Dashboard → **CMS / Content Manager → Create Collection**. Name it exactly `CallbackRequests`
(this exact ID is hard-coded in `src/backend/callbackRequests.web.js`). Add these fields:

| Field key        | Type      | Notes |
|---|---|---|
| `name`            | Text      | required |
| `phone`           | Text      | required |
| `preferredTime`   | Text      | required |
| `topic`           | Text      | Umzug / Entruempelung / Paket 1-4 / B2B / Sonstiges |
| `partnerType`     | Text      | "Vermittler" / "Firmenkunde", B2B form only, optional |
| `message`         | Text      | optional, free text |
| `consent`         | Boolean   | GDPR checkbox value |
| `sourcePage`      | Text      | which page the form was submitted from |
| `language`        | Text      | `de` / `en` |
| `status`          | Text      | default `new`, so you can triage in a dashboard view |

**Permissions** (collection Settings → Permissions):
- Who can add content: **Anyone** (the form must work for anonymous visitors)
- Who can read/update/delete: **Admin only**

The backend module inserts with `suppressAuth: true`, so it will work server-side even if you
tighten "who can add content" later — but leave it as above unless you have a reason not to.

---

## 4. 🖱️ Set up the email notification (Wix Automations, no code)

Dashboard → **Automations → Create Automation**:
- Trigger: **"Content Manager" → "New content item"** → collection `CallbackRequests`
- Action: **Send an email** to `[TELEFON/EMAIL PLACEHOLDER]` (your team inbox), include the
  dynamic fields `name`, `phone`, `preferredTime`, `topic`, `partnerType`, `sourcePage`,
  `language` in the email body via the dynamic-field picker.

This is more robust than wiring a triggered email by hand in Velo, and needs zero code changes
later if you want to change the recipient or template — it's fully dashboard-editable.

---

## 5. 🖱️ Chatbot embed (third-party AI widget)

1. Get your embed `<script>` snippet from your chatbot provider (SiteGPT / Chatbase / similar).
2. Dashboard → **Settings → Custom Code** → **Add Custom Code**.
3. Paste the snippet, set:
   - **Add code to page**: All pages
   - **Place code in**: Body – end
   - **Load code**: On site load (or "on page load" if the provider recommends it)
4. Save and publish.

The site already has a clearly marked **chatbot CTA banner** section on every page (copy in
`/content/*.md`, one per page) prompting visitors to use the chat bubble. `src/public/chatbot.js`
exposes `openChatbot()`, which looks for the common global objects providers expose
(`window.$sitegpt`, `window.chatbase`, etc.) and opens the widget when a visitor clicks the CTA
button; if none is found (i.e. the snippet isn't pasted yet, or the provider doesn't expose an
open() API), it falls back to scrolling to the callback form — see step 7 below ("fallback rule").

---

## 6. 🖱️ Enable Wix Multilingual

Dashboard → **Settings → Multilingual** (or Editor → top toolbar → language icon):
1. Enable Multilingual.
2. Primary language: **German (Deutsch)**.
3. Add language: **English**.
4. Display mode: language menu in header (matches the header spec — DE/EN switcher).
5. Wix auto-generates `hreflang` tags and translated URL structure once this is on — no code
   needed. Translate each page's content into the second language using the Multilingual "Translate"
   view in the editor, or paste directly from the "EN" section of each `/content/*.md` file (all
   English copy is already written, so no machine translation is needed — just paste).

---

## 7. Fallback rule (chatbot can't answer → callback form)

Handled two ways, matching what your chatbot provider supports:
- **Provider-side**: most chatbot builders (SiteGPT, Chatbase) let you configure a fallback
  message with a link/button when confidence is low. Point it at `/kontakt#callback` or trigger
  the `CallbackLightbox` (see provider's "custom action" or "fallback message" settings — this is
  dashboard-side config in the chatbot provider's own dashboard, not Wix).
  Suggested fallback copy (DE): *"Das kann ich gerade nicht sicher beantworten. Lassen Sie sich
  gern zurückrufen — unser Team meldet sich kurzfristig."* (EN): *"I can't answer that with
  confidence. Request a callback and our team will get back to you shortly."*
- **Site-side**: the chatbot CTA banner and the persistent header "Rückruf anfordern" button are
  present on every page regardless of chatbot state, so the callback path is always one click
  away even if the widget fails to load.

---

## 8. Verification checklist

- [ ] All 8 pages created with correct slugs, content pasted from `/content/*.md`
- [ ] Element IDs set to match each `/page-code-templates/*.page.js`
- [ ] `CallbackRequests` collection created with fields/permissions above
- [ ] Automation email notification configured
- [ ] Chatbot snippet pasted in Custom Code, CTA banner present on every page
- [ ] Multilingual enabled, EN content pasted/translated, language switcher visible in header
- [ ] BayReno header/footer link opens `https://www.bayreno.de` in a new tab (Link settings →
      Web Address → check "Open in new tab")
- [ ] Submit the callback form as a test → confirm a row appears in `CallbackRequests` and the
      notification email arrives
- [ ] Structured data (JSON-LD) pasted into each page's SEO panel → Advanced SEO → Structured
      Data (see `/content/09-seo-and-schema.md`)
- [ ] Remaining `[PLACEHOLDER]` values filled in — see `TODO.md`

## Repo map

```
DESIGN-GUIDE.md              Colors/fonts/spacing to set in Studio's Design panel
TODO.md                      Every remaining [PLACEHOLDER] in one place
chatbot-knowledge-base.md    Paste into your chatbot provider's knowledge base / training data
content/                     All DE+EN page copy + SEO metadata + JSON-LD, ready to paste
src/pages/masterPage.js      Real, stable filename — site-wide code (header CTA, etc.)
src/backend/                 Velo backend (.web.js module + data hook)
src/public/                  Shared frontend helpers imported by page code
page-code-templates/         Per-page Velo code — paste into Wix's auto-generated page files
```
