// 무한 탑 지도 (Build 160): 탑 그림 · 층 버튼 · 보스 발코니 · 최고 기록 · 층 고르기 · 지도로 돌아가기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 12 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; SH.G.nextBoss = 999; SH.G.nextWave = 999; openMap(); }); await page.waitForTimeout(200);
  await page.click('#bTower'); await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({ fl: document.querySelectorAll('.tfl').length, done: document.querySelectorAll('.tfl.done').length, next: document.querySelector('.tfl.next')?.dataset.f,
    boss: document.querySelectorAll('.tbimg').length, lockB: document.querySelectorAll('.tbimg.lock').length, hero: !!document.querySelector('.thero'), h2: $('mapHead').querySelector('h2').textContent,
    back: $('bMapBack').style.display, card: $('mapCard').textContent, go: !!$('bGoTower'), imgsOk: [...document.querySelectorAll('.tbimg')].every(i => i.complete && i.naturalWidth > 0) }));
  console.log(JSON.stringify(r));
  check(r.fl === 30 && r.done === 12 && r.next === '13', 'floors');
  check(r.boss === 6 && r.lockB === 4 && r.imgsOk, 'boss balconies');
  check(r.hero && r.h2.includes('무한 탑') && r.back === '' && r.go && r.card.includes('13층'), 'view/card');
  await page.screenshot({ path: `${OUT}/b160_tower.png` });
  // 보스 층 고르기
  await page.click('.tfl[data-f="10"]'); await page.waitForTimeout(200);
  check(await page.evaluate(() => $('mapCard').textContent.includes('보스 층') && $('mapCard').textContent.includes('가 봤어요') && document.querySelector('.tfl.sel').dataset.f === '10'), 'select boss floor');
  await page.screenshot({ path: `${OUT}/b160_tower_boss.png` });
  // 꼭대기
  await page.evaluate(() => document.getElementById('mapScroll').scrollTop = 0); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b160_tower_top.png` });
  // 지도로 돌아가기
  await page.click('#bMapBack'); await page.waitForTimeout(200);
  check(await page.evaluate(() => document.querySelectorAll('.mnode').length === STAGES.length && !document.querySelector('.tfl') && $('bTower').style.display === ''), 'back to map');
  // 출격
  await page.click('#bTower'); await page.waitForTimeout(200); await page.click('#bGoTower'); await page.waitForTimeout(1000);
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.st.tower === 1), 'tower start');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
