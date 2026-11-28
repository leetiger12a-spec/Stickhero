// Build 358: 업적 3개 — 🗿 동상 10단계 · 🪙 금화 10,000 쓰기 · 🥋 특훈 10번
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => { const ids = ['statue10', 'spend10k', 'train10']; checkAch(); const e = ids.map(i => !!((readJSON('stickhero_meta') || {}).ach || {})[i]);
    ST.statue = 10; ST.goldSpent = 10000; ST.trains = 10; checkAch(); const m = readJSON('stickhero_meta') || {}; return { n: ACH.length, e, got: ids.map(i => !!(m.ach || {})[i]) }; });
  console.log(JSON.stringify(r)); check(r.n === 89 && r.e.every(x => !x) && r.got.every(x => x), 'achievements');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
