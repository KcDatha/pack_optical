import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE is the canonical production domain. Staging builds set PUBLIC_NOINDEX=1.
export default defineConfig({
  site: 'https://packoptical.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
