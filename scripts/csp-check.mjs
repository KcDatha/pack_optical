// Serve dist/ with the headers from public/_headers and fail on any CSP violation or console error on key pages.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { chromium } from '@playwright/test';
const hdr = {}; for (const l of fs.readFileSync('public/_headers', 'utf8').split('\n')) { if (/^\s*$/.test(l)) break; const m = l.match(/^\s+([\w-]+):\s*(.+)$/); if (m) hdr[m[1]] = m[2]; }
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg' };
const srv = http.createServer((req, res) => { let p = path.join('dist', decodeURIComponent(req.url.split('?')[0])); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); if (!fs.existsSync(p)) { p = 'dist/404.html'; res.statusCode = 404; } res.writeHead(res.statusCode || 200, { ...hdr, 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(4400);
const b = await chromium.launch(); const bad = [];
for (const u of ['/', '/book/', '/patient-centre/', '/visit/', '/services/dry-eye-treatment/', '/blog/', '/blog/can-dry-eye-cause-blurry-vision/']) {
  const pg = await b.newPage(); const errs = [];
  pg.on('console', (m) => { if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) errs.push(m.text().slice(0, 200)); });
  pg.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://localhost:4400' + u, { waitUntil: 'load' }); await pg.waitForTimeout(2500);
  if (u === '/') { await pg.evaluate(() => document.getElementById('chatFab').click()); await pg.click('#chatChips [data-flow="hours"]'); }
  if (u === '/patient-centre/') { await pg.click('#quizBody .quiz-opt'); await pg.selectOption('#insSelect', 'vsp'); }
  const font = await pg.evaluate(() => document.getElementById('gfonts')?.media); if (u === '/' && font !== 'all') errs.push('fonts stylesheet not activated: ' + font);
  console.log(u.padEnd(48), errs.length ? 'ERRORS ' + JSON.stringify(errs) : 'clean'); bad.push(...errs); await pg.close();
}
await b.close(); srv.close(); process.exit(bad.length ? 1 : 0);
