// 🗼 탑 지도 움직임 (Build 173): 깬 층 창문 반짝, 별똥별, 출발할 때 영웅이 날아오른 뒤 0.5초 뒤 입장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 12, tips: { rush: 1, cave: 1 } })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; openMap(); }); await page.click('#bTower'); await page.waitForTimeout(500);
  const r = await page.evaluate(() => ({ win: document.querySelectorAll('.twin').length, shoot: document.querySelectorAll('.tshoot').length }));
  check(r.win === 20 && r.shoot === 4, 'glow/shoot ' + JSON.stringify(r));   // 12층 중 보스 층 2개 빼고 10층 × 창문 2
  await page.screenshot({ path: `${OUT}/b173_map.png` });
  await page.click('#bGoTower'); await page.waitForTimeout(250);
  check(await page.evaluate(() => document.querySelector('.thero').classList.contains('go') && SH.G.mode === 'base'), 'hero flying, not yet in');
  await page.screenshot({ path: `${OUT}/b173_go.png` });
  await page.click('#bGoTower').catch(() => {}); await page.waitForTimeout(700);
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.st.tower === 1 && !towerGo.busy), 'entered once');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
