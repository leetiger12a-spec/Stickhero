// 👹 레전드 보상 (Build 167): 금화 평균 1.5배, 레전드 업적 2개 (보스 10마리 · 10일째)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_diff', '4'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  check(await page.evaluate(() => document.querySelector('#diffPills .pill.on').textContent === '레전드' && document.body.textContent.includes('금화 1.5배')), 'legend selected/desc');
  await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => legendOn()), 'legendOn');
  // 금화 200개 줍기 → 약 300
  const got = await page.evaluate(async () => { const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies.length = 0; const g0 = G.gold;
    for (let i = 0; i < 200; i++) G.coins.push({ x: p.x, y: p.y, vx: 0, vy: 0, z: 0, vz: 0, pull: true, age: 1 });
    await new Promise(r => setTimeout(r, 1500)); return G.gold - g0; });
  console.log('gold from 200 coins', got); check(got > 250 && got < 350, 'legend coin x1.5 ' + got);
  // 업적
  const a = await page.evaluate(() => { ST.legBoss = 10; ST.legDay = 10; checkAch(); const m = JSON.parse(localStorage.getItem('stickhero_meta')); return [m.ach.leg_boss, m.ach.leg_day, ACH.length]; });
  check(a[0] && a[1] && a[2] === 50, 'legend ach ' + a);
  // 보스 잡으면 legBoss +1
  const lb = await page.evaluate(async () => { ST.legBoss = 0; SH.spawnBoss(0, 0); SH.skipIntro && SH.skipIntro(); const bo = SH.G.boss; bo.hp = 1; hurtEnemy(bo, 999999, 0, 0, 0); await new Promise(r => setTimeout(r, 200)); return ST.legBoss; });
  check(lb === 1, 'legBoss count ' + lb);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
