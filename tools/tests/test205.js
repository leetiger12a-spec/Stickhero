// Build 272: 🚪 투기장 5웨이브마다 10초 귀환 포털
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 150; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = 4; G.st.timer = 0.05; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => !SH.G.st.portal), 'no portal after wave 4');
  await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ w: SH.G.st.arena, p: !!SH.G.st.portal, life: SH.G.st.portal && SH.G.st.portal.life }));
  console.log(JSON.stringify(r)); check(r.w === 6 && r.p && r.life > 9, 'portal after wave 5');
  await page.waitForTimeout(800); await page.screenshot({ path: `${OUT}/b272_portal.png` });
  await page.evaluate(() => { SH.G.st.portal.life = 0.05; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => !SH.G.st.portal), 'portal closes');
  await page.evaluate(() => { SH.G.st.arena = 9; SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  await page.evaluate(() => { if (SH.G.intro) endIntro(); const B = SH.G.boss; if (B) hurtEnemy(B, 1e12, 0, 1, 0); }); await page.waitForTimeout(600);
  await page.evaluate(() => { const G = SH.G, P = G.st.portal; G.p.x = P.x; G.p.y = P.y; }); await page.waitForTimeout(1200);
  const r2 = await page.evaluate(() => ({ mode: SH.G.mode, best: ST.arenaBest }));
  console.log(JSON.stringify(r2)); check(r2.mode === 'base' && r2.best >= 10, 'left through portal after boss wave 10');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
