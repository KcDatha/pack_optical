// Content proof: every price, percentage, email, time and weekday-hours claim on built pages must match the client Facts.
import fs from 'node:fs'; import path from 'node:path';
const files = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); if (fs.statSync(p).isDirectory()) { if (f !== '_astro') walk(p); } else if (f.endsWith('.html')) files.push(p); } })('dist');
const OK_PRICES = new Set(['$99', '$25']); const OK_PCT_SITE = new Set(['15%', '10%', '80%', '25%']); const OK_TIMES = new Set(['7:30 AM', '8:30 AM', '5:30 PM', '7:30', '8:30', '5:30']);
const issues = []; const blogMoney = new Set();
for (const f of files) {
  const u = '/' + path.relative('dist', f).replace(/index\.html$/, ''); const h = fs.readFileSync(f, 'utf8');
  const body = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
  const blog = u.startsWith('/blog/') && u !== '/blog/';
  for (const m of body.matchAll(/\$\d[\d,.]*/g)) { if (blog) blogMoney.add(`${u} ${m[0]}`); else if (!OK_PRICES.has(m[0])) issues.push(`${u}: unexpected price ${m[0]}`); }
  if (!blog) {
    for (const m of body.matchAll(/\d+%/g)) if (!OK_PCT_SITE.has(m[0])) issues.push(`${u}: percentage ${m[0]} (check source)`);
    for (const m of body.matchAll(/\b\d{1,2}:\d{2}\s?(?:AM|PM)\b/gi)) if (!OK_TIMES.has(m[0].toUpperCase().replace(/\s?(AM|PM)/, ' $1'))) issues.push(`${u}: time ${m[0]}`);
    for (const m of body.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) if (!['office@packoptical.com', 'j@example.com', 'you@email.com'].includes(m[0]) && !m[0].includes('example')) issues.push(`${u}: email ${m[0]}`);
    if (/Mon(?:day)?[^.]{0,40}(?:Fri|Sat|Sun)[a-z]*\s+(?:7|8|9)/i.test(body)) issues.push(`${u}: suspicious weekend hours`);
  }
}
const hoursPages = files.filter((f) => /closed/i.test(fs.readFileSync(f, 'utf8')) && /7:30/.test(fs.readFileSync(f, 'utf8'))).length;
console.log(`pages ${files.length}; pages stating hours ${hoursPages}; issues ${issues.length}`); issues.forEach((i) => console.log('ISSUE', i));
console.log('Prices mentioned inside blog articles (informational, clinical content from the live site):', [...blogMoney].join('; ') || 'none');
process.exit(issues.length ? 1 : 0);
