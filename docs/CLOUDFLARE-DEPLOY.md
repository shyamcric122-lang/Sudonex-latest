# Sudonex → Cloudflare Pages migration

The `cloudflare` branch is 100% Cloudflare-ready. The whole site is a **static
export** (`out/`) plus **one Cloudflare Pages Function** for the contact form
(`functions/api/contact.js`, using Resend instead of SMTP). Vercel is untouched
and stays live until you cut DNS over.

Backups (2026-09-30): `backups/sudonex-2026-09-30/` — full git bundle of the
deployed branch + static mirror of all 121 live pages.

## Build settings (Cloudflare Pages)
- **Framework preset:** None
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/`
- **Node version:** 20 (set env `NODE_VERSION=20`, or `.nvmrc` is already in repo)
- Functions in `functions/` are picked up automatically (no config needed).

## Environment variables (Pages → Settings → Variables — set for BOTH Production and Preview)
- `RESEND_API_KEY` = your Resend key (`re_...`)  ← REQUIRED for the contact form
- `CONTACT_TO` = `sudonexofficial@gmail.com` (optional; this is the default)
- `CONTACT_FROM` = `Sudonex Contact <onboarding@resend.dev>` for testing.
  After you verify sudonex.com in Resend, change to `Sudonex <noreply@sudonex.com>`.
- `NODE_VERSION` = `20`

### Resend setup (5 min)
1. Create a free account at resend.com (3,000 emails/mo free).
2. Create an API key → put it in `RESEND_API_KEY`.
3. (For sending from your own domain) Add domain `sudonex.com` in Resend and add
   the DKIM/SPF records it shows to your DNS. Until then, `onboarding@resend.dev`
   works but only delivers to the Resend account owner's email.

## PHASE 1 — stand up in parallel (no risk to live site)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the `shyamcric122-lang/Sudonex-latest` repo.
3. Set **Production branch = `cloudflare`**, build command `npm run build`,
   output dir `out`. Add the env vars above. Deploy.
4. You get `sudonex-latest.pages.dev`. Test: browse pages, submit the contact
   form (check the inbox), open `/sitemap.xml` and `/robots.txt`.

## PHASE 2 — go live (DNS cutover; do only after Phase 1 passes)
1. Bring the latest content in: merge `main` into `cloudflare` (the daily 5 AM
   routine keeps publishing to `main`), or just switch the production branch to
   `main` **after** merging the `cloudflare` changes into `main`.
   Recommended final state: merge `cloudflare` → `main`, set Pages production
   branch = `main`, so the daily routine keeps auto-deploying to Cloudflare.
2. Pages project → **Custom domains** → add `www.sudonex.com` and `sudonex.com`.
3. DNS:
   - If sudonex.com's DNS is already on Cloudflare: Pages adds the CNAME records
     automatically — just confirm, and remove the old Vercel A/CNAME records.
   - If DNS is NOT on Cloudflare yet: add the site to Cloudflare, switch the
     registrar's nameservers to the ones Cloudflare gives you, then add the
     custom domains.
4. Verify https://www.sudonex.com serves from Cloudflare (check response headers
   for `cf-ray`), the form sends, sitemap/robots load.
5. Only then retire Vercel (pause the project or remove its domain).

## What changed on this branch vs Vercel/main
- `next.config.js`: enabled `output: 'export'`.
- Removed `app/api/contact/route.ts` (nodemailer/SMTP — can't run on Workers).
- Added `functions/api/contact.js` (Resend HTTP API; same request/response shape).
- `ContactForm.tsx` / `ContactModal.tsx`: POST `/api/contact` (no trailing slash,
  so it hits the Function directly).
- `app/robots.ts` & `app/sitemap.ts`: added `export const dynamic = 'force-static'`
  (required by static export).
- Added `.nvmrc` (20), `public/_redirects` (fix 2 known /guide/ 404s),
  `public/_headers` (asset caching + security headers).

## Note on the daily SEO routine
It pushes to `main` and runs `npx next build --webpack` — still works with
`output: 'export'`. After Phase 2 (Pages building from `main`), each daily push
auto-deploys to Cloudflare exactly like it did to Vercel. No routine change needed.
