import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const w of [1440, 1280, 1200, 1100, 1000, 961]) { const p = await b.newPage({ viewport: { width: w, height: 800 } }); await p.goto('http://localhost:4321/');
  const r = await p.evaluate(() => { const hi = document.querySelector('.header-in'); const kids = [...hi.children].map((c) => Math.round(c.getBoundingClientRect().width)); return { h: Math.round(document.querySelector('header.site').getBoundingClientRect().height), wrap: Math.round(hi.getBoundingClientRect().width), kids }; });
  console.log(w, JSON.stringify(r)); await p.close(); }
await b.close();
