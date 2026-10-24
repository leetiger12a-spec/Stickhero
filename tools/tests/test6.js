const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  const stand = async (i, ms) => { for (let k = 0; k < ms / 200; k++) { await pick(); await page.evaluate(i => { const G = SH.G, pd = G.pads[i]; G.p.logs = G.p.cap; G.gold = Math.max(G.gold, 900); G.p.x = pd.x; G.p.y = pd.y + padOY(pd); }, i); await page.waitForTimeout(200); } };
  await page.goto('file:///home/user/Stickhero/index.html'); await page.tap('#bStart');
  await stand(0, 1000); await stand(4, 1600); await stand(1, 1000);   // 망루0 → 울타리 → 망루1 (순서대로 열림)
  const ti = await page.evaluate(() => SH.G.pads.findIndex(p => p.kind === 'tavern'));
  check(await page.evaluate(i => !!padCost(SH.G.pads[i]), ti), 'tavern pad not visible');
  await stand(ti, 2400);
  check(await page.evaluate(() => SH.G.tavern), 'tavern not built');
  // 고용할 때마다 카드 고르기: 검사, 궁수, 궁수, 검사 순으로 골라 봄
  const order = [0, 1, 2, 2]; let shot = false;
  for (let k = 0; k < 60 && (await page.evaluate(() => SH.G.allies.length)) < 4; k++) {
    await stand(ti, 200);
    if (await page.evaluate(() => SH.state) === 'allypick') {
      if (!shot) { await page.screenshot({ path: (process.env.OUT||'.')+'/b17_allypick.png' }); shot = true; }
      const n = await page.evaluate(() => SH.G.allies.length);
      await page.tap(`.card >> nth=${order[n]}`); await page.waitForTimeout(150);
    }
  }
  const n = await page.evaluate(() => SH.G.allies.map(a => a.type).join(','));
  console.log('allies', n); check(n === 'sword,archer,bomber,bomber', 'allies wrong: ' + n);
  // 전투
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = 250; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; for (let i = 0; i < 14; i++) G.enemies.push(makeEnemy('grunt', rand(-120, 120), 380 + rand(0, 80))); });
  await page.waitForTimeout(400); await pick();
  await page.screenshot({ path: (process.env.OUT||'.')+'/b12_allies_fight.png' });
  const k0 = await page.evaluate(() => SH.G.kills);
  await page.waitForTimeout(3000); await pick();
  const k1 = await page.evaluate(() => SH.G.kills);
  console.log('kills by allies', k1 - k0); check(k1 - k0 >= 3, 'allies not killing');
  await page.evaluate(() => { const G = SH.G; G.enemies = []; G.p.x = 60; G.p.y = 40; });
  await page.waitForTimeout(800); await pick();
  await page.screenshot({ path: (process.env.OUT||'.')+'/b12_tavern.png' });
  // 스테이지 동행
  await page.evaluate(() => SH.enterStage()); await page.waitForTimeout(600); await pick();
  const near = await page.evaluate(() => SH.G.allies.every(a => Math.hypot(a.x - SH.G.p.x, a.y - SH.G.p.y) < 80));
  check(near, 'allies did not follow to stage');
  await page.evaluate(() => { SH.G.p.y = SH.G.st.groups[0].y + 250; }); await page.waitForTimeout(2500); await pick();
  await page.screenshot({ path: (process.env.OUT||'.')+'/b12_stage.png' });
  // 동료 쓰러짐 → 마을에서 부활
  await page.evaluate(() => { const a = SH.G.allies[0]; a.hp = 1; a.inv = 0; SH.G.enemies.push(makeEnemy('tank', a.x, a.y)); });
  await page.waitForTimeout(500); await pick();
  check(await page.evaluate(() => SH.G.allies[0].dead), 'ally did not get knocked out');
  await page.evaluate(() => { SH.returnBase(true); SH.G.allies[0].reviveT = 0.1; }); await page.waitForTimeout(500); await pick();
  check(await page.evaluate(() => !SH.G.allies[0].dead), 'ally did not revive');
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
