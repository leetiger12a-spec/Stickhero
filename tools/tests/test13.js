// 영웅 꾸미기: 별로 열리는 머리띠 색, 색 바꾸기(그림·걷기·베기 모두), 기억
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(600);
  await page.click('#bWard'); await page.waitForTimeout(300);
  check(await page.evaluate(() => document.querySelectorAll('.sw.lock').length === 7), 'should be 7 locked');
  await page.click('.sw >> nth=1'); check(await page.evaluate(() => bandSel === 0), 'locked selectable');
  // 별 12개 모은 상태
  await page.evaluate(() => { localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 12 })); renderWard(); });
  check(await page.evaluate(() => document.querySelectorAll('.sw.lock').length === 3), 'unlock by stars wrong');
  await page.click('.sw >> nth=1'); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b33_ward.png` });
  // 머리띠 픽셀이 파랑으로 바뀌었는지
  const px = await page.evaluate(() => { const c = SPR_SRC.hero, x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data; let red = 0, blue = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 50) continue; if (d[i] > 120 && d[i] > d[i + 1] * 2.4 && d[i] > d[i + 2] * 2) red++; if (d[i + 2] > 120 && d[i + 2] > d[i] * 1.8) blue++; } return { red, blue }; });
  console.log('pixels', JSON.stringify(px)); check(px.blue > 500 && px.red < 100, 'recolor failed');
  check(await page.evaluate(() => SPR_SRC.hero_walk instanceof HTMLCanvasElement && SPR_SRC.hero_slash instanceof HTMLCanvasElement), 'sheets not recolored');
  await page.click('#bWardOk'); await page.waitForTimeout(200);
  // 새로고침 뒤 기억
  await page.reload(); await page.waitForTimeout(800);
  check(await page.evaluate(() => bandSel === 1 && SPR_SRC.hero instanceof HTMLCanvasElement), 'band not remembered');
  await page.screenshot({ path: `${OUT}/b33_title.png` });
  // 게임 화면 + 클리어 때 새 색 안내
  await page.click('#bStart'); await page.waitForTimeout(300);
  await page.evaluate(() => { localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 2 })); SH.G.stars = [3, 0]; enterStage(1); SH.G.st.stars = 3; returnBase(true); });
  await page.waitForTimeout(1200);
  check(await page.evaluate(() => document.getElementById('clrInfo').textContent.includes('새 머리띠')), 'new band message missing');
  await page.screenshot({ path: `${OUT}/b33_clear.png` });
  await page.evaluate(() => SH.ok()); await page.evaluate(() => { SH.G.p.act = 'slash'; SH.G.p.actT = 0.2; SH.G.banner = null; state = 'paused'; showOv(null); }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b33_game.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
