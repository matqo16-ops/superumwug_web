# mmoving.de

Production website for three Munich brands under one roof — **Super Umzug** (moving),
**Super Entrümpelung** (clearance) and **BayReno** (renovation, external). Next.js 15 (App
Router) + TypeScript + Tailwind CSS v4, deployable to Vercel.

- **Bilingual** — German primary at `/…`, English at `/en/…` (next-intl, localized slugs,
  `hreflang`). German is the canonical default; no auto-redirect.
- **All copy lives in `content/`** — edit JSON/Markdown and redeploy; nothing is hardcoded in
  components. `content/de` + `content/en` per page, `content/site.json` for shared business data,
  `content/chatbot-knowledge-base.md` for the assistant.
- **Custom Claude chatbot** — floating widget → `POST /api/chat` streams `claude-haiku-4-5`,
  grounded only in the knowledge base, transcripts logged to Neon Postgres, reviewable at
  `/admin/chats` (HTTP Basic Auth).
- **German voice interface** — speech-to-text and read-aloud via the browser-native Web Speech
  API (no paid vendor, no API key). The mic button renders live frequency bars from the real
  microphone amplitude; Firefox degrades to text-only with a notice.
- **Projects gallery** — folder cards previewing before/after, expanding to an embedded viewer
  that shows every photo of the folder at once, plus a highlighted "Meet the crew" folder.
- **Callback form** — the only form → `POST /api/callback` → Resend email (zod-validated,
  honeypot + rate-limited). No database; the email is the record.
- **Static-first** — every page prerenders; only the two API routes and the admin area are
  dynamic.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
```

`npm run build` · `npm test` (vitest) · `npm run migrate` (create the chat table; needs `DATABASE_URL`).

## Deployment & configuration

- **[DEPLOY.md](DEPLOY.md)** — GitHub → Vercel, Neon + Anthropic + Resend setup, custom domain & DNS.
- **[TODO.md](TODO.md)** — every remaining `[PLACEHOLDER]` and the required environment variables.

## Layout

```
app/(site)/[locale]/   Localized pages (home, umzug, bayreno, entruempelung, pakete, b2b, kontakt, legal)
app/(admin)/admin/     Chat-log dashboard (Basic Auth, noindex)
app/api/{callback,chat} Route handlers
components/             Reusable section/card/UI + callback modal + chat widget
content/{de,en}/       All page copy (JSON) · site.json · chatbot-knowledge-base.md
public/projects/       Project galleries (one folder per project) + crew photos
i18n/                  next-intl routing, navigation, request config
lib/                   content loader, seo, schemas, email, db, rate-limit, chat helpers
scripts/migrate.mjs    Neon schema migration
tests/                 vitest: API routes (mocked), validation, rate limit, topic tally
```

Design tokens (deep navy + anthracite, restrained gold accent, Fraunces display / Inter body) are
defined once in `app/globals.css` and consumed through the shared `Section`, `Hero`, `Faq` and card
components.
