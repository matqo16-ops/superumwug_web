# HANDOFF — mmoving.de · 25 August 2026
## Session: SEO/GEO campaign, chatbot wiring, callback-email debugging

**Upload this file at the start of a new session.** It carries everything from
the previous one. It supersedes nothing — read `PROJECT-CONTEXT.md` for the
original architecture and `SEO-ROADMAP.md` for the full SEO backlog.

Last commit at handoff: `b92205a`. Working tree clean, everything pushed to
`main`, Vercel auto-deploys.

---

# 1. THE ONE THING THAT IS BROKEN RIGHT NOW

**The callback form does not deliver email.** This is the live blocker — every
enquiry submitted through the site is currently lost.

Diagnosis so far, by probing `POST https://mmoving.de/api/callback` with a
valid payload:

| Stage | Response | Meaning |
|---|---|---|
| Before env vars | `503 email_not_configured` | `RESEND_API_KEY` / `CALLBACK_TO_EMAIL` missing |
| Owner added Resend key + redeployed | **`502 email_rejected`** ← current state | Config fine, **Resend refuses the send** |

**Near-certain cause:** Resend's free tier, with the default
`onboarding@resend.dev` sender and no verified domain, only permits sending to
the address the Resend account was registered with. `CALLBACK_TO_EMAIL` is
`kontakt@bayreno.de`, which is presumably not that address.

**Confirm:** Vercel → Logs → filter Error → submit the form once. Expect
something like *"You can only send testing emails to your own email address"*.

**Fix (proper):** verify `mmoving.de` in Resend → Domains → Add Domain (choose
EU/Ireland region for GDPR). Resend emits TXT/MX records; add them in
Vercel → Domains → mmoving.de → DNS Records (Vercel runs the DNS). Then set
`CALLBACK_FROM_EMAIL = mmoving.de <website@mmoving.de>` and redeploy.

**Fix (quick test only):** set `CALLBACK_TO_EMAIL` to the Resend signup address,
redeploy, confirm delivery works, then do the proper fix.

**To verify after fixing**, run:

```bash
curl -s -o /tmp/cb.json -w "HTTP %{http_code} " -X POST https://mmoving.de/api/callback \
  -H "content-type: application/json" \
  -d '{"name":"Diagnose Test","phone":"+49 176 228 661 46","preferredTime":"sofort","topic":"umzug","consent":true,"locale":"de","sourcePage":"/diagnose"}' ; cat /tmp/cb.json
```

`{"ok":true}` = fixed. Note the endpoint rate-limits at 5 requests / 10 min /
IP, returning `429`.

---

# 2. BUSINESS FACTS ESTABLISHED THIS SESSION

Source: the owner's completed questionnaire
`mmoving-dotaznik-majitel_VYPLNENY_2026-08-14.docx` (in `~/Downloads`).
These are confirmed unless marked otherwise.

- **Legal entity:** Einzelunternehmen **Martin Marcinko**. One company, three
  brands — SuperUmzug, BayReno, Entrümpelung München. Not three companies.
- **Legal address (Impressum, ladungsfähige Anschrift):** Planegger Str. 40,
  82110 Germering.
- **Visitable business location (matches Google profile):** Ausburgerstraße 4,
  82110 Germering, entrance via Hirtenstraße.
  ⚠️ **Unresolved:** is it *"Ausburgerstraße"* or *"Augsburger Straße"*? Spelled
  the first way in the questionnaire and used verbatim, but Germering sits on
  the Munich–Augsburg axis and the second is far more common. It is in the
  Impressum, so it matters. **Ask the owner to check a bill.**
- **Founded 2004**, over **1,000 moves** completed.
- **Languages:** DE, EN, SK, CS, PL, UK, HR.
- **Phone:** +49 176 228 661 46. **Email:** kontakt@bayreno.de (owner confirmed
  `.de`, not `.com`).
- **USt-IdNr:** DE 219 349 391. Steuernummer 106/5724/7147 — **never publish**.
- **Insurer:** LVN (Betriebs-/Berufshaftpflicht).
- **Hours:** Mo–Fr 8–18, Sa 9–14 (owner said keep these).
- **Fleet:** 2 vans ≤3.5 t + 2 trailers, own. Crews 2–4. Largest job ~700 m
  shelving / 40 office workstations.
- **Surcharges:** Saturday +50 %; Sunday/holiday and 24 h express = double.
- **Express:** possible within 24 h subject to availability. Callback within 24 h.
- **Payment:** bank transfer / invoice. 19 % MwSt (not Kleinunternehmer).
  Kostenvoranschlag may be exceeded by at most 20 %.
- **Google Business Profile:** `https://maps.google.com/?cid=4349102244822623293`
  — currently **3 reviews**. Owner submitted name/address/website changes;
  **verify in ~1 week that Google actually applied them** (silent rejections are
  common).

## Decisions the owner made

1. **The "Unbeschädigt-Garantie" is retired.** Per questionnaire Q18. The site
   now states only statutory liability: **620 € per m³ under § 451e HGB**, plus
   optional transport insurance at a customer-declared value, and the § 438 HGB
   reporting deadlines. The chatbot is explicitly forbidden from promising more.
2. **Storage (Einlagerung) is offered** — own warehouse plus vetted partners.
3. **All consumer prices brutto incl. 19 % MwSt** (PAngV). Halteverbotszone
   corrected from 250 net to **300 gross**.
4. **Chatbot runs on Anthropic**, not DeepSeek — see §4.
5. **Analytics: Vercel only** (cookieless, no consent banner). Google Analytics
   was declined precisely because it would force a consent banner.

## What must NOT be invented

**Never publish binding prices, guarantees or legal terms the owner has not
confirmed.** A strategy agent proposed a full set of "Festpreis ab X €" numbers;
they were deliberately **not** implemented. In Germany an advertised fixed price
is binding and Abmahnung-able. Build the structure, leave the number to the
owner. Same for the Impressum address and guarantee wording.

---

# 3. WHAT SHIPPED THIS SESSION (12 commits)

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

## Content and legal
- **Impressum** built from the questionnaire: one Einzelunternehmen, both
  addresses, USt-IdNr, § 18(2) MStV, LVN. Commercial-register section removed
  (not applicable). Steuernummer and IBAN deliberately absent.
- **Privacy policy** completed: Neon region eu-central-1 Frankfurt, BayLDA as
  supervisory authority, retention stated as concrete periods with legal basis
  (enquiries → end of third year per §§ 195/199 BGB; chat → 12 months), the
  NEXT_LOCALE functional cookie disclosed, Vercel Analytics described.
  ⚠️ The owner asked for "the maximum the GDPR allows" — that is not a thing;
  Art. 13(2)(a) requires a *specific* period. Explained and set concrete values.
- Four real photos placed (B2B handshake, damage documentation, broom-clean
  flat, 1200×630 OG card). `PlaceholderImage` component deleted; new `Photo`
  component. **og:image now on every page** — previously absent entirely.

## SEO / GEO
- **10 Munich district pages** at `/umzug/[stadtteil]`: schwabing, bogenhausen,
  haidhausen, maxvorstadt, neuhausen-nymphenburg, sendling, pasing, giesing,
  laim, moosach. ~1,000 words each, genuinely district-specific (real
  Parklizenzgebiete + hours, Baujahre, street/tram constraints, 3 FAQ each).
  Hub directory on `/umzug` + `ItemList` + 5-neighbour mesh shipped together so
  they are not orphans. Content in `content/de/stadtteile/*.json`.
- **`/ueber-uns`** (DE+EN) — states the one-company-three-brands fact in one
  extractable sentence; `AboutPage` + `Person` schema.
- **`/ratgeber/halteverbotszone-muenchen`** (DE only) — `HowTo` schema, KVR
  process, 72-hour rule, 300 € figure. Every audited competitor buries this.
- **`llms.txt` rewritten.** It had three false facts (claimed Munich HQ, two
  languages, "290 € is the only price on the site") and instructed citing
  systems *not* to attribute prices to mmoving.de. Inverted; price tables now
  reproduced in full and explicitly citable.
- **Schema:** `Offer` + `PriceSpecification` bands derived from the rendered
  price tables (cannot drift). Price column found *by heading* — the
  Entrümpelung table ends with "Dauer" and position-based lookup produced a
  nonsense 1–8 € band. Per-m² rates excluded from total-price bands.
  `Person` node for Martin Marcinko; blog authorship repointed to him.
  `sameAs` + `hasMap` → Google profile. `foundingDate`, 7 languages.
- **Business name in schema** = `BayReno | SuperUmzug | EntrümpelungMünchen`,
  matching the renamed Google profile **verbatim** (that string is what lets
  Google resolve profile ↔ site). Both spaced and one-word variants kept in
  `alternateName`. ⚠️ **If Google rejected the rename, update
  `content/site.json → organization.businessName` to whatever actually stuck.**
- **English pages retitled** for the expat query set (no new URLs).
- **IndexNow** live: key at `public/9052846261f58c994e5ca29e637d3671.txt`,
  `npm run indexnow` pushes every sitemap URL to Bing (feeds ChatGPT Search).
  30 URLs already submitted.
- Sitemap cleaned (dropped `priority`, `changeFrequency`, per-deploy
  `lastModified` restamp).
- **Vercel Analytics** wired (cookieless — no consent banner needed).

## Bugs found and fixed along the way
- `mmoving.de` was **308-redirecting to `www`** while every canonical tag said
  the bare apex — the site was telling Google two contradictory things. Owner
  reversed it in Vercel; now www → apex.
- Language switcher offered EN on German-only routes, putting a **crawlable 404
  on every district and blog page**. Now falls back to `/en`.
- Schema declared the legal address and Munich-centre coordinates for a business
  in Germering (~18 km off). Split into `organization` (legal) vs
  `businessLocation` (visitable, matches GBP) in `content/site.json`.
- Callback form showed *"check your details"* on HTTP 429. Now has its own
  message.
- Hero characters rendered at different sizes (BayReno PNG had ~90 px of
  transparent margin). All three re-cropped to matching margins.

---

# 4. CHATBOT — WORKING

- **Provider: Anthropic**, model `claude-haiku-4-5`, via `@anthropic-ai/sdk`.
  `ANTHROPIC_API_KEY` set in Vercel. **Verified working in production.**
- **DeepSeek was rejected.** The owner initially supplied a DeepSeek key
  (`sk-` + 32 hex). It was tested → `401 invalid` against Anthropic, since the
  SDK targets `api.anthropic.com`. Beyond incompatibility, DeepSeek is Chinese
  and China has **no EU adequacy decision** — it would require rewriting the
  privacy policy (which names Anthropic PBC/USA), SCCs, a transfer impact
  assessment, and probably a consent gate. Owner chose Anthropic instead.
  **The DeepSeek key was never written to the repo** — verified across the
  working tree and full git history. Owner advised to rotate it anyway.
- **Knowledge base** (`content/chatbot-knowledge-base.md`, ~20 KB) now carries
  section G of the questionnaire: 7-step job flow, 24 h callback promise, what
  the customer must prepare, payment terms, 20 % Kostenvoranschlag cap,
  vehicles and protective materials, and 15 real customer questions with the
  owner's own answers.
- **Guardrails added and verified in production.** Asked *"Können Sie mein
  Klavier umziehen und garantieren Sie 400 € für nächsten Montag?"* — it
  refused the piano, refused the price, refused the date, and offered the
  callback. Hard prohibitions and escalation triggers live in KB §8/§8a and are
  mirrored into the system prompt in `lib/chat.ts`.
- **Known minor issue:** the KB is written in English while the bot answers
  German customers, so occasional English words leak ("die genaue Scope").
  Fixable by translating the customer-facing KB sections to German.

---

# 5. COMPETITOR INTELLIGENCE (researched live, Aug 2026)

10 Munich firms audited across all three verticals. **Three flanks are open
simultaneously:**

1. **Nobody publishes prices.** Brandlmeier (since 1982, ranks top-3) publishes
   zero euro figures. Rümpel Kumpel (4.9★/446) publishes zero. mmoving.de
   already publishes full brutto tables — this is the differentiator.
2. **Nobody has Munich district pages.** Flagged independently in 3 of 5 audits
   as an open flank. Now taken.
3. **The AI-retrieval layer is empty.** No competitor has llms.txt, markdown
   mirrors or IndexNow.

**Named competitors:** Umzug — Eichenseer, Brandlmeier, Völler, Umzug Ruck Zuck,
Tip-Top, SPAR, NOX. Entrümpelung — Rümpel Kumpel, Entrümpel Trupp,
Billig-Entrümpelung, WirEntsorgen, A&O; plus franchises Rümpelhelden, Lentu.
Renovierung — Jonas, Bossmann, Top-Renovierung, Hans Schramm, MR Umbau, AS.

**Tactics that win there:** exact-match URLs `/[leistung]-muenchen/`, per-city
pages (Brandlmeier has 20), "Festpreis"/"besenrein" messaging, decades-in-
business claims, AMÖ seals, interactive calculators (Ruck Zuck), and above all
**review volume** — Völler 143@5.0, Ruck Zuck ~940 aggregated.

**THE BINDING CONSTRAINT: reviews.** mmoving has 3. Ranking a page next to
Völler without reviews sends the visitor to Völler — and published prices make
it worse by removing the reason to call. Review acquisition is owner work with a
~90-day lead time and gates conversion on everything else.

**Geography:** the business is in Germering, not Munich. Build **organic** for
Munich city; build **map-pack** for the western corridor (Germering, Puchheim,
Gröbenzell, Olching, Fürstenfeldbruck, Gauting). Different games — do not
conflate them.

---

# 6. OPEN ITEMS

## Blocked on the owner
1. **Fix the callback email** — §1. Highest priority; enquiries are being lost.
2. **Reviews** — 3 today. Send the Google review link to every customer from the
   last 6 months. 8–10/month, never in bursts.
3. **Google Business Profile:** add categories *Entrümpelungsdienst* and
   *Renovierungsdienst* (invisible for two of three services otherwise); add
   photos; confirm the name/address changes actually applied.
4. **Bing Webmaster Tools** — import from Search Console (3 min).
5. **Decide the from-prices** — biggest available differentiator; must come from
   the owner.
6. **`/referenzen` case studies** — need real jobs with district, duration,
   final price, consent. `StadtteilContent.reference` already renders one per
   district page when supplied.
7. **Street-name check** — Ausburgerstraße vs Augsburger Straße.
8. **Rotate the DeepSeek key.**

## Buildable with no owner input (from `SEO-ROADMAP.md`)
1. **`/preise` silo** — hub + 3 cost pages. **Mandatory same-commit
   housekeeping:** 301 `/blog/umzugskosten-muenchen` and
   `/blog/entruempelung-kosten-muenchen` into them, remove from `lib/blog.ts`,
   trim service-page tables to a 3-row teaser. Three pages targeting the same
   query is worse than one.
2. **4 calculators.** Two binding constraints: the full matrix must be a real
   SSR'd `<table>` (a JS-only calculator is invisible to crawlers and unquotable
   by assistants), and zero form fields before the result.
3. **12 sub-service pages** under the three hubs.
4. **8 western-corridor city pages**, Germering as flagship — only after the 10
   district pages are indexed.
5. **Markdown mirrors** (`slug + .md`) and `/llms-full.txt`.
6. **5 `/vergleich/` decision pages** — honest "should you DIY" tables.
7. Translate the customer-facing chatbot KB sections into German.

## Explicitly rejected — do not redo
- Core Web Vitals work beyond a 30-min pass. Static Next 15 on Vercel;
  Brandlmeier ranks top-3 with a sitemap that 404s.
- 60 templated geo pages. Ten real ones first, measure indexation, then extend.
- New blog posts before page 1 is held.
- `aggregateRating` before the Google profile really shows ≥20 reviews. (Also:
  self-serving review markup has been ineligible for Google rich results since
  2019 — it is an LLM-extraction play, not a stars play.)
- PL/UA/HR landing pages before a native-speaking phone answer is guaranteed.
- Google Analytics — would force a consent banner the site currently avoids.

## Still entirely missing — biggest non-SEO exposure
**No AGB and no Widerrufsbelehrung.** For B2C in Germany, a customer not
properly informed of the 14-day withdrawal right can cancel for up to a year
after the fact, including after the work is done. The owner's own questionnaire
flags that parts A–D need a German lawyer before launch.

---

# 7. TECHNICAL NOTES FOR THE NEXT SESSION

- **Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, next-intl, Vercel.
  **All copy lives in `content/de|en/*.json`**, typed in `lib/content-types.ts`.
  Never hardcode copy in components.
- **Routes** are declared in `i18n/routing.ts → pathnames`. German is
  unprefixed; English lives at `/en/...` with localized slugs. German-only
  routes must also be added to the `GERMAN_ONLY` list in
  `components/LanguageSwitcher.tsx` and to the `germanOnly` check in
  `app/sitemap.ts`, or they emit hreflang to 404s.
- **Reusable sections:** `ServiceLead`, `ServiceDetail`, `PricingTable`,
  `Situations`, `AreasServed`, `CrossLinks`, `EntityFacts`,
  `StadtteilDirectory`, `Photo`, `Faq`, `Breadcrumbs`. `Faq` and `Breadcrumbs`
  **emit their own JSON-LD** — do not add duplicate schema alongside them.
- **OneDrive breaks `.next`.** Builds intermittently fail with
  `EINVAL: invalid argument, readlink '.next/...'`. Fix: `rm -rf .next` and
  rebuild. Happens roughly every third build; not a code problem.
- **Shell:** heredocs work for commit messages. Complex inline `node -e` with
  nested template literals fails on quoting — write a `.mjs` file or use the
  Edit tool instead.
- `npm run build` must pass with zero warnings. `npm test` = 29 vitest tests.
- **Verify in the browser before claiming anything works.** Real bugs found this
  way that a build passes cleanly through: the www redirect contradiction, the
  404-ing language switcher, the 1–8 € schema band.
