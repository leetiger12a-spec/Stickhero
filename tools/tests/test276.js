// Build 360: 💡 금화 1500 넘으면 "금화 쓰기" 알림(4분에 1번), 일시정지에 이번 판 쓴 금화
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G, w = ms => new Promise(q => setTimeout(q, ms)); G.nextBoss = 999; G.t = 100; G.gold = 500; G.banner = null; await w(200); const low = G.richTold;
    G.gold = 3000; G.banner = null; await w(200); const b1 = G.banner && G.banner.text, t1 = G.richTold; G.banner = null; await w(200); const again = G.richTold !== t1 || (G.banner && G.banner.text.includes('금화가'));
    SH.openMap(); $('bSpend').onclick(); $('bSp_statue').click(); return { low, b1, again, spent: G.spentRun }; });
  await page.evaluate(() => { showOv(null); state = 'play'; }); await page.keyboard.press('p'); await page.waitForTimeout(300);
  const ps = await page.evaluate(() => $('pauseStats').textContent);
  console.log(JSON.stringify(r), ps.slice(0, 200)); check(r.low === undefined && r.b1 && r.b1.includes('금화가') && !r.again && r.spent === 500 && ps.includes('이번 판 쓴 금화') && ps.includes('500'), 'rich tip');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
