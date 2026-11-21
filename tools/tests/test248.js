// Build 332: 👻 유령 정예 — 투명할 땐 공격이 통과·닿아도 안 아픔, 다시 보이면 맞음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.enemies = []; G.spawnAcc = -1e9; const e = makeEnemy('grunt', G.p.x + 120, G.p.y); makeElite(e, 'ghost'); e.eT = 0; G.enemies.push(e);
    await new Promise(q => setTimeout(q, 150)); const ph = e.phaseT > 0, hp0 = e.hp; hurtEnemy(e, 50, 0, 1, 0); const immune = e.hp === hp0;
    const php = G.p.hp; e.x = G.p.x; e.y = G.p.y; await new Promise(q => setTimeout(q, 100)); const noTouch = G.p.hp === php; e.x = G.p.x + 120;
    e.phaseT = 0; e.eT = 9; hurtEnemy(e, 50, 0, 1, 0); const hit = e.hp < hp0; hurtEnemy(e, 1e9, 0, 1, 0); return { ph, immune, noTouch, hit, ghosts: ST.ghosts, kinds: Object.keys(ELITE_K).length }; });
  console.log(JSON.stringify(r)); check(r.ph && r.immune && r.noTouch && r.hit && r.ghosts >= 1 && r.kinds === 11, 'ghost elite');
  await page.evaluate(() => { const G = SH.G; const e = makeEnemy('grunt', G.p.x + 90, G.p.y - 20); makeElite(e, 'ghost'); e.phaseT = 5; e.eT = 9; G.enemies.push(e); }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b332_ghost.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
