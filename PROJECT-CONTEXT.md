# mmoving.de — Project Context / Session Handoff

**Purpose of this file:** upload it at the start of a new session so the assistant
has the full picture without re-reading the whole repo. Last updated after the
service-area-map change (commit `868f715`).

---

## 1. What this is

Production website for **mmoving.de** — an umbrella brand in Munich covering
three services under one roof, one contact and one contract:

| Brand | Service | Page |
|---|---|---|
| **SuperUmzug** | Umzüge (moving), private + corporate | `/umzug` |
| **BayReno** | Renovierung / Sanierung (renovation) | `/renovierung` |
| **Entrümpelung München** | Entrümpelung + Haushaltsauflösung (clearance) | `/entruempelung` |

Brand order everywhere (header, footer, cards) is **SuperUmzug → BayReno →
Entrümpelung München**. `SuperUmzug` is written as one word everywhere, including
hero blocks; `Entrümpelung München` (renamed from `Super Entrümpelung` /
`SuperEntrümpelung`) is always the two-word form, matching its logo.

**Flagship promise:** the *Unbeschädigt-Garantie* — repair or full value
compensation if anything is damaged during a move, with belongings insured by
contract and by law for a customer-determined value.

**Service area:** Munich + ~50 km radius (Dachau, Freising, Erding, Ebersberg,
Starnberg, Fürstenfeldbruck, Germering, Unterschleißheim, Garching, Holzkirchen,
Landkreis München).

---

## 2. Repo & deployment

- **Local path:** `C:\Users\gromo\OneDrive\Počítač\superumzug web`
- **GitHub:** https://github.com/matqo16-ops/superumwug_web (note the typo
  "superum**w**ug" in the repo name — the *domain* is correctly `mmoving.de`)
- **Branch:** `main`. Working tree clean; everything pushed.
- **Hosting:** Vercel, auto-deploys on push to `main`.
- **Canonical URL:** `https://mmoving.de` (bare apex, matching the wordmark;
  `www` should redirect to it). Set `NEXT_PUBLIC_SITE_URL` in Vercel.
- **Domain is not yet pointed** — DNS steps are in `DEPLOY.md` §9.

### Commit history (newest first)

```
868f715 feat(kontakt): real service-area map, rendered without a click gate
35258df fix(seo): audit fixes and verification report
22b49fb feat(seo): deepen service pages, FAQ everywhere, schema and maps
b06dfa9 feat(seo): SEO URL structure, llms.txt, schema layer and German blog
68bbfdd feat(brand): mmoving.de domain, umbrella logo and favicon
1281bc3 feat(content,hero): brand characters on all three service pages
79f6cf3 feat(packages,layout): restructure offers, reposition brand character
8fb4019 fix(nav,mobile): slim menu to a home icon, show character on phones
1b9beef docs: sync knowledge base, privacy policy and docs with the new features
1e7f103 feat(chat): German voice interface via the browser-native Web Speech API
92a72a8 feat(home): projects gallery, crew folder and flat-fee inspection service
f122b1f feat(bayreno): internal BayReno subpage + brand reorder + hero/footer character
c9de432 assets: brand character, project galleries and crew photos
93bb39e docs: DEPLOY.md, TODO.md and project README
2986cef fix(i18n): German-canonical root + localize remaining UI labels
4837418 feat(chat): Claude-powered chatbot backend, Neon logging and admin UI
06ee2af feat(callback): callback form API with Resend notification
b56e38a feat(site): global layout, design system and all localized pages
c2f5c18 feat(content): structured DE/EN content files for all pages
f059b5f chore: scaffold Next.js 15 + TypeScript + Tailwind 4 project
fe3cb09 chore: archive previous Wix Studio prototype
```

---

## 3. Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · zod ·
Resend · Anthropic SDK · Neon serverless Postgres · marked · vitest.

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (must pass with zero warnings)
npm run start    # serve the build
npm test         # vitest — 29 tests
npm run migrate  # create the Neon chat table (needs DATABASE_URL)
```

---

## 4. Core principle — content lives in `/content`

**All copy is in `content/de/*.json` and `content/en/*.json`. Nothing is
hardcoded in components.** The owner maintains the site by editing those files
and redeploying. Preserve this: if new copy is needed, add it to the content
files and a type in `lib/content-types.ts`, never inline it in JSX.

```
content/
  site.json                     org data (name, phone, email, address, siteUrl)
  llms.txt                      served at /llms.txt
  chatbot-knowledge-base.md     the ONLY source the chatbot may answer from
  de/  common.json home.json umzug.json renovierung.json entruempelung.json
       komplettservice.json b2b.json kontakt.json impressum.json datenschutz.json
       projekte.json blog.json
       blog/<slug>.md           8 German articles (JSON front matter + markdown)
  en/  same minus blog/ and blog.json
```

---

## 5. Routes

German at `/…` (no prefix, canonical default — **no** auto-redirect by browser
language). English at `/en/…` with localized slugs.

| DE | EN |
|---|---|
| `/` | `/en` |
| `/umzug` | `/en/moving` |
| `/renovierung` | `/en/renovation` |
| `/entruempelung` | `/en/clearance` |
| `/komplettservice` | `/en/full-service` |
| `/b2b` | `/en/b2b` |
| `/kontakt` | `/en/contact` |
| `/impressum` | `/en/imprint` |
| `/datenschutz` | `/en/privacy` |
| `/blog`, `/blog/[slug]` | — German only, `/en/blog` 404s by design |

**301/308 redirects:** `/bayreno` → `/renovierung`, `/pakete` → `/komplettservice`.

Other endpoints: `/api/callback`, `/api/chat`, `/llms.txt`, `/sitemap.xml`,
`/robots.txt`, `/icon.png`, `/apple-icon.png`, `/admin/chats` (Basic Auth).

`i18n/routing.ts` exports `AppPathname` (all routes) and **`StaticPathname`**
(routes without dynamic segments) — bare `href` strings must use
`StaticPathname`, because `/blog/[slug]` needs a `params` object.

---

## 6. Design system

- Deep navy `#0E1F3C` + anthracite `#20242B`, cream `#FAF9F6`, single gold accent
  `#C9A24B` / `#A9832F`. Tokens in `app/globals.css`.
- **Fraunces** (display/headings) + **Inter** (body) via `next/font`.
- Reusable: `Section`, `SectionHeading`, `Hero`, `Faq`, `Breadcrumbs`,
  `ServiceSections` (lead/detail/pricing/situations/areas/crossLinks/entity),
  `ProjectsGallery`, `ChatWidget`, `CallbackForm`, `ServiceAreaMap`.
- Hero headline drops to `text-3xl` on the narrowest phones so long German
  compounds (*Haushaltsauflösung*) don't overflow.

### ⚠️ The hero section is LOCKED

The user has explicitly said the hero is already optimised — **do not modify
hero copy or layout** unless they ask. All changes go below the fold.

---

## 7. Features

### Header / nav
- Brand row: mmoving hexagon + wordmark → divider → three brand logos.
- Nav: 🏠 home icon · Projekte · Crew · Pakete→Komplettservice · B2B/Partner ·
  Kontakt. (Umzug/BayReno/Entrümpelung were removed from the nav because the
  brand logos directly above already link there.)
- On **mobile** the mmoving hexagon takes the home-link slot (the generic house
  icon was dropped there to save space); the house icon remains in the desktop
  nav bar.
- Persistent "Rückruf anfordern" button opens the callback modal.

### Brand characters
Cut-out PNGs with transparent backgrounds in `public/images/`:
`header-char.png` (BayReno shirt — home + `/renovierung` + footer),
`umzug-char.png` (`/umzug`), `entruempelung-char.png` (`/entruempelung`).
Desktop: top-aligned in the hero, fully above the fold down to a 660px-tall
viewport. Mobile: smaller, beside the two CTA buttons. Footer: inside the
service-area/phone/callback panel on mobile, beside the brand columns on desktop.

### Offer structure (`/komplettservice`)
1. **Privatumzug Komplett** — incl. optional partial/full renovation
2. **Firmenumzug Komplett**
3. **Rundum-Service für Vermieter und Hausverwaltungen** (merged; the old
   separate property-manager package was removed)
4. **Besichtigungsservice — 290 € flat fee**, presented as a *bonus service*
   independent of the packages (also on the landing page at `/#besichtigungsservice`)

### Callback form (the only form)
Client component → `POST /api/callback` → zod validation → Resend email. Honeypot
field + per-IP rate limit. Preferred-time options: **So schnell wie möglich**,
Vormittags, Nachmittags, Abends. No database — the email is the record.

### Chatbot
Floating widget on every page. `POST /api/chat` streams `claude-haiku-4-5`.
System prompt = role rules + the full `chatbot-knowledge-base.md`. Hard rules:
answer only from the knowledge base, **never invent prices**, fall back to the
callback form. History cap, per-IP rate limit, 512-token cap. Returns 503 and the
widget shows "assistant unavailable" if `ANTHROPIC_API_KEY` is missing.
**Voice**: browser-native Web Speech API (de-DE), zero cost, no ElevenLabs — mic
button with animated bars + permission notice.
**Logging**: every conversation upserts to Neon Postgres; `/admin/chats` (HTTP
Basic Auth, noindex, excluded from sitemap) lists transcripts with date/language
filters and a keyword "frequent topics" tally.

### Projects gallery + crew (landing page)
`public/projects/<slug>/1.jpg…n.jpg` — the card preview shows the **first and
last** image (before/after). Crew folder is highlighted at the bottom, cover =
`crew/7.jpg` (full team in front of the truck). Mobile uses a compact
two-column grid.

### Blog
8 German articles, 1,352–1,572 rendered words each, every one with a direct
answer in the opening paragraph, 8 FAQ entries, 2–3 internal links and a CTA.
Format: `content/de/blog/<slug>.md` = JSON front matter between `---` fences,
then markdown (rendered server-side with `marked`, styled by `.prose-mmoving`).
Front matter carries `metaTitle` (short `<title>`), `description`, `excerpt`,
`keywords`, `related`, `faq`, `cta`.

### SEO / AEO
- `lib/schema.ts` centralises **LocalBusiness/MovingCompany** (one `@id`
  `https://mmoving.de/#business`, geo, 50 km `GeoCircle`, opening hours, 12
  `areaServed` cities), **Service**, **FAQPage**, **BreadcrumbList**, **Article**.
- `Faq` emits its FAQPage JSON-LD from the same array it renders, so markup and
  structured data cannot drift.
- 8 FAQ entries on every page (6 on `/blog`).
- `/llms.txt` from `content/llms.txt`.
- Full audit results in **`SEO-REPORT.md`** (page map, target keywords, schema
  types, internal-link targets, measured per-page numbers).

### Service-area map (`/kontakt`)
`public/images/einsatzgebiet-muenchen.svg` — self-hosted SVG generated from real
WGS84 coordinates: Munich + 15 towns at true relative positions, Isar,
Starnberger See, Ammersee, a true-to-scale 50 km ring and a 20 km scale bar.
**Renders immediately** — no click-to-load gate, no third-party request, so no
cookie banner is needed. A plain outbound link opens the interactive Google map.
Verified numerically: every town 13.7–45.6 km from Munich, no label collisions.

---

## 8. Environment variables

| Variable | Purpose | If unset |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chatbot (`claude-haiku-4-5`) | Widget shows "unavailable"; rest works |
| `RESEND_API_KEY` | Callback emails | Form shows error state |
| `CALLBACK_TO_EMAIL` | Inbox receiving requests | Same |
| `CALLBACK_FROM_EMAIL` | *(optional)* verified sender | Falls back to `onboarding@resend.dev` |
| `DATABASE_URL` | Neon — chat transcripts | Chat works, no logging; `/admin/chats` shows a notice |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Basic Auth for `/admin` | `/admin` returns 503 |
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap base | Defaults to `https://mmoving.de` |

Setup instructions: `DEPLOY.md`. Placeholder inventory: `TODO.md`.

---

## 9. ⚠️ Pricing policy — read before touching any number

- The **only** price presented as mmoving.de's own is the **Besichtigungsservice
  at 290 €**. It appears in five places (`de/home.json`, `en/home.json`,
  `de/komplettservice.json`, `en/komplettservice.json`, and §3a of
  `chatbot-knowledge-base.md`).
- **Every other figure** on the site — the pricing tables on the service pages
  and all numbers in the blog articles — is labelled as a **marktüblicher
  Orientierungswert / typical Munich market rate**, explicitly *not* an offer,
  with a note that binding prices follow a survey. `llms.txt` tells citing
  systems the same.
- The chatbot's knowledge base still has unfilled `[PRICE]` placeholders, and the
  system prompt forbids inventing numbers — so the bot currently quotes nothing
  except the 290 €.
- **The owner has not yet supplied real prices.** If asked to "add prices", get
  the actual figures rather than promoting the market rates to company prices.

---

## 10. Open items

1. **Real prices** — replace the market-rate tables with the owner's figures
   (see §9), and fill the `[PRICE]` table in `chatbot-knowledge-base.md`.
2. **`[SEIT JAHR]`** — founding year, in the `entity` block on all four service
   pages. Deliberately left as a placeholder rather than invented.
3. **116 `[PLACEHOLDER]` markers** remain in `/content` — phone, email, address,
   legal entity, Impressum/Datenschutz fields, retention periods, DB region.
   Full list in `TODO.md`.
4. **Domain not yet pointed** at Vercel — `DEPLOY.md` §9 has the DNS records.
5. **Lighthouse not measured** — no headless Chrome in the dev environment. Build
   shape is right (static, ~117 kB first-load JS, AVIF/WebP, no third-party
   scripts). Confirm on the deployed URL.
6. **Photos** — `PlaceholderImage` blocks remain on the B2B teaser and a couple
   of section images; shot list in `public/images/README.md`.

---

## 11. Open questions the owner hasn't answered

- **One-word brand name site-wide for SuperUmzug?** `SuperUmzug` is already one
  word everywhere. `Entrümpelung München` is intentionally two words everywhere
  (brand rename to match its new logo) — no inconsistency left to resolve there.
- **Page titles / JSON-LD name** still say "Super Umzug" in places rather than
  "mmoving.de" — changing them shifts SEO signals, so it was left to the owner.
- **Interactive Google Maps?** The current map is self-hosted and accurate. A
  live embed is a small change but requires adding a cookie-consent banner.

---

## 12. Working preferences observed

- Commit per feature with descriptive messages; push to `main` (Vercel
  auto-deploys). Co-author trailer: `Claude Opus 4.8 <noreply@anthropic.com>`.
- Verify in the browser or by crawling the built site — don't claim something
  works without checking. An audit script caught four real defects last session.
- Flag legal/compliance implications (GDPR, price claims, Impressum) rather than
  silently working around them — but if the owner overrides, follow the
  instruction and say so plainly.
- The owner is not a developer: explain in plain language, give exact click
  paths for external tools (GitHub, Vercel), and never assume CLI familiarity.
- Windows environment; Git Bash available. Heredocs work for commit messages;
  avoid apostrophes in inline `node -e` scripts (shell quoting breaks) — write a
  temporary `.mjs` file instead.
