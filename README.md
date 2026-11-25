# Pack Optical + Med Spa website

Marketing site for Pack Optical + Med Spa (Fort Worth, TX). Built with Astro (static), TypeScript and Tailwind 4. Hosted on Cloudflare Pages.

Status: client-review staging build. Not live. Service page copy is drafted and **pending doctor review** (a banner on those pages says so).

## Quick start

Requires Node 22.

```bash
npm install
npm run dev          # http://localhost:4321
```

Newer Astro runs `dev` and `preview` as background daemons. Stop them with `npx astro dev stop` and `npx astro preview stop`. A stale daemon on port 4321 can give false test results.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` (62 files: 61 pages plus the 404) |
| `npm run preview` | Serve the build |
| `npm run check` | `astro check` (TypeScript) |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (chromium, webkit, Pixel 7, iPhone 14) |
| `npm run test:a11y` | axe accessibility tests |
| `bash scripts/gate.sh [runs]` | **Full regression gate.** Run this before every commit. `runs` is the Lighthouse run count (default 1) |
| `npm run build:staging` | Build with `PUBLIC_NOINDEX=1` (noindex meta plus `X-Robots-Tag`) |

The gate runs: build, `astro check`, lint, Vitest, link check, SEO suite, content audit, facts check, CSP check, Playwright and Lighthouse on five pages. Bar: no failures, Lighthouse 100 on accessibility, best practices and SEO, and Performance 98 or higher.

## Project layout

```
src/
  pages/          index, our-practice, eyewear, offers, visit, patient-centre,
                  book, privacy, terms, 404, services/[slug], blog/[slug]
  components/     Header, Footer, Chat, SmsConsent, ...
  data/           site.ts (all business facts), services.ts, aesthetics.ts, consent.ts
  lib/            schema.ts (JSON-LD), chat.ts, tools.ts, forms.ts, hours.ts, blog.ts
  styles/global.css
functions/        Cloudflare Pages Functions: /api/request and /api/contact
public/           _headers (CSP etc.), robots.txt, logo.svg, favicon, blog images
scripts/          gate.sh and the individual checks
tests/            unit (Vitest) and e2e (Playwright)
content/          inventory and raw exports from the old WordPress site
docs/             staging deploy guide, QA log, client open items, GBP checklist
```

## Rules to keep

- **Business facts live in one place:** [src/data/site.ts](src/data/site.ts) (address, phone, hours, booking and order URLs). Do not hard-code them in pages. The facts check fails if pages disagree.
- **No invented content.** Copy comes from the live site or is marked as a draft pending review.
- **No health data in forms.** The forms are for contact and appointment requests only.
- **Booking:** eye care goes to Weave, aesthetics goes to Moxie (`SITE.weaveUrl`, `SITE.moxieUrl`).
- **Google rating:** the review stars and `aggregateRating` stay hidden until `RATING_VERIFIED` in `site.ts` is set to `true` after checking the live Google rating.
- Keep the review-pending banner until the doctor approves the service pages.

## Forms and email

Forms post to Cloudflare Pages Functions in [functions/](functions/). They check a Turnstile token and a honeypot, validate the input, then send email through the Resend HTTP API (not SMTP). Required environment variables (`RESEND_API_KEY`, `MAIL_TO`, `MAIL_FROM`, `TURNSTILE_SECRET`, `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_NOINDEX`) are listed in [docs/staging-deploy.md](docs/staging-deploy.md). Never ship Cloudflare's Turnstile test keys. A production build with a missing or test key prints a warning.

## Deploying to staging

Follow [docs/staging-deploy.md](docs/staging-deploy.md). It needs a **client-owned** Cloudflare account (no personal or temporary accounts), a Resend account with a verified domain, and real Turnstile keys. `PUBLIC_NOINDEX=1` is for the staging project only and must never be set on production.

## Still open

- Real email delivery, live Turnstile and the staging deploy have **not been tested**. They need the accounts above.
- Firefox testing is skipped by decision ([DECISIONS.md](DECISIONS.md)).
- Doctor approval of the 11 service pages, final privacy and terms text, photo consent for the gallery images, the Presente photo, and the full team list. See [docs/open-items-for-client.md](docs/open-items-for-client.md).

## More docs

- [BUILD_PLAN.md](BUILD_PLAN.md) and [4_DAY_SPRINT.md](4_DAY_SPRINT.md): scope and plan
- [PROGRESS.md](PROGRESS.md): what was built, in order
- [DECISIONS.md](DECISIONS.md): recorded decisions
- [docs/qa-log.md](docs/qa-log.md): QA results
