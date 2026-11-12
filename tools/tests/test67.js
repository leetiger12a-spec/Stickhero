// 콤보 (Build 108): 2.5초 안에 잡으면 이어짐, 끊기면 0, 10·50 콤보 금화, 최고 콤보 기록, 화면에 🔥 콤보
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.pending = 0; G.quests = []; });   /* Build 145: 콤보 퀘스트(Build 141)가 뽑히면 완료 금화가 섞여서 비움 */
  const kill = n => page.evaluate(n => { const G = SH.G; for (let i = 0; i < n; i++) { const e = makeEnemy('grunt', 300, 300); G.enemies.push(e); killEnemy(e); } G.gems = []; G.coins = []; G.pending = 0; }, n);
  const g0 = await page.evaluate(() => SH.G.gold); await kill(9); check(await page.evaluate(() => SH.G.combo) === 9, 'combo not 9');
  await kill(1); const r = await page.evaluate(g0 => ({ c: SH.G.combo, gold: SH.G.gold - g0 }), g0); console.log('10 combo', JSON.stringify(r)); check(r.c === 10 && r.gold === 10, 'combo 10 gift wrong');
  await kill(5); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b108_combo.png` });
  await page.waitForTimeout(2700); check(await page.evaluate(() => SH.G.combo) === 0, 'combo did not reset');
  await kill(1); check(await page.evaluate(() => SH.G.combo) === 1, 'combo did not restart');
  const g1 = await page.evaluate(() => SH.G.gold); await kill(49); const r2 = await page.evaluate(g1 => ({ c: SH.G.combo, gold: SH.G.gold - g1, best: SH.G.bestCombo, st: ST.bestCombo }), g1);
  console.log('50 combo', JSON.stringify(r2)); check(r2.c === 50 && r2.gold === 60 && r2.best === 50 && r2.st >= 50, 'combo 50 wrong');
  // 보스는 콤보에 안 셈
  await page.evaluate(() => { SH.spawnBoss(); SH.G.intro = null; const c = SH.G.combo; killEnemy(SH.G.boss); window.__c = [c, SH.G.combo]; }); const bc = await page.evaluate(() => __c); check(bc[0] === bc[1], 'boss counted');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
