// 🖼 선명한 화면 (Build 174): 3배 화면 폰은 3배로 그림, 느리면 3 → 2 → 1.5 → 1.25 (기억)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(600);
  const a = await page.evaluate(() => ({ dpr: DPR, w: document.querySelector('canvas').width }));
  check(a.dpr === 3 && a.w === 1170, 'dpr3 ' + JSON.stringify(a));
  await page.screenshot({ path: `${OUT}/b174_dpr3.png` });
  const d = await page.evaluate(() => { for (let i = 0; i < 100; i++) perfWatch(0.031); return [DPR, localStorage.getItem('stickhero_dpr')]; });
  check(d[0] === 2 && d[1] === '2', 'slow → 2 ' + d);
  const e = await page.evaluate(() => { for (let i = 0; i < 100; i++) perfWatch(0.031); return DPR; });
  check(e === 1.5, 'slower → 1.5 ' + e);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
