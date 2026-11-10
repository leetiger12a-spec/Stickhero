// 폭탄 아이템 (Build 111): 주우면 둘레 260 안의 적 큰 피해(보통 적은 쓰러짐), 먼 적은 그대로, 보스는 최대 체력 10%만
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.pending = 0; G.need = 1e9; G.p.x = 0; G.p.y = 120;
    for (let i = 0; i < 8; i++) { const a = i / 8 * 7, e = makeEnemy('tank', Math.cos(a) * 180, 120 + Math.sin(a) * 180); e.spd = 0; G.enemies.push(e); }
    const far = makeEnemy('tank', 700, 120); far.spd = 0; far.far = true; G.enemies.push(far); });
  await page.evaluate(() => { SH.spawnBoss(); const G = SH.G; G.intro = null; G.boss.x = 100; G.boss.y = 60; G.boss.spd = 0; G.p.meleeCd = 99; });
  await page.evaluate(() => dropItem('bomb', 0, 150)); await page.waitForTimeout(150);
  await page.evaluate(() => { SH.G.p.y = 160; }); await page.waitForTimeout(120);
  await page.screenshot({ path: `${OUT}/b111_bomb.png` });
  const r = await page.evaluate(() => { const G = SH.G; return { near: G.enemies.filter(e => !e.boss && !e.far && !e.dead).length, far: G.enemies.some(e => e.far && !e.dead && e.hp === e.maxHp), boss: +(1 - G.boss.hp / G.boss.maxHp).toFixed(3), used: G.items.length === 0 }; });
  console.log(JSON.stringify(r)); check(r.used && r.near === 0, 'near enemies survived'); check(r.far, 'far enemy hit'); check(r.boss >= 0.09 && r.boss <= 0.25, 'boss damage not ~10%');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
