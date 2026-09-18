# SEO / GEO roadmap — mmoving.de

Working backlog. Updated 2026-09-18 after an eight-lens audit council
(technical, content, keywords, 2× GEO, pricing, competitors, local/entity) and
a strategist whose plan was attacked by a compliance critic and an impact
critic. Update this file as items ship.

## Where we stand, honestly

The site is not broken. It is new (live since August), has almost no
reputation signals (10 Google ratings, 1 with text, against competitors with
140–900+), and its business appears under different names, addresses and
phone numbers across old listings and the owner's other domains. Those three
things — not code — cap rankings today. Page building cannot substitute for
reviews and consistent listings; it can make sure every visitor who does
arrive finds the answer and a phone number.

Corrected bet (the August version overstated two flanks):

- **Published prices** — contested for Umzug (6 of 13 Munich movers publish
  figures), still open for Entrümpelung and Renovierung. The edge for moving
  is depth: full brutto tables, calculators with a crawlable matrix, worked
  examples, HGB liability, the Halteverbot facts.
- **District pages** — some competitors have them; ours are deeper
  (Parklizenz, access, building stock, per-district facts).
- **AI-retrieval layer** — still uncontested: llms.txt with generated page
  lists, IndexNow on every deploy, entity facts stated once and consistently.
- **Germering** — the one place the business is physically in town, against
  templated pages from companies based elsewhere. Highest-probability win.

## Shipped (18 Sep 2026)

Crawl: /de/* 308s; English pages own their sitemap `<loc>`; no hreflang Link
header; switcher links unprefixed URLs; asset-extension 404s instead of 500s;
*.vercel.app noindex; IndexNow runs from a GitHub Action on every production
deploy.

Pages: /umzugskosten-rechner, /entruempelung-kosten-rechner (SSR matrix,
numbers parsed from the tables); /umzug-germering, /entruempelung-germering
(sourced local facts); /haushaltsaufloesung-muenchen (LeistungPage template,
old blog URL 308s to it).

Content: footer links every guide, district and Germering page; Google-profile
name/address/phone visible on every page; tap-to-call bar on phones and phone
links in page bodies; district titles and hand-written descriptions; honest
blog dates; claims aligned with the AGB; KVR → Mobilitätsreferat; real fleet
(3.5 t vans); price statements consistent with the tables (test-enforced);
neutral attribution of the market-value tables; chatbot has contact facts.

## Next — buildable without the owner

1. **Kellerentrümpelung** and **Seniorenumzug** pages on the LeistungPage
   template (own process, own FAQ, a slice of a published table; no Pflegekasse
   promises).
2. **District pages**: a district-specific worked example built only from
   table rows, symmetric neighbour links, a verified "Stand" date.
3. **/llms-full.txt**: static concatenation of page content.
4. Hygiene: link contrast on light backgrounds, home stat-strip markup,
   permanent redirects for German slugs under /en.
5. **Western corridor** (Landkreis Fürstenfeldbruck) — one page with real
   per-town substance, only after the Germering pages are indexed.
6. **Möbel entsorgen München** (DE+EN) decision page; English no-parking guide.

## Blocked on the owner

Decisions (each unlocks work): which domain owns moving searches (mmoving.de
vs superumzug.de); whether the tables may be called the business's own guide
prices (unlocks priced Offer schema and stronger AI attribution); the primary
phone number; the Handwerksrolle question for painting/tiling/flooring (gates
a "Maler München" page); combined-job savings figure (15–25 % vs 20–35 % is
stated in different places); the 4-room clearance row; the Komplettservice
2.400 € example; helper/storage/carton/long-distance prices; which address and
email every listing uses.

Actions: make this repository private; share Search Console; confirm callback
emails arrive; Google review link to every customer after the invoice (no
gating, no incentives); put the review link in `content/site.json` as
`googleReviewUrl` (activates /bewertung); Bing Webmaster Tools + Bing Places;
link bayreno.de to mmoving.de; make old listings (golocal, Das Telefonbuch)
match the Google profile; free directory profiles.

## Explicitly rejected

A separate /preise silo (the calculators and cost articles cover the intent);
new head-term URLs; per-district cost pages; town pages for distant towns;
clearance district pages that only swap the service word; markdown mirrors;
priced Offer schema for market-value tables; any new price, guarantee,
response time or savings figure not already consistent in the repo; review
markup before 20 real Google reviews; Google Analytics (consent banner).

## Measurement

Low organic clicks in the first months are expected; for a local mover most
early enquiries arrive as calls and route requests from the Google profile.
Track monthly: GBP Insights (calls, directions, website clicks), callback
submissions per week, Vercel Analytics referrers from chatgpt.com,
perplexity.ai and copilot.microsoft.com, Search Console non-brand clicks per
cluster, and a manual 12-prompt check in ChatGPT, Perplexity, Copilot, Gemini
and Claude ("bestes Umzugsunternehmen München", "Umzug Germering",
"Halteverbotszone München Kosten", "Haushaltsauflösung München Kosten",
"English speaking movers Munich", …) noting whether the business is named.

Honest range, non-brand organic clicks per day: 0–5 in October, 5–20 by
December, 15–50 by March (upper half only with ~30 text reviews, the domain
question settled and 5–8 directory profiles), 30–120 at 12 months.

**Every January:** update "2026" in the titles of the cost articles and
calculators (content/de/blog/*kosten*.md, content/de/rechner.json).
