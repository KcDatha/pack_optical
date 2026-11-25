# Pack Optical + Med Spa website
Astro + TypeScript + Tailwind. Hosting: Cloudflare Pages (never Vercel). See BUILD_PLAN.md and 4_DAY_SPRINT.md.

    npm run dev | build | preview | lint | check | test | test:e2e | test:a11y
    PUBLIC_NOINDEX=1 npm run build    # staging build, adds noindex
    node scripts/check-links.mjs      # crawl dist for broken internal links
