# Pack Optical + Med Spa: 4 Day Sprint to a Shareable Website

For: Guru Datha Kandanathi Chittem, Automentai
Build in: VS Code with Claude Code
Companion file: BUILD_PLAN.md (full phases 0 to 11). This sprint compresses that plan to the share date. Where this file and BUILD_PLAN.md differ, this file wins until the share date, then BUILD_PLAN.md takes over again.
Start: Wednesday, November 25, 2026
SHARE DATE: Saturday, November 28, 2026, evening. Sunday, November 29 is buffer only, for fixes, never for new features.
Note: Thursday, November 26 is Thanksgiving. Plan it as a short, async day: set Claude Code running on clear tasks, review results in short passes.

## What share means on November 28

Share means a client review website, not the final public launch.

Ready to share:
- A live staging link on Cloudflare Pages (a pages.dev address), protected from Google indexing with noindex, so it cannot hurt SEO before launch.
- Every page built as a real URL, looking finished, with the real demo content and real business facts.
- Booking request flow, contact form, call buttons, and chat working end to end in staging.
- SEO structure already inside the site: titles, descriptions, canonicals, schema, sitemap, robots.
- The essential testing gate passed (see Day 4). No known broken page, broken link, or failing core flow.

NOT part of the share, and the client should be told these come after approval:
- Going live on packoptical.com (DNS switch, 301 redirects from the old WordPress site, Search Console and Business Profile updates). That is Phase 10 in BUILD_PLAN.md and happens only after the client approves staging.
- Sanity CMS editing. For the sprint, content lives in Astro content files with the same fields Sanity will use, so staff editing is switched on after the share without changing any URL or design.
- Area pages, the full blog back catalogue beyond what Day 3 covers, and any AI chat. All deferred, none of them block sharing.

Hosting rule from Guru still applies: do NOT use Vercel for this project, not even for staging. Cloudflare Pages only.

## Scope freeze (this is how 4 days stays perfect)

1. Content comes only from the demo file and the Facts section of BUILD_PLAN.md. Nothing invented.
2. Send the client confirmation questions on Day 1 morning (team, hours, insurances, offers, booking system). If answers do not come back during the sprint, build with the demo facts and list every assumed fact in a short Open Items note that goes to the client with the share link. Do not stall the build waiting.
3. No new page, section, or feature after Day 2 ends. Requests after that go on the post share list.
4. One design, the demo design. No redesign discussions during the sprint.
5. Every evening ends with the Daily Gate below. A day is not done until its gate is green.

Daily Gate (run every evening, about 30 minutes):
- npm run build clean, astro check clean, lint clean
- Unit tests green
- Playwright smoke test green for every URL built so far (200, one H1, title present)
- No broken internal links in the pages built so far
- Quick Lighthouse mobile check on the home page: Performance 90+ during the sprint, 95+ required on Day 4
- PROGRESS.md updated, one git commit for the day minimum, pushed

---

## Day 1: Wednesday, November 25: Foundation and home page

Maps to BUILD_PLAN phases 0, 1, and the start of 2.

Morning:
- Send the client confirmation questions (see Scope Freeze rule 2). Timebox: 20 minutes, then build.
- Phase 0, timeboxed to 2 hours: extract the demo into content/inventory.md (all 11 views, all 11 services, offers, FAQs, team, brands, reviews, blog list). Save the old WordPress sitemap URL list to content/old-urls.csv. Claude Code does the extraction, Guru spot checks services and offers only.
- Scaffold: Astro, TypeScript strict, Tailwind, test tooling (Vitest, Playwright, axe, Lighthouse CI) installed and sample tests passing.
- Repo, PROGRESS.md, .nvmrc, scripts, all per BUILD_PLAN Phase 1.

Afternoon and evening:
- Design tokens, global CSS, shared layout, header, mobile menu, footer, sticky mobile Call Book Chat bar, 404 page.
- Home page complete, following the demo order exactly.
- Extract and optimise the home page images first (WebP, sized, alt text). Set the image pipeline now so later pages reuse it.

Day 1 done when: Daily Gate green, and the home page on a phone looks like the demo and scores Lighthouse Performance 90+.

Claude Code prompt for Day 1:
Read BUILD_PLAN.md and 4_DAY_SPRINT.md. Today is Day 1 of the sprint. Do Phase 0 timeboxed (inventory and old URL list), then Phase 1, then the home page from Phase 2. Run the Daily Gate from 4_DAY_SPRINT.md at the end, update PROGRESS.md, commit as Day 1, and stop. Report the inventory count, any missing demo content, and the home page Lighthouse scores.

## Day 2: Thursday, November 26 (Thanksgiving, short day): All pages exist

Maps to BUILD_PLAN phases 2 and 3.

Plan the day as two focused Claude Code runs with Guru reviewing between them.

Run 1: Finish the core pages: /our-practice/, /services/, /eyewear/, /patient-centre/, /offers/, /visit/, /privacy/, /terms/. Patient tools (eye quiz, frame guide) built with their logic unit tested.
Run 2: Build the shared service page template first and get ONE service page perfect against the global definition of done in BUILD_PLAN.md (dry eye, it is the flagship). Then, and only then, generate the other 10 service pages from the template and the inventory content: comprehensive exams, childrens, diabetic, contacts, IPL, emergency, digital strain, eye disease, laser consultation, aesthetics.

Rules for Run 2: no duplicate titles or descriptions, every page links to Book, Visit, and 2 related services, minimum 4 FAQs per service page from the demo content.

Day 2 done when: Daily Gate green across every URL, all 20 sprint URLs return 200, and the scope freeze starts. Nothing new gets added after today.

Claude Code prompt for Day 2:
Read BUILD_PLAN.md and 4_DAY_SPRINT.md. Today is Day 2. Finish Phase 2 core pages, then build the service template, perfect the dry eye page against the definition of done, then build the other 10 service pages from that template. Run the Daily Gate, update PROGRESS.md, commit as Day 2, and stop. Report any page under the word count target or with duplicate meta.

## Day 3: Friday, November 27: Blog, booking, forms, SEO inside the site

Maps to BUILD_PLAN phases 4 (lite), 5, and 6 (site side only).

Morning: Blog, sprint version.
- Blog index with search and category filter, article template with author, date, related articles, booking call to action.
- Articles as Astro content collections using the exact Sanity field shape from BUILD_PLAN Phase 4, so the later CMS move changes nothing visible.
- Migrate the articles in this order: top service linked articles first, then the rest, until the afternoon starts. Whatever is not migrated goes on the post share list with its slug saved, it does not block sharing. Never publish a half migrated article.

Afternoon: Booking, forms, chat (BUILD_PLAN Phase 5, unchanged).
- If the client confirmed a booking system on Day 1 or 2, connect it. Otherwise ship the Request an appointment flow: demo look, name, phone, service, preferred day, sends to office@packoptical.com, confirmation screen with reference. No health details in any field.
- Contact form with Turnstile, auto reply, tested end to end in staging.
- Rule based chat from site content only.

Evening: SEO inside the site (BUILD_PLAN Phase 6, site side).
- Schema per page type, sitemap.xml, robots.txt, canonical domain set, OG images.
- NAP consistency script run and passing.
- Google Business Profile and citations checklists written to docs/ (docs/gbp-checklist.md, docs/citations.md). These are documents for after approval, do not change the live profile during the sprint.

Day 3 done when: Daily Gate green, booking and contact emails arrive at the test inbox, every schema block validates, and the sitemap lists every built page.

Claude Code prompt for Day 3:
Read BUILD_PLAN.md and 4_DAY_SPRINT.md. Today is Day 3. Build the blog in sprint form (content collections, Sanity field shape), then Phase 5 booking request flow, contact form and rule based chat, then the site side of Phase 6 SEO. Run the Daily Gate plus the Phase 5 and Phase 6 test lists, update PROGRESS.md, commit as Day 3, and stop. Report migrated article count, unmigrated slugs, and all form test results.

## Day 4: Saturday, November 28: Testing gate, staging, share

Maps to BUILD_PLAN phases 7 (essential gate), 8 (quick wins only), and 9 (staging only).

Morning: Essential testing gate. Nothing ships unless this passes.
- Full Playwright run: Chromium, Firefox, WebKit, mobile viewport. Home to service to book, contact form, blog search and filter, mobile menu, call and book buttons, 404.
- Accessibility: axe on every template, zero critical and zero serious. Manual keyboard pass on home, service, blog, book. Light and dark mode contrast check.
- Lighthouse CI gate on home, one service page, blog index, one article: Performance 95+, SEO 100, Accessibility 95+, Best Practices 95+.
- Broken link crawl of the whole built site: zero internal 404s.
- Content proof: phone, hours, prices, team read against the client facts and the Open Items list. Spell check pass.
- Security headers check on staging, npm audit no critical, Turnstile live on both forms.
- Real phone check: one Android or iPhone, home, one service, book flow, in Chrome and Safari.

Afternoon: Fix buffer, then staging.
- Fix only what the morning gate found. Re run the failing suite after every fix. No new features, no design changes beyond fixes.
- Deploy to Cloudflare Pages staging (pages.dev address), confirm noindex is ON for staging and would be OFF for production, confirm the staging URL is the only URL in the build (no localhost, no demo links).
- Final staging walkthrough by Guru, top to bottom, on his phone.

Evening: Share.
- Send the client the staging link with the share message below and the Open Items note.
- Note the share date and the exact staging URL in PROGRESS.md and in memory for Guru.

Claude Code prompt for Day 4:
Read BUILD_PLAN.md and 4_DAY_SPRINT.md. Today is Day 4, share day. Run the essential testing gate from the sprint plan in full. Fix only gate failures, re running the failing suite after each fix. Then prepare the Cloudflare Pages staging build with noindex on, run the staging checks, update PROGRESS.md, commit as Day 4, and stop. Report every gate result as pass or fail with numbers, and list anything deferred to the post share list.

## Share message for the client (copy, adjust the link)

Hello, your new Pack Optical website is ready for your first review.

Please open it here: STAGING LINK

This is a private review link, the site is not public yet and your current website is untouched. Please look mainly at the services, team, hours, offers, and photos, and tell us anything that needs correcting.

Once you approve it, we will put it live on packoptical.com and connect the Google listing and search setup so patients in Fort Worth find you first.

Thank you.

## After the share (first week back on BUILD_PLAN.md)

In this order: client changes from the review, doctor approval of medical content, Sanity CMS switch on, area pages if approved, remaining blog migration, Phase 10 launch with redirects, DNS, Search Console, and Business Profile updates, then Phase 11 monthly SEO reporting.

## Sprint risks, handled in advance

- Thanksgiving shortens Day 2. Mitigation: Day 2 is template driven, the most repeatable work in the project, and is split into two Claude Code runs.
- Client answers may not come in time. Mitigation: demo facts plus an Open Items note, per Scope Freeze rule 2.
- Blog volume is the easiest thing to overrun on. Mitigation: Day 3 order of migration and the post share list. A complete site with a partial blog shares well, a late site does not.
- Perfection risk is real pages, links, forms, and facts, not extra features. The gates above protect exactly those.
