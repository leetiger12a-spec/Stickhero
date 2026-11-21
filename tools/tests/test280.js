// Build 365: 🌌 메뉴 창 배경 그림 — 일시정지·기록실 창 뒤에 menu_bg 그림, 레벨업·상자 창은 그대로(게임이 비침)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.keyboard.press('p'); await page.waitForTimeout(500);
  const r = await page.evaluate(() => ({ pause: getComputedStyle($('ovPause')).backgroundImage.includes('menu_bg'), lvl: getComputedStyle($('ovLevel')).backgroundImage.includes('menu_bg') }));
  console.log(JSON.stringify(r)); check(r.pause && !r.lvl, 'menu bg');
  await page.screenshot({ path: `${OUT}/b365_pause.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
