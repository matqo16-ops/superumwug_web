# Global content — Header, Footer, Nav, Chatbot CTA banner, Callback lightbox

Paste into the corresponding Studio elements. This content appears identically on every page
(header/footer are global sections in Studio, so you only need to set this once).

---

## Header — Brand blocks (3 cards)

**DE**

1. **Super Umzug** — *Ihr Umzug in München — sicher, pünktlich, unbeschädigt garantiert.*
   Link: `/umzug`
2. **Super Entrümpelung** — *Entrümpelung & Haushaltsauflösung — schnell, sauber, fair.*
   Link: `/entruempelung`
3. **BayReno** — *Bayerische Renovierung — Handwerk mit Termintreue.*
   Link: `https://www.bayreno.de` — **open in new tab** (Link settings → Web Address → check
   "Open in new tab")

**EN**

1. **Super Umzug** — *Your move in Munich — safe, on time, damage-free guaranteed.*
   Link: `/umzug`
2. **Super Entrümpelung** — *Clearance & house clearances — fast, clean, fair.*
   Link: `/entruempelung`
3. **BayReno** — *Bavarian renovation — craftsmanship you can schedule around.*
   Link: `https://www.bayreno.de` — open in new tab

## Header — Nav labels

**DE**: Start · Umzug · Entrümpelung · Pakete · B2B/Partner · Kontakt
**EN**: Home · Moving · Clearance · Packages · B2B/Partners · Contact

## Header — Persistent button

**DE**: `Rückruf anfordern` (opens Callback lightbox)
**EN**: `Request a callback`

## Header — Language switcher

DE / EN toggle, standard Wix Multilingual language menu (no custom copy needed — configured in
Dashboard → Settings → Multilingual, see README.md step 6).

---

## Chatbot CTA banner (place near top or bottom of every page — one consistent section)

**DE**
- Eyebrow: `Sofort-Auskunft`
- Headline: `Fragen zu Preisen und Konditionen?`
- Body: `Unser Assistent antwortet sofort — rund um die Uhr, ohne Warteschleife. Fragen Sie nach Preisen, Terminen, der Unbeschädigt-Garantie oder unseren Paketen.`
- Button: `Chat starten` (calls `openChatbot()`, see `src/public/chatbot.js`)
- Secondary link: `Lieber zurückgerufen werden?` → opens Callback lightbox

**EN**
- Eyebrow: `Instant answers`
- Headline: `Questions about pricing and terms?`
- Body: `Our assistant answers immediately — around the clock, no waiting. Ask about pricing, availability, our damage guarantee, or our bundle packages.`
- Button: `Start chat`
- Secondary link: `Prefer a callback?` → opens Callback lightbox

---

## Footer

**DE**
- Brand column 1: **Super Umzug** — Umzüge für Privat & Gewerbe · [Link `/umzug`]
- Brand column 2: **Super Entrümpelung** — Entrümpelung & Haushaltsauflösung · [Link `/entruempelung`]
- Brand column 3: **BayReno** — Bayerische Renovierung · [Link `https://www.bayreno.de`, new tab]
- Service area: `Einsatzgebiet: München und Umgebung`
- Phone: `[TELEFON]`
- Callback link: `Rückruf anfordern` → opens Callback lightbox
- Legal links: `Impressum` (`/impressum`) · `Datenschutz` (`/datenschutz`)
- Copyright: `© 2026 Super Umzug · Super Entrümpelung · BayReno. Alle Rechte vorbehalten.`

**EN**
- Brand column 1: **Super Umzug** — Moving for private & commercial clients
- Brand column 2: **Super Entrümpelung** — Clearance & house clearances
- Brand column 3: **BayReno** — Bavarian renovation
- Service area: `Service area: Munich and surroundings`
- Phone: `[TELEFON]`
- Callback link: `Request a callback`
- Legal links: `Legal Notice` (`/impressum`) · `Privacy Policy` (`/datenschutz`)
- Copyright: `© 2026 Super Umzug · Super Entrümpelung · BayReno. All rights reserved.`

---

## Callback lightbox (`CallbackLightbox`) — quick request, reachable from header/footer everywhere

**DE**
- Title: `Rückruf anfordern`
- Subtext: `Hinterlassen Sie uns kurz Ihre Daten — wir rufen Sie zum gewünschten Zeitpunkt zurück.`
- Field labels: `Name` · `Telefonnummer` · `Wunschzeit` (e.g. dropdown: Vormittags / Nachmittags / Abends) · `Worum geht es?` (dropdown: Umzug / Entrümpelung / Paket 1: Firmenumzug Komplett / Paket 2: Rundum-Service für Vermieter / Paket 3: Besichtigungsservice / Paket 4: Full Service für Hausverwaltungen / B2B-Partnerschaft / Sonstiges)
- Consent checkbox: `Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage gemäß der Datenschutzerklärung gespeichert und verarbeitet werden.`
- Submit button: `Rückruf anfordern`
- Success message: `Danke! Wir melden uns in Kürze bei Ihnen.`
- Error message: `Da ist etwas schiefgelaufen. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns direkt an: [TELEFON].`

**EN**
- Title: `Request a callback`
- Subtext: `Leave us your details — we'll call you back at the time you prefer.`
- Field labels: `Name` · `Phone number` · `Preferred time` (Morning / Afternoon / Evening) · `What is this about?` (Moving / Clearance / Package 1: Corporate Move Complete / Package 2: Full-Service for Landlords / Package 3: Inspection Service / Package 4: Full Service for Property Managers / B2B partnership / Other)
- Consent checkbox: `I agree that my details will be stored and processed to handle my request, in line with the Privacy Policy.`
- Submit button: `Request callback`
- Success message: `Thank you! We'll be in touch shortly.`
- Error message: `Something went wrong. Please check your details or call us directly: [TELEFON].`
