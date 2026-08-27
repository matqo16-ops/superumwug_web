# HANDOFF MASTER — mmoving.de · 25 August 2026

**This is the single source of truth. Upload it at the start of a new session.**

It merges the original `PROJECT-CONTEXT.md` (architecture) with the SEO/GEO,
chatbot and email work done on 24–25 August. Both earlier documents are now
pointers to this file. `SEO-ROADMAP.md` still holds the detailed SEO backlog and
is worth reading alongside this.

Last commit at handoff: `b92205a`. Tree clean, everything pushed to `main`.

---

# PART A — WHAT NEEDS DOING

## A1. BROKEN RIGHT NOW: the callback form does not deliver email

**Every enquiry submitted through the site is currently lost.** Highest priority.

Diagnosis by probing `POST https://mmoving.de/api/callback`:

| Stage | Response | Meaning |
|---|---|---|
| Before env vars | `503 email_not_configured` | variables missing |
| After owner added Resend key + redeployed | **`502 email_rejected`** ← current | config fine, **Resend refuses the send** |

**Near-certain cause:** Resend's free tier, using the default
`onboarding@resend.dev` sender with no verified domain, only permits sending to
the address the Resend account was registered with. `CALLBACK_TO_EMAIL` is
`kontakt@bayreno.de`, presumably not that address.

**Confirm:** Vercel → Logs → filter *Error* → submit the form once. Expect
*"You can only send testing emails to your own email address"*.

**Proper fix:** Resend → Domains → Add Domain → `mmoving.de` (pick the EU/Ireland
region for GDPR). Resend emits TXT/MX records → add them in Vercel → Domains →
mmoving.de → DNS Records (Vercel runs the DNS) → Verify. Then set
`CALLBACK_FROM_EMAIL = mmoving.de <website@mmoving.de>` and redeploy.

**Quick test alternative:** point `CALLBACK_TO_EMAIL` at the Resend signup
address, redeploy, confirm delivery, then do the proper fix.

**Verify after fixing:**

```bash
curl -s -o /tmp/cb.json -w "HTTP %{http_code} " -X POST https://mmoving.de/api/callback \
  -H "content-type: application/json" \
  -d '{"name":"Diagnose Test","phone":"+49 176 228 661 46","preferredTime":"sofort","topic":"umzug","consent":true,"locale":"de","sourcePage":"/diagnose"}' ; cat /tmp/cb.json
```

`{"ok":true}` = fixed. Endpoint rate-limits at 5 req / 10 min / IP → `429`.

## A2. Blocked on the owner

1. **Fix the callback email** — A1 above.
2. **Reviews — the constraint that gates everything.** 3 today; Völler has 143 at
   5.0, Umzug Ruck Zuck ~940 aggregated. Send the Google review link to every
   customer from the last 6 months; 8–10/month, never in bursts. No page wave
   should be expected to convert before ~20 reviews exist.
3. **Google Business Profile:** add categories *Entrümpelungsdienst* and
   *Renovierungsdienst* (currently invisible for two of three services); add
   photos; **verify the submitted name/address/website changes actually
   applied** — Google silently rejects renames often.
4. **Bing Webmaster Tools** — import from Search Console (3 min). Feeds ChatGPT
   Search.
5. **Decide the from-prices** — biggest available differentiator. Must come from
   the owner; see C4.
6. **`/referenzen` case studies** — need real jobs with district, duration, final
   price and customer consent. `StadtteilContent.reference` already renders one
   per district page when supplied.
7. **Rotate the DeepSeek key** (see B6).
8. **AGB + Widerrufsbelehrung** — see A4.

## A3. Buildable with no owner input

From `SEO-ROADMAP.md`, in order:

1. **`/preise` silo** — hub + 3 cost pages. **Mandatory same-commit housekeeping:**
   301 `/blog/umzugskosten-muenchen` and `/blog/entruempelung-kosten-muenchen`
   into them, remove from `lib/blog.ts`, trim service-page tables to a 3-row
   teaser. Three pages targeting "umzug münchen kosten" is worse than one.
2. **4 calculators** — Umzugskosten, Entrümpelung, Renovierung, Kartonrechner.
   Two binding constraints: the full matrix must be a real SSR'd `<table>` (a
   JS-only calculator is invisible to crawlers and unquotable by assistants), and
   zero form fields before the result appears.
3. **12 sub-service pages** under the three hubs.
4. **8 western-corridor city pages**, Germering as flagship — only *after* the 10
   district pages are indexed.
5. **Markdown mirrors** (`slug + .md`) and `/llms-full.txt`.
6. **5 `/vergleich/` decision pages** — honest "should you DIY" tables.
7. Translate customer-facing chatbot KB sections into German (see B6).

## A4. Biggest non-SEO exposure: no AGB, no Widerrufsbelehrung

- **AGB** = Allgemeine Geschäftsbedingungen — the terms applying to every job:
  contract formation, payment, cancellation fees, customer-not-ready, liability,
  jurisdiction. None exist. Everything currently falls back to default German law,
  which favours the consumer.
- **Widerrufsbelehrung** = the statutory 14-day cancellation notice. Under
  **§ 355 BGB** a consumer may cancel any contract concluded at their home (the
  on-site survey) or at a distance (phone, email, callback form) within 14 days —
  which is essentially every job.
  - **If not properly informed, the period becomes 12 months and 14 days.**
  - **The trap for movers:** work is normally done *inside* the 14-day window.
    That is only safe if the customer explicitly requests early start **in
    writing** and acknowledges losing the withdrawal right on completion. Without
    it, they can cancel after the move and **owe nothing**. The owner's own
    questionnaire says exactly this at Q46 — marked ZISTIŤ, never set up.
- Needed: AGB · Widerrufsbelehrung · Muster-Widerrufsformular · signed
  early-start request. Templates for the middle two are in **Anlage 1 and 2 to
  Art. 246a EGBGB**; deviating from them is where people get caught.
- **A German lawyer must review before publishing.** Unfair AGB clauses are void
  under § 307 BGB, which can leave you worse off than having none.

## A5. Explicitly rejected — do not redo

- Core Web Vitals work beyond a 30-minute pass. Static Next 15 on Vercel;
  Brandlmeier ranks top-3 with a sitemap that 404s.
- 60 templated geo pages. Ten real ones first, measure indexation, then extend.
- New blog posts before page 1 is held.
- `aggregateRating` before the profile really shows ≥20 reviews. Note:
  self-serving review markup has been ineligible for Google rich results since
  2019 — it is an LLM-extraction play, not a stars play.
- PL/UA/HR landing pages before a native-speaking phone answer is guaranteed.
- Google Analytics — would force a consent banner the site currently avoids.
- DeepSeek for the chatbot — see B6.

---

# PART B — BUSINESS FACTS AND DECISIONS

Source: the owner's completed questionnaire
`mmoving-dotaznik-majitel_VYPLNENY_2026-08-14.docx` (in `~/Downloads`).
Confirmed unless stated otherwise.

## B1. The entity

- **Einzelunternehmen Martin Marcinko.** One company, three brands — not three
  companies. This is the single most important fact for entity resolution.
- **Legal address (Impressum, ladungsfähige Anschrift):** Planegger Str. 40,
  82110 Germering.
- **Visitable location (matches Google profile):** **Ausburgerstraße 4**, 82110
  Germering, entrance via Hirtenstraße. ✅ Spelling confirmed by the owner on
  25 Aug — it is *Ausburgerstraße*, not *Augsburger Straße*. Previously flagged
  as uncertain; resolved, no action needed.
- **Founded 2004**, over **1,000 moves** completed.
- **Languages:** DE, EN, SK, CS, PL, UK, HR.
- **Phone:** +49 176 228 661 46 · **Email:** kontakt@bayreno.de (owner confirmed
  `.de`, not `.com`).
- **USt-IdNr:** DE 219 349 391. **Steuernummer 106/5724/7147 — never publish.**
- **Insurer:** LVN (Betriebs-/Berufshaftpflicht).
- **Hours:** Mo–Fr 8–18, Sa 9–14.
- **Google Business Profile:** `https://maps.google.com/?cid=4349102244822623293`
  — **3 reviews** at handoff.

## B2. Brands

| Brand | Service | Page |
|---|---|---|
| **SuperUmzug** | Umzüge, private + corporate | `/umzug` |
| **BayReno** | Renovierung / Sanierung | `/renovierung` |
| **Entrümpelung München** | Entrümpelung + Haushaltsauflösung | `/entruempelung` |

`SuperUmzug` is one word everywhere. `Entrümpelung München` is two words in body
copy — **that spacing is the money keyword and must not be joined**. The joined
form `EntrümpelungMünchen` appears only inside the schema `businessName`, to
match the Google profile verbatim.

**Schema business name:** `BayReno | SuperUmzug | EntrümpelungMünchen` —
must match the Google profile **character for character**, since that string is
what lets Google resolve profile ↔ site. ⚠️ **If Google rejected the rename,
update `content/site.json → organization.businessName` to whatever actually
stuck.** Both spellings are already in `alternateName` as a safety net.

## B3. Operations

- **Fleet:** 2 vans ≤3.5 t + 2 trailers, owned. Crews 2–4. Largest job handled:
  ~700 m of shelving / 40 office workstations.
- **Surcharges:** Saturday +50 %; Sunday/holiday and 24 h express = double rate.
- **Express:** within 24 h subject to availability. **Callback within 24 h.**
- **Payment:** bank transfer / invoice, 19 % MwSt (not Kleinunternehmer).
  Documented terms: moves 7 days; clearance due immediately after completion.
  Kostenvoranschlag may be exceeded by **at most 20 %**; extra work only after
  prior agreement.
- **Protective material:** moving blankets, stretch film, bubble wrap, special
  mattress covers. Floor machines for milling/grinding, removing linoleum, PVC,
  parquet, laminate and adhesive.
- **Halteverbotszone:** 300 € gross per address, ~3 weeks lead time.

## B4. What the business does NOT do

No overseas moves (EU only). No pianos, grand pianos, safes, billiard tables,
industrial machinery, crane-requiring or window/balcony loads. Nothing two people
cannot safely move by hand or with straps. Whirlpool/sauna ≤120 kg, potted plants
≤100 kg. No live animals. **No furniture lift (Möbellift).** No WhatsApp channel.

## B5. Decisions the owner made

1. **The "Unbeschädigt-Garantie" is RETIRED** (questionnaire Q18). ⚠️ The old
   `PROJECT-CONTEXT.md` called it the "flagship promise" — that is now wrong. The
   site states only **statutory liability: 620 € per m³ under § 451e HGB**, plus
   optional transport insurance at a customer-declared value, plus the § 438 HGB
   reporting deadlines (visible damage at handover, hidden within 14 days). The
   chatbot is explicitly forbidden from promising more.
2. **Storage (Einlagerung) is offered** — own warehouse plus vetted partners.
3. **All consumer prices brutto incl. 19 % MwSt** (PAngV). Halteverbotszone
   corrected from 250 net to 300 gross.
4. **Chatbot on Anthropic**, not DeepSeek.
5. **Analytics: Vercel only** — cookieless, no consent banner. Google Analytics
   declined precisely because it would force one.
6. **Prices are published openly** — see C4.

## B6. Chatbot state

- **Working in production.** Anthropic, `claude-haiku-4-5`, via
  `@anthropic-ai/sdk`. `ANTHROPIC_API_KEY` set in Vercel.
- **DeepSeek was rejected.** The owner first supplied a DeepSeek key (`sk-` + 32
  hex); tested → `401 invalid` against Anthropic, since the SDK targets
  `api.anthropic.com`. Beyond incompatibility, DeepSeek is Chinese and China has
  **no EU adequacy decision** — it would require rewriting the privacy policy
  (which names Anthropic PBC/USA), SCCs, a transfer impact assessment and
  probably a consent gate. **The key was never written to the repo** — verified
  across the working tree and full git history. Rotate it anyway.
- **Knowledge base** (`content/chatbot-knowledge-base.md`, ~20 KB) now carries
  questionnaire section G: 7-step job flow, 24 h callback promise, customer
  preparation, payment terms, 20 % cap, vehicles and materials, and 15 real
  customer questions with the owner's own answers.
- **Guardrails verified in production.** Asked *"Können Sie mein Klavier umziehen
  und garantieren Sie 400 € für nächsten Montag?"* → refused the piano, refused
  the price, refused the date, offered the callback. Prohibitions and escalation
  triggers live in KB §8/§8a and are mirrored into the system prompt.
- **Known minor issue:** the KB is in English while the bot answers German
  customers, so occasional English words leak ("die genaue Scope"). Fix by
  translating customer-facing KB sections.

## B7. Competitor intelligence (researched live, Aug 2026)

10 Munich firms audited across all three verticals. **Three flanks open at once:**

1. **Nobody publishes prices.** Brandlmeier (since 1982, top-3) publishes zero
   euro figures. Rümpel Kumpel (4.9★/446) publishes zero. mmoving.de already
   publishes full brutto tables.
2. **Nobody has Munich district pages.** Flagged independently in 3 of 5 audits.
   Now taken.
3. **The AI-retrieval layer is empty.** No competitor has llms.txt, markdown
   mirrors or IndexNow.

**Named:** Umzug — Eichenseer, Brandlmeier, Völler, Umzug Ruck Zuck, Tip-Top,
SPAR, NOX. Entrümpelung — Rümpel Kumpel, Entrümpel Trupp, Billig-Entrümpelung,
WirEntsorgen, A&O; franchises Rümpelhelden, Lentu. Renovierung — Jonas, Bossmann,
Top-Renovierung, Hans Schramm, MR Umbau, AS.

**What wins there:** exact-match URLs `/[leistung]-muenchen/`, per-city pages
(Brandlmeier has 20), "Festpreis"/"besenrein" messaging, decades-in-business
claims, AMÖ seals, calculators (Ruck Zuck), and above all **review volume**.

**Geography:** the business is in Germering, not Munich. Build **organic** for
Munich city; build **map-pack** for the western corridor (Germering, Puchheim,
Gröbenzell, Olching, Fürstenfeldbruck, Gauting). Different games.

---

# PART C — THE SITE AS IT STANDS

## C1. Repo and deployment

- **Local path:** `C:\Users\gromo\OneDrive\Počítač\superumzug web`
- **GitHub:** https://github.com/matqo16-ops/superumwug_web (note the typo
  "superum**w**ug" in the repo name — the domain is correctly `mmoving.de`)
- **Branch `main`**, Vercel auto-deploys on push.
- ✅ **Domain is LIVE** at `https://mmoving.de`. (The old context file said "not
  yet pointed" — outdated.) Canonical is the **bare apex**; `www` 308-redirects
  to it. This was backwards at one point and was fixed.

## C2. Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · next-intl · zod · Resend ·
Anthropic SDK · Neon Postgres · marked · vitest · @vercel/analytics.

```bash
npm run dev       # localhost:3000
npm run build     # must pass with zero warnings
npm run start
npm test          # vitest — 29 tests
npm run migrate   # Neon chat table (needs DATABASE_URL)
npm run indexnow  # push every sitemap URL to Bing
```

## C3. Core principle — content lives in `/content`

**All copy is in `content/de|en/*.json`, typed in `lib/content-types.ts`. Never
hardcode copy in components.** The owner maintains the site by editing JSON.

```
content/
  site.json                   org data, businessLocation, googleBusinessProfile
  llms.txt                    served at /llms.txt
  chatbot-knowledge-base.md   the ONLY source the chatbot may answer from
  de/  common home umzug renovierung entruempelung komplettservice b2b
       kontakt impressum datenschutz projekte blog ueber-uns halteverbotszone
       blog/<slug>.md          8 German articles
       stadtteile/<slug>.json  10 Munich district pages
  en/  same minus blog/, halteverbotszone, stadtteile
```

## C4. ⚠️ Pricing policy — REPLACES the old §9 entirely

The old context file said the 290 € survey was the only price on the site and
that everything else was disclaimed as "not an offer". **That is no longer true
and must not be reinstated.**

- The site **publishes full price tables** on all three service pages, **brutto
  incl. 19 % MwSt**, and `llms.txt` now explicitly tells citing systems the
  prices **may be attributed to mmoving.de**. The previous wording did the
  opposite and handed competitors' AI answers free market data with the name
  stripped off.
- **Besichtigungsservice 290 € gross** is a true fixed price, always quotable.
- **Structured data derives its price bands from the rendered tables**, so schema
  and page cannot drift.
- **STILL NOT DONE — owner-blocked:** committed "Festpreis ab X €" per service.
  A strategy agent proposed invented defaults; they were deliberately **not**
  implemented. **Never publish a binding price the owner has not confirmed** — in
  Germany an advertised fixed price is binding and Abmahnung-able. Same rule for
  the Impressum address and guarantee wording.

## C5. Routes

German unprefixed, English under `/en` with localized slugs.

| DE | EN |
|---|---|
| `/` | `/en` |
| `/umzug` | `/en/moving` |
| `/umzug/[stadtteil]` | — German only, 10 pages |
| `/renovierung` | `/en/renovation` |
| `/entruempelung` | `/en/clearance` |
| `/komplettservice` | `/en/full-service` |
| `/ueber-uns` | `/en/about` |
| `/ratgeber/halteverbotszone-muenchen` | — German only |
| `/b2b` | `/en/b2b` |
| `/kontakt` | `/en/contact` |
| `/impressum` | `/en/imprint` |
| `/datenschutz` | `/en/privacy` |
| `/blog`, `/blog/[slug]` | — German only |

Districts: schwabing · bogenhausen · haidhausen · maxvorstadt ·
neuhausen-nymphenburg · sendling · pasing · giesing · laim · moosach.

**301/308 redirects:** `/bayreno` → `/renovierung`, `/pakete` → `/komplettservice`.

Other endpoints: `/api/callback`, `/api/chat`, `/llms.txt`, `/sitemap.xml`
(30 URLs), `/robots.txt`, `/icon.png`, `/apple-icon.png`, `/admin/chats`.

**⚠️ Adding a German-only route requires three edits**, or it emits hreflang to
404s: `i18n/routing.ts → pathnames`, the `GERMAN_ONLY` list in
`components/LanguageSwitcher.tsx`, and the `germanOnly` check in
`app/sitemap.ts`. A missed one previously put a crawlable 404 on every district
and blog page.

`i18n/routing.ts` exports `AppPathname` and **`StaticPathname`** — bare `href`
strings must use `StaticPathname`, because dynamic routes need a `params` object.

## C6. Design system

- Deep navy `#0E1F3C`, anthracite `#20242B`, cream `#FAF9F6`, gold `#C9A24B` /
  `#A9832F`. Tokens in `app/globals.css`.
- **Fraunces** (display) + **Inter** (body) via `next/font`.
- Reusable: `Section`, `SectionHeading`, `Hero`, `Faq`, `Breadcrumbs`,
  `ServiceSections` (ServiceLead/ServiceDetail/PricingTable/Situations/
  AreasServed/CrossLinks/EntityFacts), `StadtteilDirectory`, `Photo`,
  `ProjectsGallery`, `ChatWidget`, `CallbackForm`, `ServiceAreaMap`.
- **`Faq` and `Breadcrumbs` emit their own JSON-LD** — do not add duplicate
  schema alongside them.
- `PlaceholderImage` was **deleted**; all four photos are real now.

### ⚠️ The hero is LOCKED
Do not modify hero copy or layout unless asked. One exception was made and
flagged: the Umzug hero said "Unbeschädigt garantiert", which had to go when the
guarantee was retired.

## C7. Features

**Header/nav:** mmoving hexagon + wordmark → divider → three brand logos. Nav:
home · Projekte · Crew · Komplettservice · **Über uns** · B2B/Partner · Kontakt.
Persistent "Rückruf anfordern" button opens the callback modal.

**Brand characters:** cut-out PNGs in `public/images/` — `header-char.png`
(BayReno), `umzug-char.png`, `entruempelung-char.png`. All three re-cropped to
matching margins so they render at identical size; dimensions live in
`common.json → characters`.

**Photos:** `b2b-handshake.jpg`, `garantie-dokumentation.jpg`, `besenrein.jpg`,
`og-image.jpg` (1200×630, on every page).

**Offer structure (`/komplettservice`):** Privatumzug Komplett · Firmenumzug
Komplett · Rundum-Service für Vermieter · Besichtigungsservice 290 € (bonus,
independent).

**Callback form:** client → `POST /api/callback` → zod → Resend. Honeypot +
per-IP rate limit (5/10 min). **No database — the email is the record**, so a
delivery failure means the enquiry is gone. Three distinct error states:
`429` rate-limited, `503 email_not_configured`, `502 email_rejected`.

**Chatbot:** floating widget, streams `claude-haiku-4-5`, system prompt = rules +
full KB. Voice via browser-native Web Speech API. Logs to Neon;
`/admin/chats` (Basic Auth, noindex) lists transcripts.

**Blog:** 8 German articles, JSON front matter + markdown, rendered with `marked`.

**Service-area map (`/kontakt`):** self-hosted SVG from real WGS84 coordinates —
no third-party request, so no cookie banner. Links out to the Google profile.

**Analytics:** Vercel, cookieless. Only cookie site-wide is `NEXT_LOCALE`
(functional), disclosed in the privacy policy.

## C8. SEO / GEO layer

- `lib/schema.ts` centralises **LocalBusiness/MovingCompany** (`@id`
  `https://mmoving.de/#business`), **Person** (Martin Marcinko, and blog author),
  **Service**, **FAQPage**, **BreadcrumbList**, **Article**, **HowTo**,
  **AboutPage**, **ItemList**.
- `Offer` + `PriceSpecification` bands derived from the rendered tables. The
  price column is located **by heading**, not position — the Entrümpelung table
  ends with "Dauer" and position-based lookup produced a nonsense 1–8 € band.
  Per-m² rates are excluded from total-price bands.
- `sameAs` + `hasMap` → Google profile. `foundingDate` 2004. 7 languages.
- `businessLocation` (visitable, matches GBP) is kept **separate** from
  `organization` (legal Impressum address) in `site.json`; schema uses the former
  with real Germering coordinates. It previously declared the legal address and
  Munich-centre coordinates ~18 km off.
- **og:image on every page** plus `summary_large_image` Twitter cards.
- **IndexNow** live: key at `public/9052846261f58c994e5ca29e637d3671.txt`,
  `npm run indexnow` pushes all sitemap URLs to Bing (feeds ChatGPT Search).
- Sitemap has no `priority`/`changeFrequency` and no per-deploy `lastModified`
  restamp — all three are noise or actively harmful.

## C9. Environment variables

| Variable | Purpose | If unset |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chatbot | Widget shows "unavailable" |
| `RESEND_API_KEY` | Callback emails | `503 email_not_configured` |
| `CALLBACK_TO_EMAIL` | Inbox for requests | Same |
| `CALLBACK_FROM_EMAIL` | *(optional)* verified sender | Falls back to `onboarding@resend.dev` |
| `DATABASE_URL` | Neon chat transcripts | Chat works, no logging |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Basic Auth for `/admin` | `/admin` returns 503 |
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap base | Defaults to `https://mmoving.de` |
| `INDEXNOW_KEY` | *(optional)* | Falls back to the committed key |

**Env vars only apply after a redeploy.** Vercel → Deployments → newest → ⋯ →
Redeploy.

## C10. Commit history (this session, newest first)

```
b92205a fix(callback): tell apart a missing config from a rejected send
4e48e72 feat(chat): load the owner questionnaire into the assistant knowledge base
b0ba349 docs: SEO/GEO roadmap from competitor research and strategy committee
39556a6 feat(seo,geo): expat-targeted English titles, IndexNow submission
e0f178a feat(seo): 10 Munich district pages, the geo layer no competitor occupies
6144d32 feat(seo,geo): entity repair, price-bearing schema, /ueber-uns and Halteverbot guide
d0319c8 feat(analytics,seo): cookieless Vercel Analytics, align name with Google profile
75ff33b feat(seo,legal): match Google profile identity, fill GDPR retention fields
5764ac3 fix(seo,legal): declare the visitable location, not the legal address
3a51217 feat(seo): connect the Google Business Profile to the site
1acd666 feat(content,seo): real photos, OG image, statutory liability, brutto prices
4c4bb0a feat(legal): fill Impressum from owner questionnaire, real contact details
```

Earlier history (site build-out) is in `git log`; the original scaffold commit is
`f059b5f`.

## C11. Legal pages — current state

- **Impressum** built from the questionnaire: one Einzelunternehmen, both
  addresses, USt-IdNr, § 18(2) MStV, LVN. Commercial-register section removed
  (not applicable to an Einzelunternehmen). Steuernummer and IBAN deliberately
  absent.
- **Datenschutz** complete: Neon region eu-central-1 Frankfurt, BayLDA as
  supervisory authority, retention as concrete periods with legal basis
  (enquiries → end of third year per §§ 195/199 BGB; chat → 12 months),
  `NEXT_LOCALE` cookie disclosed, Vercel Analytics described, Google Analytics
  explicitly excluded. ⚠️ The owner asked for "the maximum the GDPR allows" —
  that is not a thing; Art. 13(2)(a) requires a *specific* period.
- **No placeholders remain** on any rendered page.
- **Missing: AGB and Widerrufsbelehrung** — see A4.

---

# PART D — WORKING NOTES

## D1. Preferences

- Commit per feature, descriptive message, push to `main`. Co-author trailer:
  `Claude Opus 5 <noreply@anthropic.com>`.
- **Verify in the browser before claiming anything works.** Real defects that a
  clean build passed straight through this session: the www redirect
  contradiction, the 404-ing language switcher, the 1–8 € schema band, the
  callback email failing silently.
- **Flag legal/compliance implications** rather than working around them — but if
  the owner overrides, follow the instruction and say so plainly.
- **The owner is not a developer.** Explain in plain language, give exact click
  paths for Vercel/Google/Resend, never assume CLI familiarity. Explain German
  legal terms rather than using them bare.
- Never publish prices, guarantees or legal terms the owner has not confirmed.

## D2. Environment gotchas

- **OneDrive corrupts `.next`.** Builds intermittently fail with
  `EINVAL: invalid argument, readlink '.next/...'`. Fix: `rm -rf .next` and
  rebuild. Happens roughly every third build; not a code problem.
- Windows + Git Bash. Heredocs work for commit messages. Complex inline
  `node -e` with nested template literals breaks on quoting — write a `.mjs`
  file or use the Edit tool.
- Usage limits were hit repeatedly during large multi-agent workflows. Resume
  with `Workflow({scriptPath, resumeFromRunId})` — completed agents replay from
  cache, only failed ones re-run.

## D3. Other docs in the repo

- **`SEO-ROADMAP.md`** — the detailed SEO backlog, phases and rejected items.
- `DEPLOY.md` — deployment and DNS.
- `TODO.md` — placeholder inventory (largely obsolete; placeholders are resolved).
- `SEO-REPORT.md` — the earlier SEO audit.
- `PROJECT-CONTEXT.md` and `HANDOFF-2026-08-25-SEO-CHATBOT-EMAIL.md` — superseded
  by this file; both now point here.
