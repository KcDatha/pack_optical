// Run after a staging build: add an X-Robots-Tag header so staging can never be indexed, even by non-HTML files.
import fs from 'node:fs';
const h = fs.readFileSync('dist/_headers', 'utf8');
fs.writeFileSync('dist/_headers', h.replace('/*\n', '/*\n  X-Robots-Tag: noindex, nofollow\n'));
console.log('staging: X-Robots-Tag noindex added to dist/_headers');
