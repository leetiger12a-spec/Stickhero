// 밤 박쥐 떼 (Build 99): 낮엔 없음, 밤 3초 뒤부터 14초마다 한 방향에서 6마리 이상 (밤 수만큼 더), 빠름, 울타리 넘어옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const calm = () => page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = G.enemies.filter(e => e.nightBat); G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.pending = 0; G.weapons = {}; G.p.meleeCd = 99; });
  await calm(); await page.waitForTimeout(500);
  check(await page.evaluate(() => SH.G.enemies.filter(e => e.nightBat).length === 0), 'bats in day');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 3.2; SH.G.nights = 2; }); await page.waitForTimeout(250); await calm();
  const bats = await page.evaluate(() => { const B = SH.G.enemies.filter(e => e.nightBat), a = B.map(e => Math.atan2(e.y, e.x)); return { n: B.length, spread: Math.max(...a) - Math.min(...a), spd: B[0] && B[0].spd, base: makeEnemy('e_bat', 0, 0).spd, min: ETYPES.e_bat.spd * 0.9 * 1.3 }; });
  console.log('bats', JSON.stringify(bats)); check(bats.n === 8, 'swarm size not 8'); check(bats.spread < 0.8, 'not from one direction'); check(bats.spd >= bats.min * 0.999, 'bats not faster');   /* Build 138: 박쥐마다 ±10% 무작위라 다른 박쥐와 비교하면 흔들림 → 기본 속도×1.3×0.9 이상인지 */
  // 14초 뒤 다음 떼
  await page.evaluate(() => { SH.G.batT = 0.05; }); await page.waitForTimeout(250);
  const n2 = await page.evaluate(() => SH.G.enemies.filter(e => e.nightBat).length); console.log('after 2nd', n2); check(n2 >= 15, 'second swarm missing');
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b99_bats.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
