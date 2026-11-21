// Build 286: 🏆 투기장 TOP 5 — 끝날 때마다 기록, 웨이브 높은 순 5개, 입장 카드에 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  for (const w of [3, 8, 1, 5, 12, 2]) {
    await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 500; G.arenaDay = 0; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(250);
    await page.evaluate(w => { SH.G.st.arena = w + 1; SH.returnBase(false); }, w); await page.waitForTimeout(200);
  }
  const top = await page.evaluate(() => ST.arenaTop.map(t => t.w)); console.log(top.join()); check(top.join() === '12,8,5,3,2', 'top 5 sorted');
  await page.evaluate(() => SH.openMap()); await page.click('#bArena'); await page.waitForTimeout(150);
  check(await page.evaluate(() => document.getElementById('mapCard').innerText.includes('🥇 웨이브 12')), 'shown in card');
  await page.screenshot({ path: `${OUT}/b286_top.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
