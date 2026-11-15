// 🎁 작은 상자 줄이기 (Build 200): 정예는 25%만 상자(나머지 금화), 바닥 작은 상자는 최대 3개 (넘으면 금화)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.chests = []; let made = 0;
    for (let i = 0; i < 200; i++) { const n0 = G.chests.length; const e = makeEnemy('grunt', 400, 400); makeElite(e, 'shield'); eliteDie(e); if (G.chests.length > n0) made++; G.chests = []; }
    const g0 = G.gold; for (let i = 0; i < 6; i++) dropChest(0, 0, true); return { made, small: G.chests.filter(c => c.small).length, gold: G.gold - g0 }; });
  console.log(JSON.stringify(r));
  check(r.made > 25 && r.made < 80, 'elite chest ~25% ' + r.made);
  check(r.small === 3 && r.gold > 0, 'small chest cap');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
