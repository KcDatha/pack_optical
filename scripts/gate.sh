#!/bin/bash
# Full regression gate. Usage: scripts/gate.sh [lighthouse-runs]  (default 1). Prints one summary block.
cd "$(dirname "$0")/.."; RUNS=${1:-1}; npx astro preview stop >/dev/null 2>&1; npx astro dev stop >/dev/null 2>&1; pkill -f serve-dist 2>/dev/null; lsof -ti :4321 | xargs kill 2>/dev/null; sleep 1
echo "build:      $(npm run build 2>&1 | grep -E "rror|page\(s\)" | tr '\n' ' ')"
echo "astro check: $(npm run check 2>&1 | grep -E "^- [0-9]+ errors")"
echo "lint:       $(npm run lint 2>&1 | grep -cE "error|✖") problem lines"
echo "vitest:     $(npx vitest run 2>&1 | grep -E "^\s+Tests")"
echo "links:      $(node scripts/check-links.mjs | head -1)"
echo "seo:        $(node scripts/seo-check.mjs | head -1)"
echo "content:    $(node scripts/audit-content.mjs | tail -1)"
echo "facts:      $(node scripts/facts-check.mjs | head -1)"
if node scripts/csp-check.mjs > /tmp/csp.txt 2>&1; then echo "csp:        clean (7 pages)"; else echo "csp:        FAILED"; tail -3 /tmp/csp.txt; fi
echo "playwright: $(npm run test:e2e -- --reporter=line 2>&1 | grep -E "^\s+[0-9]+ (passed|failed|flaky|skipped|did not run)" | tr '\n' ' ')"
rm -rf .lighthouseci .lhrs; mkdir -p .lighthouseci; (node scripts/serve-dist.mjs >/dev/null 2>&1 &); sleep 2; n=0
for u in "" services/dry-eye-treatment/ services/aesthetics-med-spa/ blog/ book/; do for i in $(seq $RUNS); do n=$((n+1)); npx lhci collect --config=scripts/lh-noserver.json --url=http://localhost:4321/$u --numberOfRuns=1 --settings.chromeFlags="--headless --no-sandbox" >/dev/null 2>&1; mkdir -p .lhrs; cp .lighthouseci/lhr-*.json .lhrs/ 2>/dev/null; rm -rf .lighthouseci; done; done
pkill -f serve-dist
node -e "
const fs=require('fs');const d='.lhrs';const by={};for(const f of fs.readdirSync(d).filter(x=>/^lhr.*json\$/.test(x))){const j=JSON.parse(fs.readFileSync(d+'/'+f));(by[j.finalUrl]??=[]).push(j)}
for(const u in by){const med=k=>{const a=by[u].map(j=>Math.round(j.categories[k].score*100)).sort((x,y)=>x-y);return a[Math.floor(a.length/2)]};console.log('lighthouse: '+(u.replace('http://localhost:4321','')||'/').padEnd(34),'perf',med('performance'),'a11y',med('accessibility'),'bp',med('best-practices'),'seo',med('seo'),'('+by[u].length+' runs)')}"
