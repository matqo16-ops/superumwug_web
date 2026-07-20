# TODO — everything left before this site can go live

## A. Content placeholders to fill in (grep source: `content/*.md`)

### Contact details (used repeatedly — header, footer, lightbox, /kontakt, /impressum, /datenschutz, SEO JSON-LD)
- `[TELEFON]` / `[PHONE]` — main phone number. Appears in: `content/00-global.md` (header
  button context, footer, lightbox error message), `content/06-kontakt.md`,
  `content/07-impressum.md`, `content/08-datenschutz.md`, `content/09-seo-and-schema.md`.
- `[E-MAIL]` / `[EMAIL]` — main contact email. Appears in: `content/06-kontakt.md`,
  `content/07-impressum.md`, `content/08-datenschutz.md`, `content/09-seo-and-schema.md`.
- `[ADRESSE]` / `[ADDRESS]` — street, postal code, city. Appears in: `content/06-kontakt.md`
  (as full address), `content/07-impressum.md` (split into `[STRASSE UND HAUSNUMMER]` /
  `[STREET AND NUMBER]` and `[PLZ UND ORT]` / `[POSTAL CODE AND CITY]`),
  `content/09-seo-and-schema.md` (JSON-LD `streetAddress`/`postalCode`).
- `[ERREICHBARKEITSZEITEN]` / `[AVAILABILITY HOURS]` — business hours, `content/06-kontakt.md`.

### Legal entity / Impressum (`content/07-impressum.md`)
- `[FIRMENNAME, vollständige Rechtsform]` / `[COMPANY NAME, full legal form]` — e.g. "Super
  Umzug GmbH" (used 3 times: provider block, trademark note, and mirrored in
  `content/09-seo-and-schema.md` JSON-LD).
- `[NAME DES GESCHÄFTSFÜHRERS/DER GESCHÄFTSFÜHRER]` / `[NAME OF MANAGING DIRECTOR(S)]`
- `[REGISTERGERICHT]` / `[REGISTER COURT]`
- `[HRB-NUMMER]` / `[HRB NUMBER]`
- `[USt-IdNr.]` / `[VAT ID]`
- `[NAME UND SITZ DES VERSICHERERS, GELTUNGSRAUM]` / `[INSURER NAME AND LOCATION, SCOPE OF
  COVERAGE]` — only needed if you carry a named liability/transport insurance you want to cite.
- Dispute resolution board: `[ODER: ANGABEN ZUR ZUSTÄNDIGEN SCHLICHTUNGSSTELLE]` — only if you
  do participate in consumer arbitration (default text says you don't).

### Datenschutz / Privacy (`content/08-datenschutz.md`)
- `[FIRMENNAME, RECHTSFORM, ANSCHRIFT]` / `[COMPANY NAME, LEGAL FORM, ADDRESS]` — controller
  block, should match Impressum exactly.
- `[LÖSCHFRIST]` / `[RETENTION PERIOD]` — how long `CallbackRequests` entries are kept (suggest
  12 months after the request is closed, but this is a business/legal decision, not mine).
- `[TOOLS BENENNEN]` — name whichever analytics/cookie tools you actually enable in Wix
  (Settings → Cookies & Analytics) — must match what's really running, not a guess.
- `[NAME PROVIDER]` — your chosen chatbot provider name (SiteGPT / Chatbase / other).
- `[LINK ZUR DATENSCHUTZERKLÄRUNG DES CHATBOT-ANBIETERS]` / `[LINK TO CHATBOT PROVIDER'S
  PRIVACY POLICY]` — the provider's own privacy policy URL.
- `[ZUSTÄNDIGE AUFSICHTSBEHÖRDE]` / `[COMPETENT SUPERVISORY AUTHORITY]` — likely the Bavarian
  DPA (Bayerisches Landesamt für Datenschutzaufsicht) if the business is Bavaria-based — confirm.
- `[DATUM DER LETZTEN AKTUALISIERUNG]` / `[DATE OF LAST UPDATE]` — set when you publish.

### Damage-guarantee fine print (`content/02-umzug.md`)
- `[PLATZHALTER RECHTLICHER TEXT/VERSICHERUNGSBEDINGUNGEN]` / `[PLACEHOLDER LEGAL TEXT/
  INSURANCE TERMS]` — the exact terms/exclusions of the Unbeschädigt-Garantie. This is the
  flagship promise of the whole site — get this reviewed by whoever underwrites the guarantee
  (insurer or internal policy) before publishing, since it's a binding customer-facing claim.

### Pricing & B2B rates (`chatbot-knowledge-base.md`, section 6 table + inline `[PRICE]` markers
in sections 3 and 4)
- Every `[PRICE]` placeholder: private/corporate move pricing, clearance pricing, all 4 package
  prices, B2B referral commission rate, B2B corporate discount rate. Until filled in, the
  chatbot must not invent numbers (rule is already written into the knowledge base doc).

### SEO / structured data (`content/09-seo-and-schema.md`)
- `[TELEFON]`, `[E-MAIL]`, `[STRASSE UND HAUSNUMMER]`, `[PLZ]`, `[FIRMENNAME]` inside the
  JSON-LD blocks — same values as Impressum/Kontakt, keep them identical across the site for
  consistency (search engines and the LocalBusiness schema cross-check this).

## B. Manual dashboard/editor steps (cannot be done from code — see README.md for click-by-click)

- [ ] Connect this repo via Dev Mode → Git Integration
- [ ] Create the 8 pages with the exact slugs in README.md §2, build sections/elements per
      `content/*.md`, set the Element IDs each page-code template expects
- [ ] Create Studio Design/Theme colors & fonts per `DESIGN-GUIDE.md`
- [ ] Create the `CallbackRequests` collection with the exact fields/permissions in README.md §3
- [ ] Set up the Automations email notification in README.md §4
- [ ] Get a chatbot embed snippet (SiteGPT/Chatbase/etc.) and paste it into Settings → Custom
      Code per README.md §5; configure the provider's own fallback message per README.md §7
- [ ] Enable Multilingual (DE default, EN added) per README.md §6, paste the EN copy already
      written in each `content/*.md` file
- [ ] Upload the three logo files (already in this project folder as PNGs) into the header,
      footer, and brand-card image slots
- [ ] Add a Google Maps element on `/kontakt` centered on Munich
- [ ] Connect your custom domain (Settings → Domains) once ready to go live — I did not touch
      DNS/domain settings; that's account-specific and needs to happen in your Wix dashboard

## C. Not filled in intentionally (business decisions, not missing research)

- Exact damage-guarantee exclusions and claim deadline — legal/insurance decision
- Retention periods, supervisory authority — should be confirmed with whoever handles compliance
- All prices/commission rates — pricing strategy, not something to guess at
