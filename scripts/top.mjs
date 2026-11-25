import { chromium, devices } from '@playwright/test';
const b = await chromium.launch(); const c = await b.newContext({...devices['Pixel 7'], reducedMotion:'reduce'}); const p = await c.newPage();
await p.goto('http://localhost:4321/',{waitUntil:'networkidle'}); await p.screenshot({path:process.argv[2]}); await b.close();
