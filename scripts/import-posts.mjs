// One-off importer: content/wp-posts-raw.json (live WordPress REST API) -> src/content/blog/*.md
import fs from 'node:fs'; import sharp from 'sharp';
const raw = JSON.parse(fs.readFileSync('content/wp-posts-raw.json', 'utf8'));
const demo = JSON.parse(fs.readFileSync('src/data/demo-data.json', 'utf8')).POSTS;
const slugs = new Set(raw.map((p) => p.slug));
const demoBySlug = Object.fromEntries(demo.map((p) => [p.u, p]));
const SVC = { exam: 'comprehensive-eye-exams', kids: 'childrens-eye-exams', contacts: 'contact-lens-fittings', dryeye: 'dry-eye-treatment', urgent: 'emergency-eye-care', diabetic: 'diabetic-eye-exams', spaconsult: 'aesthetics-med-spa', forma: 'aesthetics-med-spa' };
const LINKMAP = { '/': '/', '/brands/sunglasses-frames-lenses/': '/eyewear/', '/comprehensive-eye-exams/': '/services/comprehensive-eye-exams/', '/service/adult-senior-eye-exams/': '/services/comprehensive-eye-exams/', '/contact-lens-consultations-fittings/': '/services/contact-lens-fittings/', '/service/contact-lens-exams-fittings-brands/': '/services/contact-lens-fittings/', '/contact/': '/visit/', '/dry-eye-treatment/': '/services/dry-eye-treatment/', '/service/dry-eye-therapy/': '/services/dry-eye-treatment/', '/eyeglass-consultations/': '/eyewear/', '/ocular-disease-diagnosis-treatment-management/': '/services/eye-disease-management/', '/service/eye-disease-diagnosis-management/': '/services/eye-disease-management/', '/our-practice/': '/our-practice/', '/service/aesthetics-in-fort-worth/': '/services/aesthetics-med-spa/', '/service/childrens-eye-exams/': '/services/childrens-eye-exams/', '/service/diabetic-eye-exams/': '/services/diabetic-eye-exams/', '/service/digital-eye-strain/': '/services/digital-eye-strain/' };
const text = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&#8217;|&#8216;/g, "'").replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;|&#8212;/g, '-').replace(/&#8230;/g, '...').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&#\d+;/g, '').replace(/\s+/g, ' ').trim();
const q = (s) => JSON.stringify(s);
function category(slug, wpCat) {
  const m = { 9: 'Aesthetics', 8: 'Aesthetics', 7: 'Dry Eye', 5: 'Eye Exams', 6: 'Eye Health' }[wpCat];
  if (m) return m;
  if (/dry-eye|dry-eyes/.test(slug)) return 'Dry Eye';
  if (/vision-therapy|vision-rehab|stroke|concussion|binocular|learning/.test(slug)) return 'Vision Therapy';
  if (/contact|ortho|myopia|nearsight/.test(slug)) return 'Contacts & Myopia';
  if (/exam/.test(slug)) return 'Eye Exams';
  return 'Eye Health';
}
function relatedService(slug, title) {
  const d = demoBySlug[slug]; if (d && SVC[d.b]) return SVC[d.b];
  const s = slug + ' ' + title.toLowerCase();
  if (/diabetic/.test(s)) return 'diabetic-eye-exams'; if (/dry-eye/.test(s)) return 'dry-eye-treatment';
  if (/child|kid/.test(s)) return 'childrens-eye-exams'; if (/contact|ortho|myopia/.test(s)) return 'contact-lens-fittings';
  if (/digital|blue-light/.test(s)) return 'digital-eye-strain'; if (/lasik/.test(s)) return 'laser-surgery-consultation';
  return 'comprehensive-eye-exams';
}
const SUF = ['', ' | Pack Optical', ' | Pack Optical Fort Worth', ' | Pack Optical + Med Spa', ' | Pack Optical, Fort Worth TX', ' | Fort Worth Eye Care'];
function metaTitle(t) { for (const s of SUF) { const x = t + s; if (x.length >= 50 && x.length <= 60) return x; } return null; }
function metaDesc(excerpt, body) {
  let d = excerpt; if (d.length > 160) { d = d.slice(0, 157); d = d.slice(0, d.lastIndexOf(' ')).replace(/[,;:\-]$/, '') + '...'; }
  if (d.length < 140) { const more = ' Advice from the Pack Optical team in Fort Worth.'; if ((d + more).length <= 160) d += more; }
  if (d.length < 140) { const t = text(body); const need = t.slice(excerpt.length).trim().slice(0, 160 - d.length - 1); d = (d + ' ' + need).trim(); if (d.length > 160) { d = d.slice(0, 157); d = d.slice(0, d.lastIndexOf(' ')) + '...'; } }
  return d;
}
const imgReport = []; let imgFail = 0;
async function grab(url, slug, i) {
  const out = `public/blog/${slug.slice(0, 60)}-${i}.webp`;
  try {
    const r = await fetch(url.replace(/&amp;/g, '&'), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) throw new Error(r.status);
    const buf = Buffer.from(await r.arrayBuffer()); const img = sharp(buf).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78 });
    const info = await img.toFile(out); return { src: '/' + out.replace('public/', ''), w: info.width, h: info.height };
  } catch (e) { imgFail++; imgReport.push(`${slug}: ${url.slice(0, 80)} FAILED ${e.message}`); return null; }
}
let nTitleFix = [], nDescFix = [];
fs.mkdirSync('src/content/blog', { recursive: true });
for (const p of raw) {
  let h = p.content.rendered;
  const title = text(p.title.rendered);
  h = h.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  // images
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)]; let i = 0;
  for (const m of imgs) {
    const tag = m[0]; const src = (tag.match(/data-src="([^"]+)"/) || tag.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || src.startsWith('data:')) { h = h.replace(tag, ''); continue; }
    const g = await grab(src, p.slug, ++i);
    const altm = tag.match(/alt="([^"]*)"/); const alt = altm ? altm[1] : '';
    h = h.replace(tag, g ? `<img src="${g.src}" alt="${alt}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">` : '');
  }
  h = h.replace(/<figure[^>]*>\s*<\/figure>/g, '');
  h = h.replace(/<figure[^>]*>/g, '<figure>');
  // links
  h = h.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g, (all, a, href, b) => {
    const clean = href.replace(/&amp;/g, '&');
    if (/4patientcare|patientnow/.test(clean)) return '<a href="/book/">';
    const m = clean.match(/^https?:\/\/(?:www\.)?packoptical\.com(\/[^#?]*)?/);
    if (m) { const path = m[1] || '/'; const sl = path.replace(/\//g, ''); if (slugs.has(sl)) return `<a href="/blog/${sl}/">`; if (LINKMAP[path]) return `<a href="${LINKMAP[path]}">`; console.warn('UNMAPPED link', p.slug, path); return '<a href="/">'; }
    if (/^https?:/.test(clean)) return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    return all;
  });
  h = h.replace(/\s(?:class|style|data-[a-z-]+|id)="[^"]*"/g, (m) => (m.startsWith(' class') && /wp-block-heading/.test(m) ? '' : /^ (class|style|data-)/.test(m) ? '' : m));
  h = h.replace(/<(h[2-4]|p|ul|ol|li|strong|em)\s+>/g, '<$1>').replace(/[ \t]+$/gm, '').replace(/^[ \t]+/gm, '').replace(/\n{3,}/g, '\n\n').replace(/<p>(\s|&nbsp;)*<\/p>/g, '').replace(/&nbsp;/g, ' ').trim();
  const excerpt = text(p.excerpt.rendered).replace(/\s*\[?(\.\.\.|…)\]?\s*(Read more.*)?$/i, '').replace(/Read more.*$/i, '').trim() || text(h).slice(0, 155);
  const mt = metaTitle(title); if (!mt) nTitleFix.push(`${title.length} ${title}`);
  const md = metaDesc(excerpt, h); if (md.length < 140 || md.length > 160) nDescFix.push(`${md.length} ${p.slug}`);
  const cat = category(p.slug, p.categories[0]);
  const date = p.date.slice(0, 10);
  const fm = ['---', `title: ${q(title)}`, `slug: ${q(p.slug)}`, `excerpt: ${q(excerpt)}`, `category: ${q(cat)}`, `author: "Pack Optical team"`, `publishedAt: ${date}`, `updatedAt: ${p.modified.slice(0, 10)}`, `targetKeyword: ${q(title.toLowerCase().replace(/[?]/g, ''))}`, `metaTitle: ${q(mt || title)}`, `metaDescription: ${q(md)}`, `relatedService: ${q(relatedService(p.slug, title))}`, `source: "https://packoptical.com/${p.slug}/"`, '---', ''].join('\n');
  fs.writeFileSync(`src/content/blog/${p.slug}.md`, fm + '\n' + h + '\n');
}
console.log(raw.length, 'posts written. images failed:', imgFail); console.log(imgReport.join('\n'));
console.log('metaTitle needs manual (' + nTitleFix.length + '):\n' + nTitleFix.join('\n')); console.log('metaDesc out of range (' + nDescFix.length + '):\n' + nDescFix.join('\n'));
