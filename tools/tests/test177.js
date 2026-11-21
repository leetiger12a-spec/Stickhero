// Build 247: 새 정예 특기 — 🩹 재생(안 맞으면 체력 회복) · 💨 질주(가끔 2배 빠르게), 이름표 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.p.meleeCd = 1e9;
    const a = makeEnemy('tank', G.p.x + 250, G.p.y); makeElite(a, 'regen'); a.dmg = 0; a.spd = 0; a.hp = a.maxHp * 0.5; a.eT = 0.1; G.enemies.push(a);
    const h = makeEnemy('runner', G.p.x - 300, G.p.y); makeElite(h, 'haste'); h.dmg = 0; h.eT = 0.1; G.enemies.push(h);
    const x0 = h.x, hp0 = a.hp; await new Promise(q => setTimeout(q, 600)); const hasted = h.hasteT > 0, moved = h.x - x0;
    await new Promise(q => setTimeout(q, 1600));
    return { healed: a.hp > hp0, hasted, moved, kinds: Object.keys(ELITE_K).length };
  });
  console.log(JSON.stringify(r));
  check(r.healed, 'regen heals'); check(r.hasted && r.moved > 0, 'haste dash'); check(r.kinds === 7, 'five elite kinds');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.p.x; G.cam.y = G.p.y; }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b247_elite.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
