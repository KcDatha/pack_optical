// Reports title/description length + uniqueness and word counts for built pages in dist/.
import fs from 'node:fs'; import path from 'node:path';
const pages = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); if (fs.statSync(p).isDirectory()) { if (!p.includes('_astro')) walk(p); } else if (f==='index.html'||f==='404.html') pages.push(p); } })('dist');
const rows = pages.map((p) => { const h = fs.readFileSync(p,'utf8'); const t=(h.match(/<title>([^<]*)<\/title>/)||[])[1]||''; const d=(h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||''; const h1=[...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').trim());
  const body=(h.match(/<main[\s\S]*?<\/main>/)||[''])[0].replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g,' ');
  const words=body.split(/\s+/).filter(Boolean).length; return {url:p.replace('dist','').replace('index.html','')||'/',t,d,h1:h1.join('|'),words,h1n:h1.length}; });
const unesc=(s)=>s.replace(/&amp;/g,'&').replace(/&#39;|&#x27;/g,"'").replace(/&quot;/g,'"');
let bad=0; const seen={t:new Map(),d:new Map(),h:new Map()};
for (const r of rows) { const t=unesc(r.t), d=unesc(r.d); const issues=[];
  if (r.h1n!==1) issues.push('h1 count '+r.h1n);
  if (r.url!=='/'&&!r.url.includes('404')&&(t.length<50||t.length>60)) issues.push('title len '+t.length);
  if (r.url!=='/404/'&&(d.length<140||d.length>160)) issues.push('desc len '+d.length);
  for (const [k,v] of [['t',t],['d',d],['h',r.h1]]) { if (seen[k].has(v)) issues.push('dup '+k+' with '+seen[k].get(v)); else seen[k].set(v,r.url); }
  if (r.url.startsWith('/services/')&&r.url!=='/services/'&&r.words<800) issues.push('words '+r.words+' <800');
  console.log(r.url.padEnd(44), String(r.words).padStart(5)+'w', 't'+t.length, 'd'+d.length, issues.length?'  !! '+issues.join('; '):''); bad+=issues.length; }
console.log(bad?`${bad} issue(s)`:'all clear'); process.exit(bad?1:0);
