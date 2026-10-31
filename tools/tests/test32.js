// 글꼴·디자인: 부분 글꼴에 게임 글자가 다 있는지, 글꼴이 실제로 불러와졌는지, 제목·버튼·HUD에 쓰였는지, 시작 화면은 흐리지 않게
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { execSync } = require('child_process');
(async () => {
  const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  try { console.log(execSync('python3 tools/fonts.py --check').toString().trim()); } catch (e) { errors.push('font subset missing glyphs: ' + e.stdout); }
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200);
  const f = await page.evaluate(async () => { await document.fonts.ready; return { jua: document.fonts.check('20px Jua', '레전드'), bhs: document.fonts.check('20px BHS', '레전드'),
    body: getComputedStyle(document.getElementById('bStart')).fontFamily, blur: getComputedStyle(document.getElementById('ovTitle')).backdropFilter }; });
  console.log(JSON.stringify(f)); check(f.jua && f.bhs, 'fonts not loaded'); check(f.body.startsWith('Jua') || f.body.startsWith('"Jua"'), 'button font not Jua'); check(f.blur === 'none', 'title blurred');
  await page.click('#bStart'); await page.waitForTimeout(400);
  await page.click('#bPause'); await page.waitForTimeout(200);
  const h = await page.evaluate(() => getComputedStyle(document.querySelector('#ovPause h2')).fontFamily); check(h.includes('BHS'), 'heading font not BHS');
  const quit = await page.evaluate(() => document.getElementById('bQuit').className); check(quit.includes('gray'), 'quit button class');
  await page.screenshot({ path: `${OUT}/b55_pause.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
