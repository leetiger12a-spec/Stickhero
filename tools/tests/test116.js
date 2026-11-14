// 🚀 탑 체크포인트 (Build 162): 10층마다 다음 층부터 시작
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 7 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; SH.G.nextBoss = 999; openMap(); }); await page.click('#bTower'); await page.waitForTimeout(200);
  check(await page.evaluate(() => !$('bGoTowerCp') && $('mapCard').textContent.includes('11층에서')), 'no cp before 10');
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.bestFloor = 23; localStorage.setItem('stickhero_meta', JSON.stringify(m)); openMap(); });
  await page.click('#bTower'); await page.waitForTimeout(300);
  check(await page.evaluate(() => $('bGoTowerCp') && $('bGoTowerCp').textContent.includes('21층') && document.querySelectorAll('.ttro').length >= 3), 'cp button 21');
  await page.screenshot({ path: `${OUT}/b162_card.png` });
  await page.click('#bGoTowerCp'); await page.waitForTimeout(800);
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.st.tower === 21), 'start at 21');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
