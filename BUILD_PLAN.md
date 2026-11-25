# Pack Optical + Med Spa: Production Build Plan

For: Guru Datha Kandanathi Chittem, Automentai (builder)
Build in: VS Code with Claude Code
Source demo: pack-optical-website-redesign-demo.html (single file, about 4.9 MB, 11 views, design and content reference only, do NOT ship this file as the production site)
Date prepared: 2026-11-25
DEADLINE UPDATE (Guru, 2026-11-25): the website must be ready to SHARE with the client within 4 days, by Saturday, November 28, 2026. Follow 4_DAY_SPRINT.md until the share date, it compresses these phases to a client review staging site (Cloudflare Pages, noindex, not the live domain). This full plan resumes after the share for CMS, launch, and SEO growth.

## How Claude Code must use this file

Read this whole file before writing any code. Then work ONE phase at a time, in order.

Rules for every phase:
1. Do only the tasks in the current phase. Do not jump ahead.
2. At the end of a phase, run every test listed for that phase.
3. If any test fails, fix it inside the same phase. Never mark a phase done with a failing test.
4. Update PROGRESS.md after each phase: phase number, what was built, test results, date.
5. Make one git commit per phase with the message format: Phase N: short description
6. Keep all business facts exactly as written in the Facts section. Do not invent services, prices, doctors, hours, reviews, or offers.
7. Ask Guru before: changing a business fact, adding a paid service, collecting any patient health information, or publishing to the live domain.
8. Hosting rule from Guru: do NOT deploy this project to Vercel. Hosting is Cloudflare Pages (Phase 10).

## Facts: use exactly these everywhere

- Business: Pack Optical + Med Spa
- Tagline facts: family owned, since 1951, Fort Worth, Texas
- Address: 1217 Oak Knoll Drive, Fort Worth, TX 76117, United States
- Phone: 817-831-6141, tel link +18178316141
- Fax: 682-647-3909
- Email: office@packoptical.com
- Hours: Monday, Tuesday, Thursday 7:30 AM to 5:30 PM. Wednesday 8:30 AM to 5:30 PM. Friday, Saturday, Sunday closed. Confirm hours with the client before launch and update everywhere if they differ.
- Rating used in the demo: 4.8 stars, 441 Google reviews. Verify the live number before launch, never hard code a stale number in schema.
- People named in the demo: Dr. Joseph Pack (founder), Dr. Alisha Poonawala (Optometrist), Dr. Asaf Presente (Ophthalmologist). Confirm the full current team with the client in Phase 0.
- Areas served: Fort Worth, Haltom City, Saginaw, North Richland Hills, Keller, Watauga, Bedford, Euless, Hurst, Richland Hills
- Contact lens ordering: keep the existing external store link from the demo (MyCLStore order link). Do not rebuild ordering.
- Social: Facebook and Instagram links are in the demo head data. Reuse exactly those.
- Current live site: https://packoptical.com/ (WordPress). Production replaces it on the same domain.

## Locked tech stack

- Framework: Astro (latest stable), TypeScript strict mode
- Styling: Tailwind CSS, design tokens taken from the demo CSS variables (navy #0A2A4E, navy dark #071E38, gold #C29B40, gold bright #D9B45C, teal blue #1E56A8, ink #1B2A3A, muted #54687C)
- Fonts: Manrope for body, Montserrat for headings, loaded from Google Fonts with display swap, same as the demo
- CMS: Sanity (free tier), only for blog posts, offers, team members, hours, and FAQs, so store staff can edit without code
- Hosting and DNS: Cloudflare Pages + Cloudflare DNS, on an account the CLIENT owns. Free SSL. No Vercel.
- Forms: Cloudflare Turnstile for spam protection, submissions sent to office@packoptical.com through Resend. No database of form submissions.
- Booking: NO custom booking database. See Phase 5.
- Analytics: GA4 + Google Search Console, both on client owned accounts
- Testing: Vitest (unit), Playwright (end to end), axe-core via Playwright (accessibility), Lighthouse CI (performance and SEO)
- Package manager: npm. Node version pinned in .nvmrc.

Why this stack, in one line: the site is content and local search driven, so a static Astro site gives the fastest mobile pages, the best SEO scores, the lowest running cost, and the simplest handover.

## Global definition of done (applies to every page)

A page is done only when ALL of these are true:
- Real URL, no hash routes. The demo uses #/ routes, production must not.
- Exactly one H1. Title tag 50 to 60 characters with its target keyword and Fort Worth where relevant. Meta description 140 to 160 characters, unique per page.
- Canonical URL set to https://packoptical.com/ plus its own path.
- Open Graph and Twitter tags present, with a real image.
- Valid structured data for its type, tested in Phase 7.
- Name, address, phone identical to the Facts section, word for word.
- Mobile first, works at 360px wide with no horizontal scroll. Tap targets at least 44px.
- Images are WebP or AVIF, sized for their slot, with descriptive alt text, lazy loaded below the fold. No image over 200 KB.
- Lighthouse on mobile: Performance 95+, SEO 100, Accessibility 95+, Best Practices 95+. See Phase 7 for the gate.
- No console errors. No broken internal or external links.
- Keyboard navigable, visible focus state, colour contrast WCAG AA.

## Target searches and page map (the SEO core)

Main goal from Guru: when people in the Fort Worth area search for an optical store or optometrist, this site should appear at the top, in the map results and in the website results below them.

Build exactly these URLs, each mapped to one primary search:

| URL | Primary target search |
| --- | --- |
| / | optometrist Fort Worth, optical store Fort Worth |
| /our-practice/ | eye doctor Fort Worth, about Pack Optical |
| /services/ | eye care services Fort Worth |
| /services/comprehensive-eye-exams/ | eye exam Fort Worth (from demo service: adult-senior) |
| /services/childrens-eye-exams/ | kids eye exam Fort Worth, childrens eye doctor |
| /services/diabetic-eye-exams/ | diabetic eye exam Fort Worth |
| /services/contact-lens-fittings/ | contact lens fitting Fort Worth |
| /services/dry-eye-treatment/ | dry eye treatment Fort Worth, dry eye clinic |
| /services/ipl-treatment/ | IPL dry eye treatment Fort Worth |
| /services/emergency-eye-care/ | emergency eye doctor Fort Worth |
| /services/digital-eye-strain/ | digital eye strain help |
| /services/eye-disease-management/ | eye disease treatment Fort Worth |
| /services/laser-surgery-consultation/ | LASIK consultation Fort Worth |
| /services/aesthetics-med-spa/ | med spa Fort Worth, Morpheus8 Fort Worth |
| /eyewear/ | designer eyeglasses Fort Worth, frames |
| /patient-centre/ | patient information, insurance, eye quiz, frame finder |
| /offers/ | eyeglasses offers Fort Worth, childrens glasses plan |
| /blog/ and /blog/<slug>/ | one search per article, see Phase 4 |
| /visit/ | Pack Optical directions, optometrist 76117 |
| /book/ | book eye exam Fort Worth |
| /privacy/ and /terms/ | legal, no SEO target |

Area pages (Phase 6, only if content can be genuinely different per area, at least 600 unique words each, otherwise do not build them): /areas/haltom-city/, /areas/saginaw/, /areas/north-richland-hills/, /areas/keller/, /areas/watauga/

---

## Phase 0: Setup, audit, and content inventory

Tasks:
- Create the Git repo (client owned organisation or Guru account, decide with Guru and note it in PROGRESS.md). Branch model: main is production, dev is staging work.
- In VS Code, initialise the project folder, add this plan as BUILD_PLAN.md in the repo root, create PROGRESS.md, README.md, .gitignore, .nvmrc.
- Audit the demo file: extract every section, text block, image, service, offer, FAQ, team member, brand, review, and blog article into content/inventory.md. Nothing from the demo gets lost.
- Audit the current live WordPress site: list every existing URL, its title, and roughly its traffic value if known. Save as content/old-urls.csv. This drives the redirect map in Phase 10. Losing an old ranking URL without a redirect is the biggest SEO risk in this project.
- Confirm with the client (list for Guru to ask, do not guess): current team and photos, current hours, insurances accepted, current offers and prices, booking system they use today, who owns the domain and Google Business Profile.
- Keyword check: confirm the page map above against real search wording. Note any change in PROGRESS.md, do not silently change URLs later.
- Extract images from the demo file, save originals under assets-source/, log file name, where it is used, and alt text draft.

Tests and checks:
- Inventory covers all 11 demo views and all 11 demo services: adult-senior, aesthetics, childrens, contacts, diabetic, digital-strain, dry-eye, emergency, eye-disease, ipl, laser.
- old-urls.csv exists and has a row for every page found on the live site sitemap.
- Open questions for the client are written in PROGRESS.md, not left in chat.

Commit: Phase 0: setup, demo and live site audit, content inventory

## Phase 1: Foundation

Tasks:
- Scaffold Astro + TypeScript strict + Tailwind. Scripts in package.json: dev, build, preview, lint, check, test, test:e2e, test:a11y.
- Design tokens from the demo: colours, fonts, radius, shadow, spacing. One global CSS file, no copied demo style blocks per page.
- Shared layout: head component (meta, canonical, OG, schema slot), utility bar, header with the 8 main nav items from the demo, mobile menu, footer with NAP, hours, services links, areas links, legal links.
- Sticky mobile bottom bar from the demo: Call, Book, Chat.
- 404 page with search intent links and the phone number.
- Base components: Button, Card, SectionHeading, Stars, TrustBar, ReviewCard, FAQ (details based, like the demo), Breadcrumbs.
- Dark mode: the demo follows prefers-color-scheme. Keep that behaviour, test both modes in every later phase.

Tests and checks:
- npm run build passes with zero errors and zero TypeScript errors (astro check clean).
- Lint passes. Unit test setup runs (one sample Vitest test passing).
- Layout renders at 360, 768, 1280px with no horizontal scroll, in light and dark mode.
- Header nav, mobile menu open and close, and footer links all work with keyboard only.

Commit: Phase 1: Astro foundation, layout, design system

## Phase 2: Core pages

Tasks:
- Build these pages from the demo content, as real URLs: /, /our-practice/, /services/, /eyewear/, /patient-centre/, /offers/, /visit/, /privacy/, /terms/
- Home page order follows the demo: hero with slideshow, trust bar (since 1951, rating, frames count, services), services grid, dry eye teaser, aesthetics teaser, brands strip, reviews, hours and visit card, final call to action.
- Eyewear: all brands from the inventory, frame finder content from the demo patient tools where it fits.
- Patient Centre: insurance information, eye health quiz, frame shape guide, and patient tools from the demo, rebuilt as accessible Astro components. Quiz logic gets unit tests in Phase 7.
- Visit: address, hours table with today highlighted (demo behaviour), Google Maps embed, directions links for the areas served.
- Offers: every offer from the inventory with its real price and conditions, including the childrens glasses plan. No expired offers.

Tests and checks:
- Every core page passes the global definition of done.
- Content diff against inventory.md: no section missing, no text changed in meaning.
- Playwright smoke test: each core URL returns 200, has one H1, and its title contains its target keyword.
- Quiz and frame guide work end to end in a browser test, including keyboard use.

Commit: Phase 2: core pages

## Phase 3: Service pages

Tasks:
- Build all 11 service pages, one URL each from the page map, using one shared service layout: hero, what it is, who it is for, what happens at the appointment, benefits, FAQs, related services, booking call to action, review strip.
- Content source: the demo service detail data. Expand each page to at least 800 useful words without inventing medical claims. Every medical claim must come from the demo or be approved by the client (doctor review is a launch gate in Phase 9).
- Each service page gets its own FAQ set (minimum 4) marked up with FAQ schema in Phase 6.
- Internal linking rule: every service page links to /book/, /visit/, its 2 closest related services, and its area page if one exists. Home and /services/ link to every service page.

Tests and checks:
- All 11 URLs build and return 200. Playwright checks title, H1, FAQ rendering, and call to action on each.
- Word count and readability check script reports per page, none under target.
- No duplicate title, description, or H1 across service pages (automated check).
- Related service links resolve, zero broken links (link checker over the built site).

Commit: Phase 3: all service pages with SEO template

## Phase 4: Blog and CMS

Tasks:
- Connect Sanity. Schemas: Post (title, slug, excerpt, body, category, hero image, author, published date, target keyword, meta title, meta description), Offer, TeamMember, FAQ, SiteSettings (hours, phone, offers toggle).
- Migrate every blog article from the demo inventory (the demo references 39 articles, verify the real count in Phase 0 inventory and migrate all of them). Each article keeps a slug close to the old WordPress slug where one exists, for the redirect map.
- Blog index with search and category filter (demo behaviour), article pages with author, date, related articles, and a booking call to action.
- Pages in Phases 2 and 3 read offers, team, hours, and FAQs from Sanity where those types apply, with static fallback content so the site still builds if the CMS is down.
- Give Guru a one page CMS guide (docs/cms-guide.md): how staff edit hours, add an offer, publish a post, in plain language with screenshots placeholders.

Tests and checks:
- Create, edit, and publish a test post in Sanity staging, rebuild, confirm it appears with correct meta and schema. Then delete the test post.
- Editing hours in the CMS changes the footer, visit page, and schema consistently after a rebuild.
- Blog search and category filter covered by Playwright tests.
- Build still passes with the CMS API unreachable (fallback test: block the API in a test run).

Commit: Phase 4: Sanity CMS and blog migration

## Phase 5: Booking, forms, and chat

Tasks:
- Booking decision gate: DO NOT build a booking database and DO NOT collect health information on this website. In Phase 0, confirm the client booking system. Then /book/ works one of these ways, in this order of preference:
  1. Embed or link the client existing booking system.
  2. Link a HIPAA ready booking tool the client signs up for.
  3. Fallback only: a request form asking name, phone, preferred service, preferred day, and a note that the office will call to confirm. Label it Request an appointment, never Book, because nothing is confirmed.
- The demo 5 step booking flow can be kept as the front end look for option 3 only, and its final step must send the request, show a clear confirmation with a reference, and email office@packoptical.com. No patient history, symptoms detail, insurance numbers, or dates of birth in any field.
- Contact form: name, phone or email, message, Turnstile, sends to the office email through Resend. Auto reply to the patient with hours and phone.
- Chat widget: ship the demo rule based chat only (answers from site content: hours, location, services, booking link). Any AI chat from Automentai is a separate later project, not part of this build.
- Order Contacts button keeps linking to the existing external store.

Tests and checks:
- Playwright end to end: complete a booking request and a contact message in staging, confirm both emails arrive at the test inbox, confirmation screen and reference show, and validation errors work for missing name, bad phone, and bad email.
- Form abuse test: Turnstile blocks a scripted submit without a token.
- Privacy test: inspect every form field, confirm no field asks for health details, insurance ID, or date of birth.
- Phone and Book buttons work on mobile, tel link is correct on every page (automated check).

Commit: Phase 5: booking request flow, forms, chat

## Phase 6: Local SEO build

Tasks:
- Structured data, validated, per page type: Optometrist (LocalBusiness) on home with address, geo, hours, rating only if verified live, sameAs socials; Service schema on service pages; FAQPage on pages with FAQs; BlogPosting on articles; BreadcrumbList everywhere below home.
- Generate sitemap.xml (all pages, no legal duplicates issue, correct lastmod) and robots.txt allowing all, pointing to the sitemap, blocking nothing important.
- One canonical domain decision: https://packoptical.com/ with or without www, the other redirects to it. Apply in Cloudflare and in canonical tags consistently.
- Google Business Profile checklist (deliver as docs/gbp-checklist.md for Guru and the client, this is done outside the code): primary category Optometrist, secondary Optical store and Sunglass store if true, all services added with descriptions, hours matching the site exactly, attributes, real photos of storefront, interior, team and frames, products for key frame brands, Q and A seeded from the site FAQs, booking link pointing to /book/, website link with UTM for tracking.
- Citation checklist (docs/citations.md): Yelp, Facebook, Instagram, Apple Maps, Bing Places, Healthgrades, Zocdoc, WebMD directory if listed, local Fort Worth directories. Same name, address, phone everywhere, character for character.
- Review flow: a /review/ page that sends happy patients to the Google review link, plus a printable card text for the front desk. Never gate or filter reviews, only invite.
- Area pages from the page map, only the ones that pass the unique content rule. Each links its services and shows directions from that area.
- Internal linking audit pass and image alt text audit pass across the whole site.

Tests and checks:
- Every schema block validates in the Rich Results test or schema.org validator, results saved in docs/seo-validation/.
- Automated SEO test suite passes: title and description length and uniqueness, one H1, canonical present and self referencing, OG image present, sitemap lists every built page and nothing that 404s, robots.txt correct.
- NAP consistency test: a script greps the built site for the address and phone and fails on any variation.
- Search Console ready: verification meta or DNS method prepared, sitemap URL noted in PROGRESS.md.

Commit: Phase 6: local SEO, schema, GBP and citation checklists

## Phase 7: Testing (full pass, nothing ships below this bar)

Test suites to create and keep green from here on:
- Unit (Vitest): quiz scoring, frame guide logic, hours logic (today highlighting, open or closed now), form validation, Sanity fallback rendering, utility functions. Target: every logic function covered, no coverage number chasing.
- End to end (Playwright, Chromium, Firefox, WebKit, mobile viewport): home to service to book flow, contact form, blog search and filter, mobile menu, call and book buttons, 404 handling, cookie and privacy pages reachable from the footer.
- Accessibility (axe-core in Playwright, plus manual): zero critical and zero serious axe violations on every page template, full keyboard pass on home, service, blog and book, focus visible, contrast AA in light and dark mode, reduced motion respected (the demo hero animation must honour prefers-reduced-motion, as the demo CSS does).
- Performance (Lighthouse CI, mobile, throttled): gate is Performance 95+, SEO 100, Accessibility 95+, Best Practices 95+ on home, one service page, blog index, and one article. Fail the build discussion if a template misses, fix images, fonts, or scripts, do not accept a lower gate without Guru approval noted in PROGRESS.md.
- SEO tests: the Phase 6 automated suite, plus a broken link crawl of the whole built site (zero internal 404s), redirect map test (Phase 10 map, tested on staging), and a check that no production page is set to noindex by mistake.
- Visual regression: screenshot the 9 core templates at mobile and desktop in Phase 7, store baselines, and diff on later changes. Eyeball every diff, animations off for screenshots.
- Content proof test: spell check pass, a read through of every page against inventory.md, phone, hours, prices read out loud against the client confirmed facts.
- Security and headers (on staging): HTTPS only, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, no server or framework version leaks, Turnstile on all forms, dependencies scanned (npm audit, no critical).
- Cross device manual pass: one Android phone, one iPhone, one Windows laptop, one Mac, in Chrome, Safari, Edge, Firefox. Log device, browser, result in docs/qa-log.md.

Gate rule: Phase 8 starts only when every suite above is green or a failure has a written, Guru approved exception in PROGRESS.md.

Commit: Phase 7: full test suites and QA gate

## Phase 8: Performance and hardening

Tasks:
- Image pipeline: convert all extracted images to WebP with AVIF where it helps, responsive sizes, width and height set to stop layout shift, hero image preloaded, everything else lazy.
- Fonts: subset or preload the two display weights that matter, confirm no layout shift from font swap.
- Remove anything unused: unused Tailwind classes purge correctly, no leftover demo JavaScript, total home page transfer target under 1.5 MB on first load.
- Caching on Cloudflare: long cache for hashed assets, HTML revalidated, confirm in response headers.
- Error and uptime monitoring: Cloudflare analytics plus UptimeRobot free check on the home and book pages, alerts to Guru and the office email.
- Backup: repo is the source backup, Sanity dataset export steps written in docs/backup.md, tested once.

Tests and checks:
- Lighthouse gate from Phase 7 re-run and passing on the optimised build.
- Slow 4G manual test on a real phone: home usable in under 3 seconds.
- CLS, LCP, INP from Lighthouse and CrUX style checks recorded in docs/qa-log.md.

Commit: Phase 8: performance and hardening

## Phase 9: Staging review and client approval

Tasks:
- Deploy to a Cloudflare Pages staging URL (a pages.dev address, password or noindex protected so Google does not index staging).
- Client review round: Guru walks the client through staging on a call. Collect changes in docs/client-changes.md, one list, no side lists.
- Doctor review gate: a doctor at the practice approves all medical content, service descriptions, and any treatment claims. Written approval noted in PROGRESS.md. This gate cannot be skipped.
- Legal pages final: privacy policy covering forms and analytics, terms, accessibility statement. Client confirms the text.
- Apply client changes, re-run the full Phase 7 suites, update visual baselines only for approved changes.
- Train the client: 30 minute session on the CMS guide, Google Business Profile basics, and how reviews work. Notes in docs/training.md.

Tests and checks:
- Staging is noindexed and the production build is not (explicit check, this mix up is common and costly).
- Client change list is empty or every item is done and retested.
- Doctor and legal approvals recorded before Phase 10 begins.

Commit: Phase 9: staging, client and doctor approval

## Phase 10: Launch on packoptical.com

Tasks, in this order:
- Freeze content. Final full test run (Phase 7 suites) on the exact launch build.
- Redirect map: build Cloudflare redirect rules from content/old-urls.csv, every old WordPress URL goes 301 to its closest new page, home for anything with no match. No old URL may end at a 404 if it was ever indexed.
- Point DNS to Cloudflare Pages production, set the canonical www or non www rule, force HTTPS.
- Verify in this order: home, top 5 services, book flow live email delivery, contact form live email delivery, phone links, maps embed, order contacts link.
- Google Search Console: verify the domain, submit sitemap.xml, request indexing for home and the top 5 service pages.
- Google Business Profile: update the website link to the new site (with UTM), confirm hours, add the booking link, add fresh photos.
- GA4: confirm pageviews, call clicks, book clicks, and form submits are firing as events.
- Announce nothing publicly until the checks above pass.

Tests and checks (launch day checklist, all must pass):
- Old URL sample test: at least 30 old URLs from old-urls.csv tested, all return the right new page through one 301.
- No mixed content warnings, SSL valid, HSTS present.
- Lighthouse gate passes on the LIVE home and one live service page, not only staging.
- Forms tested live with a clearly marked TEST message, office confirms receipt.
- Sitemap live, robots live, canonicals point to the live domain, zero staging URLs anywhere in the built site (grep test).

Commit: Phase 10: launch. Tag the repo v1.0-launch

## Phase 11: First 90 days: SEO growth and reporting

Tasks:
- Weekly for month 1, then monthly: Search Console report, which target searches moved, which pages entered the top 10 and top 3, calls and bookings from GA4 and the Business Profile.
- Reviews rhythm: front desk asks every patient, Guru or the office replies to every new review within 2 working days.
- Content rhythm: 2 blog articles a month from the keyword list (seasonal eye care, school eye exams, dry eye in Texas heat and allergies, insurance use it or lose it in November and December), each written for one search, each linked to its service page.
- Business Profile rhythm: 1 post a week (offer, service spotlight, team photo), photos added monthly.
- Fix list from real data: pages with impressions but low clicks get title and description work, pages ranking 5 to 15 get content and internal link work first.
- Monthly one page report to the client (docs template in docs/monthly-report.md): rankings for the target searches, calls, bookings, reviews gained, work done, next month plan.
- 90 day review with the client: results against the goal of topping local searches, and the Automentai support and growth plan for the next quarter.

Tests and checks:
- Tracking still firing at day 30, 60, 90 (repeat the Phase 10 GA4 and Search Console checks).
- Ranking tracker holds the exact target search list from the page map, same list every report, no cherry picking.

Commit per report: Phase 11: SEO report YYYY-MM

---

## Risks written down, so nothing surprises the client

- Rankings are not instant and cannot be guaranteed by anyone. The site, Business Profile, and reviews work together and normally move over 4 to 12 weeks.
- The single biggest launch risk is losing old WordPress rankings. Phase 0 audit and Phase 10 redirects exist for exactly this.
- Medical content needs the doctor approval gate in Phase 9. Do not publish treatment claims without it.
- Never collect patient health information on this website. Booking and forms stay at request level only.
- The client owns the domain, hosting account, CMS, analytics, and Business Profile. Automentai builds and supports, the client can never be locked out of their own site.

## First session in VS Code: paste this to Claude Code

You are building the Pack Optical + Med Spa production website. Read BUILD_PLAN.md in this repo completely before doing anything. Confirm back to me: the locked stack, the hosting rule, the 12 phases (0 to 11, with Phase 7 as the testing gate), and the business facts. Then start Phase 0 only. Work one phase at a time, run the tests listed for the phase, update PROGRESS.md, and commit with the phase message format. Stop at the end of Phase 0 and show me the inventory, the old URL list, and the open questions for the client before starting Phase 1.
