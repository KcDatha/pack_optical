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
