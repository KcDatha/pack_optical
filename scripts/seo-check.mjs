// SEO + NAP + schema checks over dist/. Exit 1 on any failure. Writes docs/seo-validation/report.md.
import fs from 'node:fs'; import path from 'node:path';
const SITE = process.env.SITE_URL || 'https://packoptical.com';
const files = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); if (fs.statSync(p).isDirectory()) { if (f !== '_astro') walk(p); } else if (f.endsWith('.html')) files.push(p); } })('dist');
const rel = (f) => '/' + path.relative('dist', f).replace(/index\.html$/, '').replace(/\\/g, '/');
const fails = []; const log = [];
const fail = (u, m) => fails.push(`${u}: ${m}`);
const urls = [];
for (const f of files) {
  const u = rel(f); const h = fs.readFileSync(f, 'utf8'); const is404 = u === '/404.html';
  if (!is404) urls.push(u);
  const canon = (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!is404 && canon !== SITE + u) fail(u, `canonical ${canon} != ${SITE + u}`);
  if (!/<meta property="og:image" content="https?:\/\/[^"]+\.(jpg|png|webp)/.test(h)) fail(u, 'og:image missing');
  if (!/<meta name="twitter:image"/.test(h)) fail(u, 'twitter:image missing');
  const robots = (h.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '';
  if (!process.env.EXPECT_NOINDEX && /noindex/.test(robots)) fail(u, 'noindex on a production build');
  if (process.env.EXPECT_NOINDEX && !/noindex/.test(robots)) fail(u, 'staging build is missing noindex');
  // schema
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { fail(u, 'invalid JSON-LD'); return null; } }).filter(Boolean);
  const types = blocks.map((b) => b['@type']);
  if (!is404 && u !== '/' && !types.includes('BreadcrumbList')) fail(u, 'BreadcrumbList missing');
  for (const b of blocks) { if (b['@context'] !== 'https://schema.org') fail(u, 'bad @context'); }
  const need = (b, keys, label) => keys.forEach((k) => { if (b[k] === undefined) fail(u, `${label} missing ${k}`); });
  if (u === '/') { const b = blocks.find((x) => x['@type'] === 'Optometrist'); if (!b) fail(u, 'Optometrist schema missing'); else { need(b, ['name', 'address', 'telephone', 'geo', 'openingHoursSpecification', 'sameAs', 'url'], 'Optometrist'); if (b.aggregateRating) fail(u, 'aggregateRating must stay out until verified live'); } }
  if (u.startsWith('/services/') && u !== '/services/') {
    const s = blocks.find((x) => x['@type'] === 'Service'); if (!s) fail(u, 'Service schema missing'); else need(s, ['name', 'description', 'provider', 'areaServed'], 'Service');
    const q = blocks.find((x) => x['@type'] === 'FAQPage'); if (!q || q.mainEntity.length < 4) fail(u, 'FAQPage needs 4+ questions'); else q.mainEntity.forEach((e) => { if (!e.name || !e.acceptedAnswer?.text) fail(u, 'FAQ entry incomplete'); });
  }
  if (/^\/blog\/.+/.test(u)) { const b = blocks.find((x) => x['@type'] === 'BlogPosting'); if (!b) fail(u, 'BlogPosting missing'); else need(b, ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage', 'description'], 'BlogPosting'); }
  if (u === '/visit/') { const q = blocks.find((x) => x['@type'] === 'FAQPage'); if (!q) fail(u, 'FAQPage missing'); }
  log.push(`| ${u} | ${types.join(', ') || '-'} |`);
  // NAP
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ');
  for (const m of text.matchAll(/1217 Oak Knoll\s+(\w+)/g)) if (m[1] !== 'Drive' && m[1] !== 'Dr') fail(u, `address variant "Oak Knoll ${m[1]}"`);
  for (const m of text.matchAll(/\d+\s+Oak Knoll\s+Dr\b(?!ive)/g)) fail(u, `abbreviated address "${m[0]}"`);
  for (const m of text.matchAll(/(?<![\d-])(?:\+?1[ .-]?)?\(?(\d{3})\)?[ .-](\d{3})[ .-](\d{4})(?![\d-])/g)) { const n = m[1] + m[2] + m[3]; if (!['8178316141', '6826473909'].includes(n)) fail(u, `unknown phone number ${m[0]}`); }
  for (const m of h.matchAll(/href="tel:([^"]+)"/g)) if (m[1] !== '+18178316141') fail(u, `tel link ${m[1]}`);
  if (!is404 && (u === '/' || u === '/visit/') && !/1217 Oak Knoll Drive, Fort Worth, TX 76117/.test(text)) fail(u, 'full NAP address missing');
}
// sitemap
const smIdx = fs.existsSync('dist/sitemap-index.xml') ? fs.readFileSync('dist/sitemap-index.xml', 'utf8') : '';
const smFile = (smIdx.match(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/) || [])[1];
const sm = smFile ? fs.readFileSync('dist/' + smFile, 'utf8') : '';
const smUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
for (const u of urls) if (!smUrls.includes(u)) fail('sitemap', `missing ${u}`);
for (const u of smUrls) if (!urls.includes(u)) fail('sitemap', `lists unbuilt page ${u}`);
if (!/<lastmod>/.test(sm)) fail('sitemap', 'no lastmod');
const robots = fs.existsSync('dist/robots.txt') ? fs.readFileSync('dist/robots.txt', 'utf8') : '';
if (!/Sitemap: .*sitemap-index\.xml/.test(robots)) fail('robots.txt', 'sitemap line missing');
if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'blocks everything');
const report = `# SEO validation report\n\nGenerated by scripts/seo-check.mjs against dist/ (${new Date().toISOString().slice(0, 10)}).\nThis is an OFFLINE structural check (required fields, JSON validity, canonical, OG, sitemap, robots, NAP). It does not replace the Google Rich Results Test; run that on staging for the sample URLs listed in docs/seo-validation/README.md.\n\nPages checked: ${urls.length}. Sitemap URLs: ${smUrls.length}. Failures: ${fails.length}.\n\n${fails.length ? fails.map((f) => '- ' + f).join('\n') : 'All checks passed.'}\n\n## Schema types per page\n\n| URL | Types |\n| --- | --- |\n${log.join('\n')}\n`;
fs.mkdirSync('docs/seo-validation', { recursive: true }); fs.writeFileSync('docs/seo-validation/report.md', report);
console.log(`pages ${urls.length}, sitemap ${smUrls.length}, failures ${fails.length}`); fails.slice(0, 30).forEach((f) => console.log('FAIL', f)); process.exit(fails.length ? 1 : 0);
