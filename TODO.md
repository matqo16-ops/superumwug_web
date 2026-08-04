# TODO — before superumzug.de goes live

Two kinds of work remain: **(A)** fill in the `[PLACEHOLDER]` values in the content files, and
**(B)** set the environment variables in Vercel. Nothing in the code is blocking — the site
builds, deploys and renders today; the placeholders are business facts only you can supply.

You maintain the site by editing the files under `content/` and redeploying (push to GitHub →
Vercel auto-builds). No code changes needed for copy edits.

---

## A. Content placeholders to fill in

Search the repo for `[` to find them all, or edit the files listed below. Keep the **same value
everywhere** for shared facts (phone, email, address, company name) — the JSON-LD, Impressum,
Datenschutz and contact page all reference them and search engines cross-check.

### A1. Contact details (used across header, footer, contact page, legal pages, JSON-LD)

| Placeholder | Meaning | Files |
|---|---|---|
| `[TELEFON]` | Main phone number | `content/site.json`, `content/de/common.json`, `content/en/common.json`, `content/de+en/kontakt.json`, `content/de+en/impressum.json`, `content/de+en/datenschutz.json` |
| `[E-MAIL]` | Main contact email | `content/site.json`, `kontakt.json`, `impressum.json`, `datenschutz.json` (both locales) |
| `[ADRESSE]` | Full address (contact page) | `content/de+en/kontakt.json` |
| `[STRASSE UND HAUSNUMMER]` / `[STREET AND NUMBER]` | Street + number | `content/site.json`, `impressum.json` |
| `[PLZ]` / `[PLZ UND ORT]` / `[POSTAL CODE AND CITY]` | Postal code + city | `content/site.json`, `impressum.json` |
| `[ERREICHBARKEITSZEITEN]` / `[AVAILABILITY HOURS]` | Business hours | `content/de+en/kontakt.json` |

### A2. Legal entity — Impressum (`content/de/impressum.json`, `content/en/impressum.json`)

- `[FIRMENNAME, vollständige Rechtsform]` / `[COMPANY NAME, full legal form]` — e.g. "Super Umzug GmbH" (also in `site.json` as `[FIRMENNAME]` and in the JSON-LD)
- `[NAME DES GESCHÄFTSFÜHRERS…]` / `[NAME OF MANAGING DIRECTOR(S)]`
- `[REGISTERGERICHT]` / `[REGISTER COURT]`
- `[HRB-NUMMER]` / `[HRB NUMBER]`
- `[USt-IdNr.]` / `[VAT ID]`
- `[NAME UND SITZ DES VERSICHERERS, GELTUNGSRAUM]` / `[INSURER NAME AND LOCATION…]` — only if you cite a transport/liability insurer
- `[ODER: ANGABEN ZUR ZUSTÄNDIGEN SCHLICHTUNGSSTELLE]` — only if you participate in consumer arbitration (default text says you don't)

### A3. Privacy policy — Datenschutz (`content/de/datenschutz.json`, `content/en/datenschutz.json`)

- `[FIRMENNAME, RECHTSFORM, ANSCHRIFT]` / `[COMPANY NAME, LEGAL FORM, ADDRESS]` — must match Impressum
- `[LÖSCHFRIST …]` / `[RETENTION PERIOD …]` — how long callback-request emails are kept (suggestion: 12 months)
- `[LÖSCHFRIST CHAT …]` / `[CHAT RETENTION PERIOD …]` — how long chat transcripts are kept (suggestion: 6 months)
- `[DB-REGION …]` / `[DB REGION …]` — the region you pick for the Neon database (choose EU / Frankfurt for GDPR comfort)
- `[TOOLS BENENNEN …]` / `[NAME TOOLS IF ENABLED …]` — name any analytics you enable (e.g. Vercel Analytics), or delete that paragraph if you use none
- `[ZUSTÄNDIGE AUFSICHTSBEHÖRDE …]` / `[COMPETENT SUPERVISORY AUTHORITY …]` — likely the Bavarian DPA
- `[DATUM DER LETZTEN AKTUALISIERUNG]` / `[DATE OF LAST UPDATE]` — set on publish

> The Datenschutz text already names the actual sub-processors used by this build — **Resend**
> (email), **Anthropic** (chat), **Neon** (chat storage), **Vercel** (hosting). Keep those unless
> you swap a provider.

### A4. Damage-guarantee fine print (`content/de/umzug.json`, `content/en/umzug.json`)

- `[PLATZHALTER RECHTLICHER TEXT/VERSICHERUNGSBEDINGUNGEN]` / `[PLACEHOLDER LEGAL TEXT/INSURANCE TERMS]`
  — the exact terms, exclusions and claim deadline of the Unbeschädigt-Garantie. This is the
  flagship customer-facing promise — have it reviewed by whoever underwrites it before publishing.

### A5. Prices & B2B rates (`content/chatbot-knowledge-base.md`)

Every `[PRICE]`, `[PRICE/RATE]`, `[PRICE/DISCOUNT]` marker (sections 3, 4 and the table in
section 6): the 3 package prices, per-service move/clearance/renovation pricing, the B2B referral
commission and the corporate partner discount.

> **Exception — already priced:** the Besichtigungsservice is fixed at **290 €** and is shown
> publicly on the landing page. The chatbot is explicitly allowed to quote it. If you change that
> fee, update it in **three** places: `content/de/home.json`, `content/en/home.json` (the
> `inspection` block) and section 3a of `content/chatbot-knowledge-base.md`.

**Until you fill these in, the chatbot will not state any number** — the system prompt forbids
inventing prices, so it gives the qualitative answer and offers a callback instead. This is by
design; fill the table when you're ready for the bot to quote ranges.

> No prices appear anywhere in the visible website copy — pricing is only ever "ask the chatbot
> or request a callback", per the brief. The knowledge-base file is the single place prices live.

---

## B. Environment variables (set in Vercel → Project → Settings → Environment Variables)

See `DEPLOY.md` for exactly how to obtain each value. All are required for full functionality;
the site still builds and renders without them, degrading gracefully (see notes).

| Variable | Purpose | If unset |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chatbot (Claude API, `claude-haiku-4-5`) | Chat widget shows "assistant unavailable — request a callback"; everything else works |
| `RESEND_API_KEY` | Sends callback-form notification emails | Callback form returns an error state; user is told to call directly |
| `CALLBACK_TO_EMAIL` | Inbox that receives callback requests | Same as above |
| `CALLBACK_FROM_EMAIL` | *(optional)* Verified sender address | Falls back to Resend's `onboarding@resend.dev` sender |
| `DATABASE_URL` | Neon Postgres — stores chat transcripts | Chat still works; transcripts aren't logged; `/admin/chats` shows a setup notice |
| `ADMIN_USER` | HTTP Basic Auth username for `/admin` | `/admin` returns 503 "not configured" |
| `ADMIN_PASSWORD` | HTTP Basic Auth password for `/admin` | Same as above |
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap base URL | Defaults to `https://www.superumzug.de` |

After setting `DATABASE_URL`, run the one-time migration: `npm run migrate` (see `DEPLOY.md` §4).

---

## C. Assets you may want to replace (optional — the site ships with working stand-ins)

- **Photos** — real project photos are already live in the Projekte gallery. The remaining styled
  placeholder blocks are on the B2B teaser and a few section images; drop real images into
  `public/images/` and swap the `PlaceholderImage` components (shot list in
  `public/images/README.md`).
- **Projects gallery** (`content/de|en/projekte.json` + `public/projects/`) — to add a project,
  create `public/projects/<slug>/` with `1.jpg … n.jpg` (first = before, last = after, since the
  card preview shows exactly those two) and add an entry with `slug`, `name`, `brand`,
  `description` and `count` to both locale files. The crew folder lists its files explicitly
  because one of them is a `.png`.
- **Service-area map** — `public/images/muenchen-karte.svg` is a hand-built stylized map (no
  external map service, so no consent banner needed). Replace with a real static map if preferred.
- **OpenGraph image** — add `public/images/og-image.jpg` (1200×630) and reference it in
  `lib/seo.ts` if you want a custom social-share preview.
- **Logos** — the three brand logos are already in `public/logos/`. Replace the files in place to
  update them everywhere.

---

## D. Intentionally left to you (business/legal decisions, not missing work)

- Exact damage-guarantee exclusions and claim deadline — legal/insurance decision (A4)
- Retention periods and supervisory authority — compliance decision (A3)
- All prices and commission/discount rates — pricing strategy (A5)
