// Build 249: 💨 구르기 — 버튼/Shift로 가는 방향으로 휙, 잠깐 무적, 3.5초 기다림, 표적 쿵 피하기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => document.getElementById('bDash').classList.contains('show')), 'button shown');
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.x = 0; G.p.y = 60; G.p.ax = 1; G.p.ay = 0; });
  const x0 = await page.evaluate(() => SH.G.p.x);
  await page.click('#bDash'); await page.waitForTimeout(400);
  const r1 = await page.evaluate(() => ({ x: SH.G.p.x, cd: SH.G.dashCd, txt: document.getElementById('dashTx').textContent }));
  console.log(JSON.stringify({ x0, ...r1 })); check(r1.x - x0 > 100 && r1.x - x0 < 200, 'dashed right ' + (r1.x - x0)); check(r1.cd > 2.5 && /초/.test(r1.txt), 'cooldown shown');
  // 기다리는 동안은 안 됨
  const x1 = r1.x; await page.keyboard.press('Shift'); await page.waitForTimeout(300); check(await page.evaluate(x1 => Math.abs(SH.G.p.x - x1) < 5, x1), 'no dash during cooldown');
  // 무적: 구르는 동안 맞지 않음
  await page.evaluate(() => { SH.G.dashCd = 0; }); await page.waitForTimeout(100);
  const inv = await page.evaluate(() => { const p = SH.G.p; p.hp = p.maxHp; doDash(); hurtPlayer(50); return p.hp === p.maxHp; });
  check(inv, 'invulnerable while rolling');
  await page.screenshot({ path: `${OUT}/b249_dash.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
