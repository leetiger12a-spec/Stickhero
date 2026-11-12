// 보스 약점 (Build 150): 보스는 7초마다 2.5초 약점 타임(과녁) — 그때 피해 1.5배 + "약점!", 보통 적은 해당 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; G.p.x = 0; G.p.y = 330; SH.spawnBoss(); G.intro = null; G.boss.x = 0; G.boss.y = 120; G.boss.spd = 0; });
  const hit = () => page.evaluate(() => { const e = SH.G.boss, r = Math.random; Math.random = () => 0.9; const h = e.hp; hurtEnemy(e, 100, 0, 0, 0); Math.random = r; return h - e.hp; });
  const n0 = await page.evaluate(() => { SH.G.boss.weakT = 0; SH.G.boss.weakCd = 99; }) ; const d0 = await hit();
  await page.evaluate(() => { SH.G.boss.weakCd = 0.01; }); await page.waitForTimeout(150);
  const w = await page.evaluate(() => SH.G.boss.weakT); const d1 = await hit(); console.log('dmg normal/weak', d0, d1, 'weakT', w.toFixed(2));
  check(w > 2 && Math.abs(d1 / d0 - 1.5) < 0.02, 'weak x1.5 wrong'); check(await page.evaluate(() => SH.G.texts.some(t => t.text === '약점!')), 'no 약점 text');
  await page.evaluate(() => { const G = SH.G; G.cam.x = 0; G.cam.y = 150; }); await page.waitForTimeout(100); await page.screenshot({ path: `${OUT}/b150_weak.png` });
  await page.waitForTimeout(2600); check(await page.evaluate(() => !(SH.G.boss.weakT > 0)), 'weak did not end');
  // 보통 적은 해당 없음
  const g = await page.evaluate(() => { const e = makeEnemy('tank', 300, 300); e.hp = e.maxHp = 1e6; e.weakT = 5; const r = Math.random; Math.random = () => 0.9; const h = e.hp; hurtEnemy(e, 100, 0, 0, 0); Math.random = r; return h - e.hp; });
  check(g === d0, 'normal enemy got weak bonus');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
