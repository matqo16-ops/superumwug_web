# Deploying mmoving.de

This is a standard Next.js 15 (App Router) app — deploy it to **Vercel** and point the
`mmoving.de` domain at it. Follow the steps in order. Everything marked 🔑 is an environment
variable you'll collect along the way and paste into Vercel in Step 3.

**What you'll set up:** GitHub repo → Vercel project → Neon Postgres (chat logging) → Anthropic
API key (chatbot) → Resend (callback emails) → admin login → custom domain + DNS.

Estimated time: ~30 minutes. Free tiers cover everything except domain registration.

---

## 1. Push the code to GitHub

From the project folder:

```bash
git remote add origin https://github.com/<your-user>/superumzug-web.git
git push -u origin main
```

(If you don't have a repo yet: create an empty one at github.com/new — no README — then run the
two commands above with its URL.)

---

## 2. Import the project into Vercel

1. Go to **vercel.com → Add New… → Project**.
2. **Import** the GitHub repo you just pushed. Authorize Vercel for GitHub if prompted.
3. Vercel auto-detects Next.js. Leave the defaults:
   - Framework preset: **Next.js**
   - Build command: `next build` (default)
   - Output: (managed by Vercel)
4. **Don't deploy yet** — click **Environment Variables** first and add the ones from Step 3
   below (or deploy now and add them after; you'll redeploy once at the end regardless).

---

## 3. Environment variables

Add these under **Project → Settings → Environment Variables** (apply to **Production**, and to
**Preview** if you want the branch previews fully functional). A local `.env.example` lists the
same set for reference.

| Variable | Where it comes from |
|---|---|
| 🔑 `DATABASE_URL` | Neon — Step 4 |
| 🔑 `ANTHROPIC_API_KEY` | Anthropic Console — Step 5 |
| 🔑 `RESEND_API_KEY` | Resend — Step 6 |
| 🔑 `CALLBACK_TO_EMAIL` | Your team inbox — Step 6 |
| 🔑 `CALLBACK_FROM_EMAIL` | *(optional)* verified sender — Step 6 |
| 🔑 `ADMIN_USER` | You choose — Step 7 |
| 🔑 `ADMIN_PASSWORD` | You choose (use a strong password) — Step 7 |
| 🔑 `NEXT_PUBLIC_SITE_URL` | `https://mmoving.de` (set once the domain is live) |

Every variable is optional for the build to succeed — the site degrades gracefully if one is
missing (see `TODO.md` §B) — but you'll want them all set for the live site.

---

## 4. Neon Postgres for chat logging (via Vercel Marketplace)

The chatbot stores each conversation (session id, timestamp, language, page, full transcript) in
a free-tier Neon Postgres database, viewable at `/admin/chats`.

1. In your Vercel project, open the **Storage** tab → **Create Database** (or **Marketplace →
   Neon**). Choose **Neon (Serverless Postgres)**.
2. Pick a **region close to your users** — for GDPR comfort choose an EU region (e.g. **Frankfurt**).
   Note the region: it goes in the Datenschutz `[DB-REGION]` placeholder (`TODO.md` §A3).
3. Accept the free plan and connect it to this project. Vercel automatically injects the
   connection string as **`DATABASE_URL`** (and some `POSTGRES_*` aliases) into your project's
   environment — you don't have to copy it by hand.
4. **Create the table.** Run the migration once, locally, pointing at the Neon database:
   ```bash
   # copy the connection string from Vercel → Storage → Neon → .env.local tab
   # (Windows PowerShell)
   $env:DATABASE_URL = "postgres://…"; npm run migrate
   # (macOS/Linux)
   DATABASE_URL="postgres://…" npm run migrate
   ```
   You should see `Migration complete: chat_conversations is ready.` The script is idempotent —
   safe to re-run.

> The schema is one table, `chat_conversations` — see `scripts/migrate.mjs`. Transcripts upsert by
> session id, so a conversation appears as a single growing row.

---

## 5. Anthropic API key for the chatbot (with a spending limit)

1. Go to **console.anthropic.com → Settings → API Keys → Create Key**. Copy it into
   🔑 `ANTHROPIC_API_KEY`.
2. **Set a spending limit** so costs can't run away: **Settings → Billing → Usage limits** (or
   "Spend limits"). Set a low monthly cap — e.g. **$5–$10/month**. The chatbot runs on
   `claude-haiku-4-5` with a 512-token reply cap, per-IP rate limiting and a capped history, so
   real-world cost is a few cents per hundred conversations; the limit is just a safety net.
3. The model id is pinned in code (`lib/chat.ts`); no configuration needed.

> If you skip this step, the chat widget simply shows an "assistant currently unavailable —
> request a callback" message and the callback path still works.

---

## 6. Resend for callback-form emails

The callback form is the site's only form; submissions are emailed to you (no database — the
email is the record).

1. Sign up at **resend.com** (free tier: 100 emails/day, 3,000/month — ample).
2. **API Keys → Create API Key** → copy into 🔑 `RESEND_API_KEY`.
3. Set 🔑 `CALLBACK_TO_EMAIL` to the inbox that should receive callback requests (e.g.
   `anfragen@mmoving.de` or any address you check).
4. **Sender address (recommended):** by default emails are sent from Resend's shared
   `onboarding@resend.dev`, which works immediately but may land in spam. To send from your own
   domain: in Resend, **Domains → Add Domain** (`mmoving.de`), add the DKIM/SPF records Resend
   shows you to your DNS, then set 🔑 `CALLBACK_FROM_EMAIL` to something like
   `mmoving.de <website@mmoving.de>`.

---

## 7. Admin login for `/admin/chats`

The chat-log dashboard is protected by HTTP Basic Auth (enforced in `middleware.ts`).

- Set 🔑 `ADMIN_USER` (e.g. `admin`) and 🔑 `ADMIN_PASSWORD` (a strong, unique password).
- Visit `https://mmoving.de/admin/chats` and enter them when the browser prompts.
- `/admin` is `noindex` (via header + metadata + robots.txt) and excluded from the sitemap.

---

## 8. Deploy

If you added the env vars before the first deploy, Vercel has already built. Otherwise trigger a
redeploy: **Deployments → ⋯ → Redeploy** (or just push any commit). Confirm the build succeeds and
open the `*.vercel.app` URL to smoke-test:

- Home, all subpages, `/en/…` — render in the right language
- Callback form submits (check the target inbox arrives)
- Chat widget answers (if `ANTHROPIC_API_KEY` set)
- `/admin/chats` prompts for the login and lists conversations

---

## 9. Point the mmoving.de domain at Vercel

1. In Vercel: **Project → Settings → Domains → Add** → enter `mmoving.de`. Add `www.mmoving.de`
   too; Vercel will offer to redirect one to the other — the site's canonical URLs use the **bare
   domain** (matching the logo), so set **`mmoving.de` as primary** and let `www` redirect to it.
2. Vercel shows the exact DNS records to create. At your **domain registrar / DNS provider**, set:

   | Type | Name / Host | Value | Purpose |
   |---|---|---|---|
   | `A` | `@` (apex `mmoving.de`) | `76.76.21.21` | Points the apex at Vercel |
   | `CNAME` | `www` | `cname.vercel-dns.com` | Points `www` at Vercel (redirects to the apex) |

   > Use the values **Vercel shows you** if they differ — Vercel occasionally updates the target
   > IP/CNAME. The apex `A` record and the `www` `CNAME` are the two you need. Delete any old
   > `A`/`AAAA`/`CNAME` records for `@` and `www` that point elsewhere (e.g. a previous host).

   If your DNS provider supports `ALIAS`/`ANAME` at the apex, you may use that pointing to
   `cname.vercel-dns.com` instead of the `A` record.

3. Back in Vercel, wait for the domain to verify (DNS can take minutes to a few hours). Vercel
   issues the TLS certificate automatically once DNS resolves.
4. Set 🔑 `NEXT_PUBLIC_SITE_URL` to `https://mmoving.de` and redeploy so canonical tags,
   `hreflang`, `sitemap.xml` and `robots.txt` use the real domain.

### DKIM/SPF (only if you set up a custom email sender in Step 6)

If you added `mmoving.de` as a Resend sending domain, also add the DKIM `TXT`/`CNAME` and SPF
`TXT` records Resend generates (they'll be in the Resend Domains page). These are separate from
the two Vercel records above.

---

## 10. Post-launch

- **Submit the sitemap** to Google Search Console: `https://mmoving.de/sitemap.xml`.
- **Fill in the placeholders** — see `TODO.md`. Especially the Impressum and Datenschutz fields
  (an incomplete Impressum is a legal risk in Germany) and the chatbot price table.
- **Editing copy later:** change the relevant file under `content/`, commit, push — Vercel
  redeploys automatically. No code changes needed for text edits.
- **Reviewing chats:** `/admin/chats` — filter by date/language, read transcripts, and watch the
  "frequent topics" tally to spot recurring questions worth adding to the FAQ or homepage.

---

## Local development (reference)

```bash
npm install
cp .env.example .env.local   # fill in the values you have
npm run dev                  # http://localhost:3000
npm run build                # production build
npm test                     # vitest suite (API routes, validation, rate limit, topics)
npm run migrate              # create the chat table (needs DATABASE_URL)
```
