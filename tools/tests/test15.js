// 영구 강화: 게임 중 금화로 강화 → 게임오버 뒤 유지, 금고 저장, 시작 화면 강화
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const base = await page.evaluate(() => ({ hp: SH.G.p.maxHp, dmg: SH.G.p.dmgMul }));
  await page.evaluate(() => { SH.G.gold = 500; }); await page.click('#bPause'); await page.waitForTimeout(150);
  await page.click('#bShopP'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b35_shop_game.png` });
  await page.click('.sbuy >> nth=0'); await page.click('.sbuy >> nth=0'); await page.click('.sbuy >> nth=1');
  const after = await page.evaluate(() => ({ hp: SH.G.p.maxHp, dmg: SH.G.p.dmgMul, gold: SH.G.gold, up: JSON.parse(localStorage.getItem('stickhero_meta')).up }));
  console.log(JSON.stringify(base), JSON.stringify(after));
  check(after.up.hp === 2 && after.up.atk === 1 && after.hp > base.hp && after.dmg > base.dmg && after.gold === 500 - 40 - 109 - 50, 'buy in game failed');
  await page.click('#bShopOk'); await page.click('#bResume');
  // 게임오버 → 금고
  await page.evaluate(() => { SH.G.gold = 300; SH.killBase(); }); await page.waitForTimeout(2800);
  check(await page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')).bank === 150), 'bank wrong');
  check(await page.evaluate(() => document.getElementById('bestOver').textContent.includes('금고')), 'bank msg missing');
  await page.screenshot({ path: `${OUT}/b35_over.png` });
  // 시작 화면에서 금고로 강화
  await page.reload(); await page.waitForTimeout(500);
  await page.click('#bShopT'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b35_shop_title.png` });
  await page.click('.sbuy >> nth=5');   // 든든한 시작 60
  check(await page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')).bank === 90), 'bank spend wrong');
  await page.click('#bShopOk'); await page.click('#bStart'); await page.click('#bStart'); await page.waitForTimeout(300);   // 저장(부서진 마을)이 있으면 두 번 눌러 새로 시작
  const st = await page.evaluate(() => ({ gold: SH.G.gold, hp: SH.G.p.maxHp }));
  console.log('new run', JSON.stringify(st)); check(st.gold === 25 && st.hp === 120, 'upgrades not applied in new run');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
