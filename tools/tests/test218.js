// Build 285: 🎟 투기장 하루 첫 입장 무료, 같은 날 두 번째는 100
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 30; SH.openMap(); }); await page.click('#bArena'); await page.waitForTimeout(150);
  const c1 = await page.evaluate(() => document.getElementById('mapCard').innerText); check(c1.includes('무료'), 'free text'); await page.screenshot({ path: `${OUT}/b285_free.png` });
  await page.click('#bGoArena'); await page.waitForTimeout(300); check(await page.evaluate(() => SH.G.gold === 30 && SH.G.mode === 'stage'), 'free entry with 30 gold');
  await page.evaluate(() => SH.returnBase(true)); await page.waitForTimeout(300);
  await page.evaluate(() => { SH.G.gold = 30; SH.openMap(); }); await page.click('#bArena'); await page.waitForTimeout(150);
  check(await page.evaluate(() => !document.getElementById('bGoArena') && document.getElementById('mapCard').innerText.includes('모자라요')), 'second entry costs 100');
  await page.evaluate(() => { SH.G.day++; SH.openMap(); }); await page.click('#bArena'); await page.waitForTimeout(150);
  check(await page.evaluate(() => document.getElementById('mapCard').innerText.includes('무료')), 'free again next day');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
