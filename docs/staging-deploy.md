# Staging deploy (Cloudflare Pages, client-owned account)

Hosting rule: Cloudflare Pages only. Never Vercel.

## One-time setup (client's Cloudflare account)
1. Create a Pages project (Direct Upload, or connect the Git repo). Project name example: `pack-optical-staging`. The pages.dev address becomes the staging URL.
2. Project > Settings > Variables and Secrets (Production and Preview):
   - Secrets: `RESEND_API_KEY`, `TURNSTILE_SECRET`
   - Plain: `MAIL_TO` (test inbox for staging, office@packoptical.com only at launch), `MAIL_FROM` (an address on a domain verified in Resend)
   - Build variable: `PUBLIC_TURNSTILE_SITEKEY` (real site key from Cloudflare Turnstile, allowed hostnames: the pages.dev host and packoptical.com)
3. Turnstile: create a widget, copy site key and secret.
4. Resend: verify the sending domain (SPF/DKIM), create an API key.

## Deploy
    export CF_PAGES_PROJECT=pack-optical-staging
    npx wrangler login            # once, as an owner/member of the client account
    npm run deploy:staging        # builds with PUBLIC_NOINDEX=1, runs the staging checks, uploads dist/

`deploy:staging` runs `build:staging` (noindex meta on every page + `X-Robots-Tag: noindex, nofollow` header) and `check:staging` (fails on any missing noindex, localhost or demo reference, or missing security headers) before uploading.

## After deploy: checks to run against the live pages.dev URL
- `curl -sI https://<project>.pages.dev/ | grep -iE "x-robots|content-security|strict-transport|x-content-type|referrer|permissions"`
- View source: `<meta name="robots" content="noindex, nofollow">`; production build must NOT have it (`npm run build` then `node scripts/seo-check.mjs` fails on any noindex).
- Submit the booking form and the contact form with real values; confirm both emails reach the test inbox, the patient auto reply arrives, and the reference matches.
- Try a scripted POST without a token: `curl -s -X POST https://<project>.pages.dev/api/request -d '{}'` must not send mail (422 or 403).
- Run the Rich Results Test on the URLs in docs/seo-validation/README.md.
- Remove the "pending doctor review" banner only after written doctor approval (see PROGRESS.md).

## Production (Phase 10, only after client approval)
Build without PUBLIC_NOINDEX, add the custom domain, add the 301 map from content/old-urls.csv, set the www/non-www redirect, then run `npm run seo`, `npm run links`, `npm run lhci` against the live URL.
