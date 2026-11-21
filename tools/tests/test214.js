// Build 281: 새 업적 4개 (투기장 20·투기장 보스 3·핏빛 달 3·뽑기 5) → 업적 65개
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => { ST.arenaBest = 20; ST.arenaBoss = 3; ST.bloods = 3; ST.gachas = 5; ST.dbossWins = 5; ST.bloodLeaders = 3; ST.treats = 10; ST.rushBest = 170; ST.arenaBest = 30; ST.merchBuys = 20; checkAch(); const m = readJSON('stickhero_meta') || {}; return { n: ACH.length, got: ['arena20', 'arenaB3', 'blood3', 'gacha5', 'arena10', 'dboss5', 'bloodL3', 'treat10', 'rush3m', 'arena30', 'merch20'].map(i => !!(m.ach || {})[i]) }; });
  console.log(JSON.stringify(r)); check(r.n === 71 && r.got.every(x => x), 'new achievements');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
