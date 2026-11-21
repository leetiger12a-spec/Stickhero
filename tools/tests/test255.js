// Build 339: 업적 3개 — ⛲ 분수 10번 · 💰 현상금 10마리 · 👻 유령 정예 10마리
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const ids = ['fnt10', 'bounty10', 'ghostel10'], m0 = readJSON('stickhero_meta') || {}, before = ids.map(i => !!(m0.ach || {})[i]); checkAch(); const m1 = readJSON('stickhero_meta') || {}, early = ids.map(i => !!(m1.ach || {})[i]);
    ST.fountains = 10; ST.bounties = 10; ST.ghostElites = 10; checkAch(); const m = readJSON('stickhero_meta') || {}; return { n: ACH.length, early, got: ids.map(i => !!(m.ach || {})[i]) }; });
  console.log(JSON.stringify(r)); check(r.n === 83 && r.early.every(x => !x) && r.got.every(x => x), 'new achievements');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
