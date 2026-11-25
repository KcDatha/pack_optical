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
