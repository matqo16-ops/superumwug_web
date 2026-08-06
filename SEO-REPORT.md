# SEO / AEO Report — mmoving.de

Generated after the SEO and LLM-optimisation pass. Every row below was verified
against a production build with `_audit.mjs` (crawls the running site, parses the
HTML and validates the JSON-LD). **Result: all checks passed.**

Verification covered: exactly one H1 per page, title ≤ 60 chars, meta description
≤ 155 chars, canonical present, ≥ 6 FAQ entries in FAQPage schema, ≥ 2 internal
links, and parseable JSON-LD.

---

## 1. Page map

| URL | Target keywords | Schema types | Internal link targets |
|---|---|---|---|
| `/` | Umzug Entrümpelung Renovierung München, Komplettservice München | MovingCompany + HomeAndConstructionBusiness + LocalBusiness, FAQPage | /umzug, /renovierung, /entruempelung, /komplettservice, /b2b, /kontakt, /blog |
| `/umzug` | Umzug München, Umzugsunternehmen München, Umzugskosten München | Service, BreadcrumbList, FAQPage | /entruempelung, /renovierung, /komplettservice, /kontakt |
| `/entruempelung` | Entrümpelung München, Haushaltsauflösung München | Service, BreadcrumbList, FAQPage | /umzug, /renovierung, /komplettservice, /kontakt |
| `/renovierung` | Renovierung München, Sanierung München, Malerarbeiten München | Service, BreadcrumbList, FAQPage | /entruempelung, /umzug, /komplettservice, /b2b |
| `/komplettservice` | Komplettservice Umzug Renovierung Entrümpelung München, Umzug mit Entrümpelung | Service, BreadcrumbList, FAQPage | /umzug, /entruempelung, /renovierung, /b2b |
| `/b2b` | Hausverwaltung Handwerksservice München, Umzug Provision Vermittler | BreadcrumbList, FAQPage | /umzug, /entruempelung, /renovierung, /kontakt |
| `/kontakt` | Umzugsunternehmen München Kontakt, Rückruf | BreadcrumbList, FAQPage | /umzug, /entruempelung, /renovierung, /datenschutz |
| `/blog` | Ratgeber Umzug Entrümpelung Renovierung München | BreadcrumbList, FAQPage | all 8 articles + service pages |
| `/impressum`, `/datenschutz` | — (legal, indexable, low priority) | — | header/footer nav |

### Blog articles (German only — targets local German search intent)

| URL | Target keywords | Schema types | Internal link targets |
|---|---|---|---|
| `/blog/entruempelung-kosten-muenchen` | Entrümpelung München Kosten, Entrümpelung Preise, Entrümpelung Kosten pro qm | Article, BreadcrumbList, FAQPage | /entruempelung, /komplettservice |
| `/blog/umzugskosten-muenchen` | Umzugskosten München, Umzug München Preise, Umzug Kosten berechnen | Article, BreadcrumbList, FAQPage | /umzug, /komplettservice |
| `/blog/renovierung-vor-einzug-oder-nach-auszug` | Renovierung vor Einzug, Renovierung nach Auszug | Article, BreadcrumbList, FAQPage | /renovierung, /komplettservice, /blog/renovierungspflicht-beim-auszug |
| `/blog/haushaltsaufloesung-ablauf` | Haushaltsauflösung Ablauf, Wohnungsauflösung Todesfall | Article, BreadcrumbList, FAQPage | /entruempelung, /komplettservice, 2 blog articles |
| `/blog/umzug-und-entruempelung-kombinieren` | Umzug mit Entrümpelung, Umzug und Entrümpelung kombinieren | Article, BreadcrumbList, FAQPage | /komplettservice, /umzug, /entruempelung, /b2b |
| `/blog/wohnung-besenrein-uebergeben` | besenrein übergeben, Wohnungsübergabe besenrein | Article, BreadcrumbList, FAQPage | /entruempelung, /renovierung, /blog/renovierungspflicht-beim-auszug |
| `/blog/checkliste-umzug` | Checkliste Umzug, Umzug planen, Umzug Zeitplan | Article, BreadcrumbList, FAQPage | /umzug, /komplettservice, /blog/umzugskosten-muenchen |
| `/blog/renovierungspflicht-beim-auszug` | Renovierungspflicht Auszug, Schönheitsreparaturen Mieter | Article, BreadcrumbList, FAQPage | /renovierung, /entruempelung, /blog/wohnung-besenrein-uebergeben |

### English variants

`/en`, `/en/moving`, `/en/clearance`, `/en/renovation`, `/en/full-service`,
`/en/b2b`, `/en/contact` — same schema types and link structure, reciprocal
`hreflang` with the German pages. The blog is German-only, so `/en/blog` returns
404 by design and carries no hreflang alternate.

---

## 2. Measured results

| Page | Title | Desc | H1 | Words | FAQ | Links |
|---|---|---|---|---|---|---|
| `/` | 55 | 147 | 1 | 925 | 8 | 13 |
| `/umzug` | 59 | 150 | 1 | 1620 | 8 | 13 |
| `/entruempelung` | 54 | 138 | 1 | 1497 | 8 | 13 |
| `/renovierung` | 60 | 153 | 1 | 1479 | 8 | 13 |
| `/komplettservice` | 57 | 150 | 1 | 1355 | 8 | 13 |
| `/b2b` | 55 | 149 | 1 | 609 | 8 | 13 |
| `/kontakt` | 49 | 107 | 1 | 569 | 8 | 13 |
| `/blog` | 51 | 149 | 1 | 651 | 6 | 22 |
| `/blog/entruempelung-kosten-muenchen` | 42 | 143 | 1 | 1572 | 8 | 18 |
| `/blog/umzugskosten-muenchen` | 45 | 143 | 1 | 1460 | 8 | 18 |
| `/blog/renovierung-vor-einzug-oder-nach-auszug` | 39 | 142 | 1 | 1517 | 8 | 18 |
| `/blog/haushaltsaufloesung-ablauf` | 41 | 144 | 1 | 1466 | 8 | 19 |
| `/blog/umzug-und-entruempelung-kombinieren` | 34 | 139 | 1 | 1541 | 8 | 19 |
| `/blog/wohnung-besenrein-uebergeben` | 38 | 136 | 1 | 1437 | 8 | 18 |
| `/blog/checkliste-umzug` | 42 | 142 | 1 | 1352 | 8 | 19 |
| `/blog/renovierungspflicht-beim-auszug` | 44 | 143 | 1 | 1480 | 8 | 18 |
| `/en` | 54 | 137 | 1 | 1025 | 8 | 12 |
| `/en/moving` | 58 | 137 | 1 | 1694 | 8 | 12 |
| `/en/clearance` | 48 | 130 | 1 | 1578 | 8 | 12 |
| `/en/renovation` | 57 | 149 | 1 | 1617 | 8 | 12 |
| `/en/full-service` | 50 | 150 | 1 | 1510 | 8 | 12 |
| `/en/b2b` | 52 | 152 | 1 | 678 | 8 | 12 |
| `/en/contact` | 49 | 116 | 1 | 606 | 8 | 12 |

Word counts are rendered visible text. `/b2b`, `/kontakt` and `/blog` are
intentionally shorter — they are conversion and navigation pages, not keyword
landing pages.

---

## 3. Structured data

One entity graph, not isolated snippets. Everything resolves to a single
business node:

- **`@id: https://mmoving.de/#business`** — `MovingCompany` +
  `HomeAndConstructionBusiness` + `LocalBusiness`, with `geo` (48.1351, 11.582),
  a `GeoCircle` service radius of 50 km, `openingHoursSpecification`,
  `areaServed` listing 12 cities, `priceRange`, `knowsLanguage` and
  `makesOffer` for all five services.
- **`Service`** on each of the four service pages, `provider`-linked to that
  `@id`, each with a `hasOfferCatalog` built from the page's own service items.
- **`FAQPage`** on every page, generated from the same array the visible
  accordion renders — markup and structured data cannot drift.
- **`BreadcrumbList`** on every page except the home page, emitted alongside the
  visible trail from one component.
- **`Article`** on all 8 blog posts, `author`/`publisher` pointing at the
  business `@id`.

---

## 4. LLM / AEO measures

- **`/llms.txt`** (source: `content/llms.txt`) — company, all three services,
  the combined packages, service area, pricing logic, contact routes, a full page
  index and an explicit note that **290 € is the only quotable fixed price**.
- **Direct-answer openings** — every service page opens with a `lead` paragraph
  and every article's first sentence answers the title question outright.
- **Self-contained sections** — heading → direct answer → detail, so an
  assistant can lift one section without the surrounding page.
- **Extractable tables** — market-rate pricing tables on all three service pages
  plus a savings comparison on `/komplettservice`.
- **Consistent entity facts** — an identical `entity` block (company, brands,
  location, radius, services, guarantee, pricing logic, languages) appears on all
  four service pages.

---

## 5. Technical

- URLs: `/renovierung`, `/umzug`, `/entruempelung`, `/komplettservice`,
  `/blog/[slug]`. Old `/bayreno` and `/pakete` return **308** to the new slugs.
- `sitemap.xml` — all static pages with hreflang alternates, plus the 8 German
  articles; `/admin` and the `[slug]` template excluded.
- `robots.txt` — allows all, disallows `/admin` and `/api`, points at the sitemap.
- Images: AVIF/WebP enabled via `next.config.ts`; `next/image` lazy-loads by
  default with `priority` only on above-the-fold art.
- Service-area map on `/kontakt` is a self-hosted SVG generated from real WGS84
  coordinates: every town sits at its true relative position and the 50 km ring
  is drawn to the same scale. It renders immediately (no click, no third-party
  request, no consent banner) and links out to the interactive Google map.
- Every page keeps its callback CTA, the chatbot CTA and the floating assistant.

---

## 6. Open items

1. **Prices are market orientation, not your rates.** Every figure in the
   pricing tables and articles is labelled as a typical Munich market rate, with
   an explicit note that binding prices follow a survey. Replace them with your
   real numbers when ready — or tell me and I will.
2. **`[SEIT JAHR]`** in the entity block on the four service pages — your
   founding year. Inventing one would have been false.
3. The remaining `[TELEFON]`, `[E-MAIL]`, `[ADRESSE]` and legal placeholders are
   tracked in `TODO.md`; the JSON-LD reads them from `content/site.json`, so
   filling that file updates the structured data too.
4. **Lighthouse** was not run here (no headless Chrome in this environment). The
   build is static with ~117 kB first-load JS, modern image formats and no
   render-blocking third-party scripts, which is the right shape for 90+ on
   mobile — worth confirming on the deployed URL.
