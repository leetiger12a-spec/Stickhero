// Build 315: 🏆 투기장 최고 기록을 넘을 때마다(웨이브 3부터) 금고 +20×웨이브
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { ST.arenaBest = 3; const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const b0 = await page.evaluate(() => bankGold()); const g = [];
  for (let i = 0; i < 5; i++) { await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 1e9; SH.G.st.timer = 0.05; }); await page.waitForTimeout(350); g.push(await page.evaluate(() => bankGold())); }
  console.log(b0, g); check(g[2] === b0 && g[3] === b0 + 80 && g[4] === b0 + 180, 'record bonus waves 4,5');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
