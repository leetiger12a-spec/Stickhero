// Build 352: 🎟 재도전권 — 오늘 이미 한 동굴·오늘의 보스를 금화로 1번 더 (종류마다 하루 1장), 안 했으면 안 보임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r0 = await page.evaluate(() => { const G = SH.G; G.quests = []; G.gold = 2000; G.stageN = 6; G.stars = [3, 3, 3, 3, 3, 3]; G.caveDay = 0; G.dbossDay = 0; SH.openMap(); $('bSpend').onclick(); return { cave: !!$('bSp_retry_cave'), db: !!$('bSp_retry_dboss') }; });
  const r1 = await page.evaluate(() => { const G = SH.G; G.caveDay = G.day; G.dbossDay = G.day; $('bSpend').onclick(); return { cave: !!$('bSp_retry_cave'), db: !!$('bSp_retry_dboss') }; });
  await page.click('#bSp_retry_cave'); await page.waitForTimeout(100);
  const r2 = await page.evaluate(() => { const G = SH.G; const cd = G.caveDay; G.caveDay = G.day; $('bSpend').onclick(); return { gold: G.gold, cd, again: !!$('bSp_retry_cave'), db: !!$('bSp_retry_dboss'), st: ST.retries, spent: ST.goldSpent }; });
  console.log(JSON.stringify(r0), JSON.stringify(r1), JSON.stringify(r2));
  check(!r0.cave && !r0.db && r1.cave && r1.db && r2.gold === 1700 && r2.cd === 0 && !r2.again && r2.db && r2.st === 1 && r2.spent === 300, 'retry tickets');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
