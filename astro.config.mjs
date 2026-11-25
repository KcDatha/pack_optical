import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// lastmod: blog posts use their own updated date; everything else uses the build date.
const postDates = Object.fromEntries(fs.readdirSync('./src/content/blog').map((f) => {
  const t = fs.readFileSync(`./src/content/blog/${f}`, 'utf8');
  return [f.replace(/\.md$/, ''), (t.match(/^updatedAt: (.*)$/m) || t.match(/^publishedAt: (.*)$/m))?.[1]];
}));

// SITE is the canonical production domain. Staging builds set PUBLIC_NOINDEX=1.
export default defineConfig({
  site: 'https://packoptical.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({
    serialize(item) {
      const m = item.url.match(/\/blog\/([^/]+)\/$/);
      item.lastmod = new Date(m && postDates[m[1]] ? postDates[m[1]] : Date.now()).toISOString();
      return item;
    },
  })],
  // assetsInlineLimit 0 keeps every script external so the CSP can forbid inline scripts.
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
});
