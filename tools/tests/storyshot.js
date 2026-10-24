const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errs = []; const check = (c, m) => { if (!c) errs.push(m); };
  const page = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.waitForTimeout(700);
  await page.screenshot({ path: (process.env.OUT||'.')+'/b22_title.png' });
  await page.tap('#bStart'); await page.waitForTimeout(700);
  check(await page.evaluate(() => SH.state === 'story'), 'story not shown');
  for (let i = 1; i <= 3; i++) { await page.screenshot({ path: `${process.env.OUT||'.'}/b22_story${i}.png` }); await page.tap('#storyCap'); await page.waitForTimeout(700); }
  check(await page.evaluate(() => SH.state === 'play'), 'game not started after story');
  // 두 번째부터는 이야기 없이 바로
  await page.evaluate(() => localStorage.removeItem('stickhero_save')); await page.reload(); await page.waitForTimeout(500); await page.tap('#bStart'); await page.waitForTimeout(300);
  console.log('after reload', await page.evaluate(() => ({ st: SH.state, seen: localStorage.getItem('stickhero_story'), save: !!localStorage.getItem('stickhero_save'), btn: document.getElementById('bStart').textContent })));
  check(await page.evaluate(() => SH.state !== 'story'), 'story repeated');
  await b.close(); console.log('ERRORS:', errs.length); errs.forEach(e => console.log(e));
})();
