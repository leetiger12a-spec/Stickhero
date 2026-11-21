// Build 314: 🧲 자석 정예 — 가까우면 영웅을 끌어당김
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.weapons = {}; G.p.hp = G.p.maxHp = 1e9; G.p.inv = 0;
    const e = makeEnemy('grunt', G.p.x + 200, G.p.y); makeElite(e, 'magnet'); e.spd = 0; e.eT = 0.05; e.hp = e.maxHp = 1e9; G.enemies.push(e); const d0 = Math.hypot(G.p.x - e.x, G.p.y - e.y);
    await new Promise(q => setTimeout(q, 300)); return [d0, Math.hypot(G.p.x - e.x, G.p.y - e.y)]; });
  console.log(r); check(r[1] < r[0] * 0.8, 'pulled');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
