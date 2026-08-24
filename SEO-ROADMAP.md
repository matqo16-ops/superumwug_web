# SEO / GEO roadmap — mmoving.de

Derived from live competitor research (10 Munich firms across all three
verticals, Aug 2026) and a five-lens strategy committee. This file is the
working backlog; update it as items ship.

## The bet

Three flanks are open at the same time, and mmoving.de can take all three:

1. **Published prices.** Almost no Munich competitor publishes a single euro
   figure. Brandlmeier (40 years, top-3) publishes none. Rümpel Kumpel
   publishes none. mmoving.de already publishes full brutto tables.
2. **Munich district pages.** Not one of the five audited competitors has
   them; three audits flagged it independently as an open flank.
3. **The AI-retrieval layer.** No competitor has an `llms.txt`, markdown
   mirrors, or IndexNow. This is uncontested and cheap.

The hard constraint is reviews. The business sits at ~0; Völler has 143 at
5.0, Ruck Zuck ~940 aggregated. Ranking a page next to those without reviews
converts the visitor into a competitor's customer — and published prices make
that worse by removing the last reason to call. **Reviews gate conversion, so
they start now and run in parallel with everything else.**

The Germering pin also means: build organic for Munich city, build map-pack
for the western corridor. Do not confuse the two.

## Shipped

- Entity repair: `llms.txt` had three false facts (location, languages, "the
  only price on the site") and told citing systems *not* to attribute prices.
  All inverted; tables now reproduced in full and explicitly citable.
- `Offer` + `PriceSpecification` derived from the rendered price tables, so
  schema cannot drift from the page. Price column located by heading.
- `Person` node for Martin Marcinko; blog authorship repointed to him.
- `/ueber-uns` — one-company-three-brands stated in one extractable sentence.
- `/ratgeber/halteverbotszone-muenchen` — HowTo schema, KVR process, 72-hour
  rule, 300 € figure. Every competitor buries this in one sentence.
- 10 district pages under `/umzug/[stadtteil]`, ~1.000 words each, with
  researched Parklizenzgebiete, Baujahre, access constraints and per-district
  FAQ. Hub directory + `ItemList` + neighbour mesh in the same commit.
- English pages retitled for the expat query set (no new URLs).
- Sitemap hygiene; IndexNow push (`npm run indexnow`).
- Fixed: language switcher was linking to 404s on every German-only route.

## Next, in order

### Blocked on the owner
- **From-prices.** Publishing "Festpreis ab X €" is legally binding in
  Germany. The committee proposed defaults; they are *not* in the repo. The
  owner must set real numbers before this ships.
- **`/referenzen` case studies.** Needs real jobs with district, duration and
  final price, plus customer consent. `StadtteilContent.reference` already
  renders one per district page when supplied.
- **`aggregateRating`.** Only once the Google profile actually shows ≥20
  reviews. Never hardcode; drive from one field in `content/site.json`.
  Understand what it buys: self-serving review markup has been ineligible for
  Google rich results since 2019 — this is an LLM-extraction play, not stars.

### Buildable now
1. **`/preise` silo** — hub plus three cost pages. Mandatory same-commit
   housekeeping: 301 `/blog/umzugskosten-muenchen` and
   `/blog/entruempelung-kosten-muenchen` into them, remove from `lib/blog.ts`,
   and cut the service-page tables to a 3-row teaser. Three pages targeting
   "umzug münchen kosten" is worse than one.
2. **Calculators** — `/umzugskosten-rechner`, `/entruempelung-kosten-rechner`,
   `/renovierungskosten-rechner`, `/kartonrechner`. Two binding constraints:
   the full matrix must be a real SSR'd `<table>` (a JS-only calculator is
   invisible to crawlers and unquotable by assistants), and zero form fields
   before the result.
3. **12 sub-service pages** under the three hubs — Firmenumzug, Seniorenumzug,
   Fernumzug, Einlagerung, Studentenumzug, Haushaltsauflösung, Messie-Wohnung,
   Nachlass, Kellerentrümpelung, Malerarbeiten, Bodenverlegung,
   Wohnungsübergabe.
4. **8 western-corridor city pages** — Germering as flagship, not an
   afterthought. Only after the 10 district pages are indexed.
5. **Markdown mirrors** (`slug + .md`) and `/llms-full.txt` — raises
   quotable-facts-per-retrieved-token for assistants.
6. **5 `/vergleich/` decision pages** — not competitor comparisons; honest
   "should you do this yourself" tables with the losing case stated outright.

### Explicitly rejected
- Core Web Vitals work beyond a 30-minute pass. Static Next 15 on Vercel;
  Brandlmeier ranks top-3 with a sitemap that 404s. Not where this is won.
- 60 templated geo pages. Ten real ones first; measure indexation, then extend.
- New blog posts before page 1 is held.
- PL/UA/HR landing pages before a native-speaking phone answer is guaranteed.

## Measurement

Watch Search Console *per cluster*, not in aggregate. If the district wave
sits in "Crawled – currently not indexed", stop and fix that before shipping
the next wave. Realistic: indexed 1–2 weeks, first rankings 1–3 months,
"Umzugsunternehmen München" 6+ months.
