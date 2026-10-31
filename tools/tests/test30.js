// 무기 발동 그림 액션: 칼·부메랑은 그림으로 돌고 날아감, 총·지팡이·망치는 쏘는 순간 영웅 손에 보임 (기본 + 진화)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const clip = { x: 75, y: 262, width: 240, height: 240 };
  for (const lv of [5, 6]) {
    await page.evaluate(lv => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9;
      G.p.x = 0; G.p.y = 300; G.enemies = [];
      G.weapons = { sword: lv, pistol: lv, shotgun: lv, boomerang: lv, bolt: lv, hammer: lv };
      for (let i = 0; i < 6; i++) { const e = makeEnemy('tank', 60 + i * 12, 300 + (i % 2 ? 40 : -30)); e.hp = e.maxHp = 1e9; e.spd = 0; G.enemies.push(e); }
      for (const id in G.weapons) G.timers[id] = 0; }, lv);
    const seen = new Set();
    for (let i = 0; i < 14; i++) {
      await page.waitForTimeout(90);
      const w = await page.evaluate(() => Object.keys(SH.G.wfx || {}).join()); w.split(',').filter(Boolean).forEach(x => seen.add(x));
      if (i === 1 || i === 6) await page.screenshot({ path: `${OUT}/b53_act${lv}_${i}.png`, clip });
      await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp; for (const e of G.enemies) e.hp = e.maxHp; });
    }
    console.log('lv', lv, 'poses', [...seen].sort().join()); check(['bolt', 'hammer', 'pistol', 'shotgun'].every(x => seen.has(x)), 'poses missing at lv ' + lv);
    const bm = await page.evaluate(() => SH.G.booms.length); check(bm > 0, 'no boomerangs');
  }
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
