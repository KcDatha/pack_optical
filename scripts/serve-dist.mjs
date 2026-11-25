// Minimal foreground static server for dist/ (used by Playwright and the Lighthouse gate). PORT env, default 4321.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer((req, res) => {
  let p = path.join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  let status = 200; if (!fs.existsSync(p)) { p = 'dist/404.html'; status = 404; }
  res.writeHead(status, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(Number(process.env.PORT || 4321), () => console.log('serving dist on', process.env.PORT || 4321));
