# PROGRESS

## Day 1: Wed 2026-11-25 — Foundation and home page (sprint)
Built: Phase 0 (inventory, old URLs), Phase 1 (Astro 6/TS strict/Tailwind 4, Vitest, Playwright, axe, Lighthouse CI), home page, header, mobile menu, footer, sticky Call/Book/Chat bar, 404, image pipeline (astro:assets, WebP, sized srcset).

Daily Gate: build clean, astro check 0 errors, lint clean, Vitest 5/5, Playwright 11 pass (chromium + mobile), axe zero critical/serious light+dark, link check: 0 broken except 25 links to pages due Day 2/3.
Lighthouse mobile, home (3 runs): Performance 98/100/100, Accessibility 97, Best Practices 100, SEO 100, LCP 1.7s, CLS <=0.08.

### Content findings (affects later days)
- Inventory: 11 views, 11 services, 20 brands, 39 blog posts, 3 offers, 4 team, 12 insurers, 7 FAQs, 14 images. See content/inventory.md.
- Each demo service has only ~150 words and NO FAQs. Day 2 needs 4+ FAQs and BUILD_PLAN wants 800 words; under scope freeze (no invention) these must come from demo text or be flagged as doctor-approval pending. Decision needed.
- The 39 blog posts are excerpts only (about 30 words); no full bodies in the demo. Full text must come from live WordPress.
- Dr. Asaf Presente has no photo (demo uses initials placeholder). Demo eyewear page URL differs from plan (/brands/frames-lenses/ on old site).
- old-urls.csv: 60 URLs from the live sitemap; new_url column still to be mapped (Phase 10).
- Chat button in mobile bar currently links to /book/#chat; real rule-based chat is Day 3.
- Schema omits aggregateRating on purpose (verify live rating first). 4.8/441 shown as text per demo.
- Client confirmation questions not yet sent (Guru action, Scope Freeze rule 2).

### Open items for Guru
1. Send client questions (team, hours, insurers, offers, booking system).
2. Decide Day 2 service-page depth (see above).
3. Create the Cloudflare account/project (client owned) before Day 4.

## Day 2: Thu 2026-11-26 — All pages exist (sprint)
Built: /our-practice/, /services/, /eyewear/, /patient-centre/ (insurance checker, dry eye quiz, frame guide, first-visit guide), /offers/, /visit/ (hours with today highlighted, map, directions, 7 FAQs), /privacy/ (with accessibility statement), /terms/, and a shared service template with all 11 service pages. 21 URLs total including home and 404.

Service pages: dry eye perfected first, then all 10 others generated from the same template and `src/data/services.ts`. Each has intro, what it is, who it's for, appointment steps, expectations, benefits, accordions, 5 FAQs (FAQPage schema), Service + BreadcrumbList schema, links to Book, Visit and 2 related services, review strip.

### DRAFT CONTENT, PENDING DOCTOR REVIEW (Guru decision, 2026-11-26)
The demo has ~150 words and no FAQs per service. Per Guru's decision, the gap was filled with draft text (appointment steps, benefit lists, extra "what it is" paragraphs, 5 FAQs per service, shared "Planning your visit" block) drawn from the demo facts and general patient education. Nothing was added about prices, outcomes or guarantees beyond the demo. Every service page is flagged `reviewPending`: staging builds (PUBLIC_NOINDEX=1) show a banner on those pages. BUILD_PLAN Phase 9 doctor approval is required before launch, and the banner must be removed once approved (src/pages/services/[slug].astro, `reviewPending`).
Also pending client confirmation: /privacy/ and /terms/ text (carried over from the demo, short; accessibility statement is on /privacy/).

### Daily Gate
- build clean, astro check 0 errors, lint clean, Vitest 11/11
- Playwright 117 pass (chromium + mobile pixel): smoke on all 21 URLs, service FAQ/CTA/links/schema, quiz/frame guide/insurance (keyboard), axe zero critical/serious on 10 templates in light and dark
- Link check: 0 broken; 5 links to /book/ and /blog/ (Day 3)
- Content audit (scripts/audit-content.mjs): one H1, titles 50-60, descriptions 140-160, no duplicate title/description/H1, all service pages 831-935 words (target 800)
- Lighthouse mobile: home 96-98 perf, dry eye 100, patient centre 100, services 99; accessibility 95-97; best practices 100; SEO 100. Day 4 needs 95+ everywhere (met so far).

### Notes
- Service template word counts include the shared "Planning your visit" block (about 130 words).
- /visit/ map is a Google Maps iframe (lazy). No cookies set by us.
- Dr. Presente still uses an initials placeholder (no photo in demo).
- Quiz is a screening aid; page states it is not a diagnosis.

## Day 3: Fri 2026-11-27 — Blog, booking, forms, chat, SEO inside the site (sprint)

### Blog: 39 of 39 articles migrated with FULL text
Source: the live WordPress REST API (public, client's own content). Imported by `scripts/import-posts.mjs` into `src/content/blog/*.md` (Astro content collection, fields match the Sanity Post schema: title, slug, excerpt, category, author, publishedAt, heroImage, targetKeyword, metaTitle, metaDescription, relatedService). Raw dump kept in `content/wp-posts-raw.json`.
- Article length 400-1243 words (avg 514). Unmigrated slugs: none.
- Findings: the demo's 39-post list was partly wrong. 5 demo titles (the "-2024", "-checklist", "-guide", "-parent-edition", "-overview" variants) do not exist on the live site; 5 live posts were missing from the demo (warning signs of diabetic retinopathy, blue light, vision therapy for adults, 4 things for the new year, can you reverse diabetic retinopathy). The site now matches the live 39. Dates are the live WordPress dates.
- 6 inline images downloaded and converted to WebP in `public/blog/`. 2 inline images were dead (404) on the live site and were dropped (ipl-rf article, eye-exam-frequency article).
- Internal links inside articles were rewritten to the new URLs; old booking-system links (4patientcare, PatientNow) now point to /book/.
- Categories: the live site has 33 of 39 posts "Uncategorized". For a usable filter I assigned topical categories by keyword (Dry Eye, Eye Health, Eye Exams, Contacts & Myopia, Vision Therapy, Aesthetics). Author shows "Pack Optical team" (WordPress user names are staff logins). Both are easy to change in the .md files.
- Article URLs are /blog/<slug>/ but the OLD site served them at /<slug>/. Redirects are required in Phase 10. `content/old-urls.csv` now has a new_url for all 60 old URLs.
- Blog index has search and category filter (Playwright tested). Article template: author, date, related articles (3), booking CTA to the related service, BlogPosting + Breadcrumb schema.

### Booking, forms, chat
- /book/ is "Request an appointment" (client has not confirmed a booking system; open item). Fields: service, preferred day, preferred time, name, phone, optional email, new/existing. No health details. Sends to office@packoptical.com via Resend through a Cloudflare Pages Function (`functions/api/request.ts`), optional email copy to the patient, reference like PACK-ABC234, confirmation screen worded as a request, not a booking.
- Contact form is on /patient-centre/ (`functions/api/contact.ts`), with auto reply to the patient if they give an email.
- Turnstile on both forms, honeypot field, server-side validation.
- Rule-based chat (`src/lib/chat.ts`), answers only from site content, emergency words route to the phone, fallback is the phone number. Desktop button plus mobile bar "Ask Pack".

### !! NOT yet verified: real email delivery and live Turnstile
No Resend key, mail domain, or Turnstile keys exist yet, so delivery to a test inbox could not be tested. What IS tested: handler logic with mocked Resend and Turnstile (validation, Turnstile block without token, failed Turnstile, honeypot, office email + auto reply payloads, misconfiguration, send failure) and the browser flow with a mocked API. Needed from Guru before Day 4 testing:
1. Cloudflare Pages project (client owned). Env vars: RESEND_API_KEY, MAIL_TO, MAIL_FROM (a sending domain verified in Resend), TURNSTILE_SECRET, and build-time PUBLIC_TURNSTILE_SITEKEY.
2. A test inbox. Until PUBLIC_TURNSTILE_SITEKEY is set, forms use Cloudflare's always-pass TEST key. That must never ship live.

### SEO inside the site
- Schema: Optometrist (home; aggregateRating deliberately omitted until the live rating is verified), Service + FAQPage + BreadcrumbList on services, FAQPage on /visit/, BlogPosting + BreadcrumbList on articles, BreadcrumbList on every non-home page.
- sitemap-index.xml + sitemap-0.xml list all 61 built pages (lastmod set), robots.txt allows all and points to the sitemap, canonicals are self-referencing on https://packoptical.com (no www decision needed yet: Cloudflare redirect rule in Phase 10), OG/Twitter image on every page (default exam photo; per-page images are a post-share improvement).
- `scripts/seo-check.mjs` (canonical, OG, JSON-LD validity and required fields, sitemap vs built pages, robots, NAP, tel links, noindex flag) passes: 0 failures on production build, and `EXPECT_NOINDEX=1` passes on a `PUBLIC_NOINDEX=1` staging build. Report: docs/seo-validation/report.md. NOT yet run through Google's Rich Results Test (needs a public URL; list in docs/seo-validation/README.md).
- NAP fixes found by the script: header said "Oak Knoll Dr" (now Drive), Patient Centre said "Dr", form placeholder looked like a phone number.
- docs/gbp-checklist.md and docs/citations.md written. The live Business Profile was not touched.
- public/_headers added (nosniff, referrer, permissions, HSTS, frame, immutable cache for assets). CSP is a Day 4 item.

### Daily Gate
build clean, astro check 0, lint clean, Vitest 32/32, Playwright 154 pass (chromium + mobile; 2 mobile-only tests skipped on desktop), axe zero critical/serious on 13 templates in light and dark, link check 62 pages 0 broken, content audit all clear, seo-check 0 failures.
Lighthouse mobile: home 99/97/100/100, dry eye 100/95/100/100, blog index 100/96/100/100, article 100/96/100/100, book 100/96/100/100 (perf/a11y/best practices/SEO). Day 4 gate needs Accessibility 95+ everywhere: dry eye is at 95, no margin.

## Day 4: Sat 2026-11-28 — Essential testing gate and staging prep (sprint)
Full results in docs/qa-log.md. Summary: lint, astro check, 32 unit tests, 320 Playwright tests (Chromium, WebKit, Pixel 7, iPhone 14), axe 0 critical/serious on 13 templates in light and dark, keyboard pass, Lighthouse CI median 100/100/100/100 on home, dry eye, blog index and an article, 0 broken links of 3,396, SEO suite 0 failures, facts check 0 issues, npm audit 0, CSP clean on 7 pages. All pass.

Fixes made by the gate: footer link tap targets (accessibility), moved font loading and the chat greeting off inline scripts so a strict CSP works (no `unsafe-inline` for scripts), US spellings, added CSP + security headers (`public/_headers`), staging build with noindex meta and `X-Robots-Tag` header (`npm run build:staging`, `npm run check:staging`), `deploy:staging` script, Lighthouse CI config with the 95/95/95/100 gate.

### NOT DONE, blocked outside the codebase (so the share has NOT happened)
1. Firefox skipped by Guru's decision (DEC-20251125-002); it could not be tested on this Mac (Playwright's Firefox does not launch on macOS 27.2). WebKit and Chromium engines pass.
2. Staging was NOT deployed. wrangler is not logged in, and there is no client-owned Cloudflare Pages project or credentials. Steps: docs/staging-deploy.md. I did not use a temporary/anonymous Cloudflare account because that would publish the client site outside the client's account.
3. Real email delivery and live Turnstile are untested (no Resend/Turnstile credentials). Forms use the Cloudflare TEST site key until PUBLIC_TURNSTILE_SITEKEY is set.
4. Response headers on the real pages.dev URL, Rich Results Test, real-phone check and Guru's walkthrough all need the live staging URL.
5. Staging URL and share date: to be recorded here once deployed.

### Deferred to the post-share list
Sanity CMS switch-on, doctor approval of the 11 service pages (banner removal), final privacy/terms text, area pages, per-page OG images, /review/ page, Phase 10 launch (301 redirects from content/old-urls.csv, DNS, Search Console, Business Profile), Firefox test pass, Dr. Presente photo, aggregateRating in schema after live verification, GA4.
Client message and open items note: docs/open-items-for-client.md (share message text is in 4_DAY_SPRINT.md).
