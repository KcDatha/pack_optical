# QA log

## 2026-11-28 Day 4 essential gate (local build, before staging deploy)
| Check | Result |
| --- | --- |
| npm run build / astro check / eslint | pass, 62 pages, 0 errors, lint clean |
| Vitest unit tests | 32/32 pass (quiz, frame guide, insurance, hours, forms, server handler, chat) |
| Playwright, Chromium + WebKit (desktop Safari engine) + Pixel 7 + iPhone 14 | 320 pass, 0 fail, 16 skipped by design (mobile-only / desktop-only tests) |
| Playwright, Firefox | SKIPPED by Guru's decision (DEC-20251125-002). NOT RUN. Playwright's Firefox build will not launch on this Mac (macOS 27.2). Run `PW_FIREFOX=1 npm run test:e2e -- --project=firefox` on another machine or CI. |
| axe (critical + serious) | 0 violations, 13 templates x light and dark, desktop and mobile engines |
| Keyboard pass (home, service, blog, book) | pass on Chromium: skip link first, focus ring on every focusable element, no trap |
| Reduced motion, light/dark | pass |
| Lighthouse CI mobile, 3 runs each, median (home, dry eye, blog index, article) | Performance 100/100/100/100, Accessibility 100 x4, Best Practices 100 x4, SEO 100 x4 (gate: 95/95/95/100) |
| Broken link crawl | 62 pages, 3,396 internal links, 0 broken |
| SEO suite (canonical, OG, schema, sitemap, robots, NAP, tel links) | 0 failures, 61 pages = 61 sitemap URLs |
| Staging build checks | noindex on every page and header, no localhost/demo/hash links, security headers present |
| Content proof (facts-check) | prices, percentages, times, emails, phone and address all match Facts; 0 issues |
| Spell check | fixed UK spellings (color, moisturized, personalized, prioritize, realizes); remaining flags are medical terms and names |
| npm audit | 0 vulnerabilities |
| CSP (served with the real _headers on 7 pages, chat, quiz, Turnstile, map) | 0 violations, 0 console errors |

## Not done yet (cannot be done from this machine)
- Staging deploy: wrangler is not logged in and no client Cloudflare project exists. Nothing was deployed anywhere.
- Real email delivery to a test inbox (needs Resend key, verified domain) and live Turnstile (needs real site key).
- Response header check on the real pages.dev URL.
- Real phone check (Android or iPhone, Chrome and Safari): home, one service page, request form. Guru to do.
- Google Rich Results Test (needs a public URL).
- Final walkthrough by Guru on the staging URL.
