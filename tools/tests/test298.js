// Build 400: 🌪 투기장 회오리 웨이브 — 회오리 3개가 떠돌며 적을 빨아들이고 피해, 영웅은 살짝 끌려감(피해 없음), 금화 1.5배
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'whirlw'; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arenaRule = null; const g0 = makeEnemy('grunt', 0, 0).gold; G.st.arenaRule = 'whirlw'; const g1 = makeEnemy('grunt', 0, 0).gold; G.enemies = [];
    const hp0 = G.p.hp; await new Promise(q => setTimeout(q, 300)); const wt = (G.st.wt || []).length;
    const t = G.st.wt[0], e = makeEnemy('tank', t.x + 60, t.y); e.spd = 0; e.dmg = 0; e.hp = e.maxHp = 1000; G.enemies.push(e); const d0 = Math.hypot(e.x - t.x, e.y - t.y);
    await new Promise(q => setTimeout(q, 1200)); const d1 = Math.hypot(e.x - t.x, e.y - t.y);
    return { g0, g1, wt, pulled: d1 < d0, hurt: e.hp < 1000 || e.dead, heroHp: G.p.hp === hp0, rules: Object.keys(ARENA_RULES).length }; });
  console.log(JSON.stringify(r)); check(r.wt === 3 && r.pulled && r.hurt && r.heroHp, 'whirl wave'); check(r.g1 === Math.ceil(r.g0 * 1.5) && r.rules === 9, 'gold 1.5x, 9 rules');
  await page.screenshot({ path: `${OUT}/b400_whirlwave.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
