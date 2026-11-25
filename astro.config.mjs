/* global process */
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { loadEnv } from 'vite';

// lastmod: blog posts use their own updated date; everything else uses the build date.
const postDates = Object.fromEntries(fs.readdirSync('./src/content/blog').map((f) => {
  const t = fs.readFileSync(`./src/content/blog/${f}`, 'utf8');
  return [f.replace(/\.md$/, ''), (t.match(/^updatedAt: (.*)$/m) || t.match(/^publishedAt: (.*)$/m))?.[1]];
}));


// Build guard: warn loudly (never fail) when a PRODUCTION build would ship Cloudflare's Turnstile TEST key or no key.
const TURNSTILE_TEST_KEYS = ['1x00000000000000000000AA', '2x00000000000000000000AB', '1x00000000000000000000BB', '2x00000000000000000000BB', '3x00000000000000000000FF'];
const turnstileGuard = {
  name: 'turnstile-sitekey-guard',
  hooks: {
    'astro:build:start': ({ logger }) => {
      const env = { ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env };
      if (env.PUBLIC_NOINDEX === '1') return; // staging build, test key is tolerated
      const key = env.PUBLIC_TURNSTILE_SITEKEY;
      if (!key || TURNSTILE_TEST_KEYS.includes(key)) {
        const bar = '!'.repeat(78);
        logger.warn(`\n${bar}\n!! WARNING: PRODUCTION BUILD WITHOUT A REAL TURNSTILE SITE KEY\n!! PUBLIC_TURNSTILE_SITEKEY is ${key ? 'a Cloudflare TEST key' : 'not set'}. The contact and booking-request forms\n!! would run with spam protection that always passes (or is missing). Do NOT publish this build.\n!! Set a real key from the client's Cloudflare Turnstile widget. See docs/staging-deploy.md step 3.\n${bar}`);
      }
    },
  },
};

// SITE is the canonical production domain. Staging builds set PUBLIC_NOINDEX=1.
export default defineConfig({
  site: 'https://packoptical.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [turnstileGuard, sitemap({
    serialize(item) {
      const m = item.url.match(/\/blog\/([^/]+)\/$/);
      item.lastmod = new Date(m && postDates[m[1]] ? postDates[m[1]] : Date.now()).toISOString();
      return item;
    },
  })],
  // assetsInlineLimit 0 keeps every script external so the CSP can forbid inline scripts.
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
});
