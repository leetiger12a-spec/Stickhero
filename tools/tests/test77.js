// 버틴 날 축하 (Build 118): 5일째 아침 이어하기 → 금고 +100 + 알림, 한 번만, 4일째는 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const bank = () => page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0);
  const dayTo = async d => { await page.evaluate(d => { SH.G.day = d; saveGame(); continueGame(); }, d); await page.waitForTimeout(3600); };
  const b0 = await bank(); await dayTo(4); const b1 = await bank(); await dayTo(5); const b2 = await bank();
  const ban = await page.evaluate(() => SH.G.banner && SH.G.banner.text); await page.screenshot({ path: `${OUT}/b118_day5.png` });
  await dayTo(5); const b3 = await bank(); console.log('bank', b1 - b0, b2 - b1, b3 - b2, ban);
  check(b1 === b0 && b2 - b1 === 100 && b3 === b2, 'day gift wrong'); check(ban && ban.includes('5일째'), 'no banner');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
