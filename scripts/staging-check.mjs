// Checks on a STAGING build (npm run build:staging): noindex everywhere, and no localhost/demo/hash-route leftovers.
import fs from 'node:fs'; import path from 'node:path';
const files = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); fs.statSync(p).isDirectory() ? walk(p) : /\.(html|js|xml|txt|css)$/.test(f) && files.push(p); } })('dist');
const bad = [];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8'); const rel = f.replace('dist', '');
  if (f.endsWith('.html') && !/<meta name="robots" content="noindex, nofollow"/.test(t)) bad.push(`${rel}: missing noindex`);
  if (/localhost|127\.0\.0\.1|demo\.html|pack-optical-website-redesign-demo/.test(t)) bad.push(`${rel}: localhost/demo reference`);
  if (f.endsWith('.html') && /href="#\//.test(t)) bad.push(`${rel}: demo hash route link`);
}
const hd = fs.readFileSync('dist/_headers', 'utf8'); if (!/X-Robots-Tag: noindex/.test(hd)) bad.push('_headers: X-Robots-Tag missing');
if (!/Content-Security-Policy/.test(hd) || !/Strict-Transport-Security/.test(hd)) bad.push('_headers: security headers missing');
console.log(`staging check: ${files.length} files, ${bad.length} problems`); bad.slice(0, 20).forEach((b) => console.log('BAD', b)); process.exit(bad.length ? 1 : 0);
