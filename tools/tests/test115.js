// 탑 안 꾸미기 (Build 161): 하늘·성벽·마법진, 탑 전용 배너, 올라가는 연출, 층 돌파 빛기둥
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 12 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; SH.tower(3); }); await page.waitForTimeout(250);
  check(await page.evaluate(() => SH.G.banner && SH.G.banner.tw === 3 && SH.G.towerRise > 0), 'tower banner/rise');
  await page.screenshot({ path: `${OUT}/b161_rise.png` });
  await page.waitForTimeout(900); check(await page.evaluate(() => SH.G.towerRise === 0), 'rise ends');
  await page.screenshot({ path: `${OUT}/b161_floor3.png` });
  for (const f of [15, 42]) { await page.evaluate(f => { SH.tower(f); }, f); await page.waitForTimeout(2600); await page.evaluate(() => SH.skipIntro && SH.skipIntro()); await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/b161_floor${f}.png` }); }
  // 돌파 → 빛기둥
  await page.evaluate(() => { SH.tower(7); }); await page.waitForTimeout(300);
  await page.evaluate(() => { SH.G.p.hp = 1e6; SH.G.st.timer = 0.05; SH.G.enemies.length = 0; }); await page.waitForTimeout(700);
  check(await page.evaluate(() => SH.G.st.clear && !!SH.G.st.portal && SH.G.banner && SH.G.banner.tw === 7), 'clear fx');
  await page.screenshot({ path: `${OUT}/b161_clear.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
