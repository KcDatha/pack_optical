# Staging setup pack (about 30 minutes)

Rules: Cloudflare Pages only, never Vercel. Use the CLIENT's Cloudflare account, never a personal or temporary one. Nothing in this pack has been run yet.

## 1. Cloudflare Pages project (client-owned account), 8 min
1. Log in to the client's Cloudflare account (add yourself as a member if needed).
2. Workers & Pages > Create > Pages > Connect to Git, pick this repo. (No Git host yet? Choose Direct Upload and use step 5 instead.)
3. Project name: `pack-optical-staging`. Build command: `npm run build:staging`. Output directory: `dist`. Node version variable: `NODE_VERSION=22`.
4. The pages.dev address is your staging URL. Write it in PROGRESS.md.

## 2. Resend (email), 8 min
1. Create a Resend account (free tier: 3,000 emails a month).
2. Domains > Add domain `packoptical.com` and add the DNS records Resend lists (SPF, DKIM). Whoever manages packoptical.com DNS must add them; this does not affect the website or existing email. Wait for "Verified".
3. API Keys > Create key (sending access). Copy it once.
4. Until the domain is verified you can test with the sender `onboarding@resend.dev`, but it only delivers to the email you signed up with.

## 3. Cloudflare Turnstile, 4 min
1. Cloudflare dashboard > Turnstile > Add widget. Name: Pack Optical. Hostnames: `packoptical.com`, `<project>.pages.dev` and `localhost`. Mode: Managed.
2. Copy the Site Key (public) and the Secret Key (private).
3. Never ship Cloudflare's test keys (1x0000...AA etc). A production build without a real key now prints a loud warning in the build log.

## 4. Environment variables in the Pages project (Settings > Variables and Secrets, Production and Preview), 4 min
| Name | Type | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | key from step 2 |
| `MAIL_TO` | Text | test inbox for staging (switch to office@packoptical.com at launch) |
| `MAIL_FROM` | Text | `Pack Optical <requests@packoptical.com>` (domain must be verified) |
| `TURNSTILE_SECRET` | Secret | secret key from step 3 |
| `PUBLIC_TURNSTILE_SITEKEY` | Text (build) | site key from step 3 |
| `PUBLIC_NOINDEX` | Text (build) | `1` for the staging project only. NEVER set it on production. |

## 5. Build and deploy, 3 min
Git-connected: push to the branch, Cloudflare builds with `npm run build:staging`.
Direct Upload / CLI (commands already in package.json):

    export CF_PAGES_PROJECT=pack-optical-staging
    npx wrangler login
    npm run deploy:staging     # build:staging + check:staging + wrangler pages deploy

`build:staging` adds noindex (meta tag and `X-Robots-Tag` header). `check:staging` fails if any page lacks noindex or if localhost/demo links or security headers are missing.

## 6. Live checks on the pages.dev URL, 10 min
1. Headers: `curl -sI https://<project>.pages.dev/ | grep -iE "x-robots|content-security|strict-transport|x-content-type|referrer|permissions"` (all six should appear).
2. Rich Results Test (search.google.com/test/rich-results) on `/` and `/services/dry-eye-treatment/`; save a screenshot in docs/seo-validation/.
3. One real form submission: send the request form on /book/ with your own email; confirm the office email and the patient auto reply arrive in the test inbox and the reference matches. Repeat once for the contact form on /patient-centre/.
4. Spam check: `curl -s -X POST https://<project>.pages.dev/api/request -d '{}'` must return an error and send no mail.
5. Phone tap test: on a real phone, open home, a service page and /book/; tap Call, tap Book with Weave and Book with Moxie, try the request form, open the chat.
6. Confirm the yellow "pending doctor review" banner shows on service pages.

## Production later (Phase 10, only after client approval)
Do not set PUBLIC_NOINDEX, use a real Turnstile key, set MAIL_TO to office@packoptical.com, add the custom domain and the 301 map from content/old-urls.csv.
