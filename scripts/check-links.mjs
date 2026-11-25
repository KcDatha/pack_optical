// Crawl dist/ and report internal links that do not resolve to a built page/file.
import fs from 'node:fs'; import path from 'node:path';
const dist = 'dist'; const pending = new Set((process.env.PENDING_PREFIXES || '').split(',').filter(Boolean));
const files = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);
const exists = (u) => { const clean = u.split('#')[0].split('?')[0]; if (!clean) return true; const t = path.join(dist, clean); return fs.existsSync(t) && fs.statSync(t).isFile() || fs.existsSync(path.join(t,'index.html')); };
const broken = new Map(); let n = 0;
for (const f of files) { const h = fs.readFileSync(f,'utf8'); for (const m of h.matchAll(/<a [^>]*href="([^"]+)"/g)) { const u = m[1]; if (!u.startsWith('/') || u.startsWith('//')) continue; n++; if (!exists(u)) { const k = u.split('#')[0]; (broken.get(k) ?? broken.set(k,new Set()).get(k)).add(f.replace(dist,'')||'/'); } } }
const real = [...broken].filter(([u]) => ![...pending].some((p) => u.startsWith(p)));
console.log(`${files.length} pages, ${n} internal links, ${broken.size} unresolved (${broken.size - real.length} on pending Day 2/3 pages)`);
for (const [u, from] of real) console.log('BROKEN', u, '<-', [...from].join(', '));
process.exit(real.length ? 1 : 0);
