// 레벨 축하 (Build 117): 레벨 20·40에 도달하면 금고 +50·+100 + 알림, 다른 레벨은 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const bank = () => page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0);
  const lv = async to => { await page.evaluate(to => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.lvl = to - 1; G.need = xpNeed(G.lvl); G.xp = G.need + 0.5; }, to); await page.waitForTimeout(200); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); }); };
  const b0 = await bank(); await lv(19); const b1 = await bank(); await lv(20); const b2 = await bank();
  const ban = await page.evaluate(() => SH.G.banner && SH.G.banner.text); await page.screenshot({ path: `${OUT}/b117_lvl20.png` });
  await lv(40); const b3 = await bank(); console.log('bank', b1 - b0, b2 - b1, b3 - b2, ban);
  check(b1 === b0 && b2 - b1 === 50 && b3 - b2 === 100, 'milestone bank wrong'); check(ban && ban.includes('레벨 20'), 'no banner');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
