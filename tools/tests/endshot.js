const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  await page.evaluate(() => { SH.G.stageN = 9; enterStage(9); SH.G.st.stars = 3; returnBase(true); }); await page.waitForTimeout(500);
  await page.click('#bClrOk'); for (let i = 1; i <= 3; i++) { await page.waitForTimeout(700); await page.screenshot({ path: `${process.env.OUT||'.'}/b26_end${i}.png` }); await page.click('#storyCap'); }
  await b.close(); console.log('errors', errs.length, errs.join('|')); })();
