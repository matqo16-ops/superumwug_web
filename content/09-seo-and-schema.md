# SEO metadata & structured data (JSON-LD) — per page

Where to paste (no code needed): open each page in the Studio editor → **Page Settings → SEO
(Basic)** for title/description/URL slug, and **SEO (Advanced) → Structured Data** for the
JSON-LD. hreflang tags are generated automatically once Multilingual is enabled (README.md step
6) — do not hand-add hreflang.

Replace `[TELEFON]`, `[E-MAIL]`, `[ADRESSE]`, `[FIRMENNAME]` placeholders in the JSON-LD once you
have real values (keep them consistent with `/impressum`).

Target keywords woven in below: *Umzug München, Entrümpelung München, Umzug mit Renovierung,
Haushaltsauflösung München, Hausverwaltung Handwerksservice München.*

---

## Site-wide LocalBusiness schema (paste on Home `/` page's Structured Data field)

```json
{
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "name": "Super Umzug",
  "alternateName": ["Super Entrümpelung"],
  "url": "https://www.superumzug.de/",
  "telephone": "[TELEFON]",
  "email": "[E-MAIL]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[STRASSE UND HAUSNUMMER]",
    "addressLocality": "München",
    "postalCode": "[PLZ]",
    "addressCountry": "DE"
  },
  "areaServed": {
    "@type": "City",
    "name": "München"
  },
  "sameAs": [
    "https://www.bayreno.de"
  ],
  "makesOffer": [
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Umzug München" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Entrümpelung München" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Haushaltsauflösung München" } }
  ]
}
```

---

## `/` Home

- **DE Title**: `Umzug, Entrümpelung & Renovierung München | Super Umzug`
- **DE Meta**: `Umzug mit Renovierung aus einer Hand: Super Umzug, Super Entrümpelung und BayReno in München. Unbeschädigt-Garantie mit voller Werterstattung. Jetzt Rückruf anfordern.`
- **EN Title**: `Moving, Clearance & Renovation in Munich | Super Umzug`
- **EN Meta**: `Moving with renovation from one team: Super Umzug, Super Entrümpelung and BayReno in Munich. Damage-free guarantee with full value compensation. Request a callback.`
- **Structured data**: use the site-wide `MovingCompany` JSON-LD above.

## `/umzug`

- **DE Title**: `Umzug München mit Unbeschädigt-Garantie | Super Umzug`
- **DE Meta**: `Privat- und Firmenumzüge in München: Verpackung, Montage, Transport. Unbeschädigt-Garantie mit voller Werterstattung im Schadensfall. Jetzt Rückruf anfordern.`
- **EN Title**: `Moving in Munich with a Damage-Free Guarantee | Super Umzug`
- **EN Meta**: `Private and corporate moves in Munich: packing, assembly, transport. Damage-free guarantee with full value compensation. Request a callback today.`
- **Structured data**:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Umzug München",
  "provider": { "@type": "MovingCompany", "name": "Super Umzug", "telephone": "[TELEFON]" },
  "areaServed": { "@type": "City", "name": "München" },
  "description": "Private und gewerbliche Umzüge in München mit Unbeschädigt-Garantie und voller Werterstattung im Schadensfall."
}
```

## `/entruempelung`

- **DE Title**: `Entrümpelung München & Haushaltsauflösung | Super Entrümpelung`
- **DE Meta**: `Entrümpelung München: Wohnungen, Häuser, Keller, Büros. Haushaltsauflösung, fachgerechte Entsorgung, besenreine Übergabe. Festpreisangebot anfordern.`
- **EN Title**: `Clearance & House Clearances in Munich | Super Entrümpelung`
- **EN Meta**: `Clearance in Munich: apartments, houses, cellars, offices. House clearances, proper disposal, broom-clean handover. Request a fixed-price quote.`
- **Structured data**:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Entrümpelung München",
  "provider": { "@type": "LocalBusiness", "name": "Super Entrümpelung", "telephone": "[TELEFON]" },
  "areaServed": { "@type": "City", "name": "München" },
  "description": "Entrümpelung und Haushaltsauflösung in München mit fachgerechter Entsorgung und besenreiner Übergabe."
}
```

## `/pakete`

- **DE Title**: `Leistungspakete: Umzug, Entrümpelung, Renovierung | Super Umzug`
- **DE Meta**: `Vier kombinierte Pakete für Firmenumzug, Vermieter, Immobilienkäufer und Hausverwaltungen. Umzug mit Renovierung aus einer Hand in München.`
- **EN Title**: `Bundle Packages: Moving, Clearance, Renovation | Super Umzug`
- **EN Meta**: `Four combined packages for corporate moves, landlords, property buyers and property managers. Moving with renovation from one team in Munich.`
- **Structured data**: `ItemList` of 4 `Service` entries (Firmenumzug Komplett, Rundum-Service für
  Vermieter, Besichtigungsservice, Full Service für Hausverwaltungen) — optional, low SEO value
  vs. effort; the per-service schema on `/umzug`/`/entruempelung` carries most of the weight.

## `/b2b`

- **DE Title**: `B2B & Partner: Umzug, Entrümpelung, Renovierung München`
- **DE Meta**: `Provision für Vermittler, Partnerpreise für Firmenkunden. Hausverwaltung Handwerksservice München — bevorzugte Terminplanung, fester Ansprechpartner.`
- **EN Title**: `B2B & Partners: Moving, Clearance, Renovation Munich`
- **EN Meta**: `Referral commission for partners, volume pricing for corporate clients. Property manager craft services Munich — priority scheduling, dedicated contact.`

## `/kontakt`

- **DE Title**: `Kontakt & Rückruf anfordern | Super Umzug München`
- **DE Meta**: `Rückruf anfordern oder direkt chatten: Super Umzug, Super Entrümpelung und BayReno in München und Umgebung.`
- **EN Title**: `Contact & Request a Callback | Super Umzug Munich`
- **EN Meta**: `Request a callback or chat directly: Super Umzug, Super Entrümpelung and BayReno in Munich and the surrounding area.`

## `/impressum`, `/datenschutz`

- Set `noindex` is **not** recommended (legal pages should stay indexable but low-priority);
  standard title `Impressum | Super Umzug` / `Datenschutz | Super Umzug` (EN: `Legal Notice` /
  `Privacy Policy`) is sufficient — no meta description needed beyond Wix's default.

---

## Image alt text pattern (apply throughout)

- Hero/service images: `[Brand] [Leistung] München — [kurze Beschreibung der Szene]`
  e.g. `Super Umzug Möbeltransport München — Umzugsteam trägt Umzugskartons in Lieferwagen`
- Logo images: `Super Umzug Logo`, `Super Entrümpelung Logo`, `BayReno Logo`
- EN equivalents: `Super Umzug furniture transport Munich — moving team carrying boxes into van`
