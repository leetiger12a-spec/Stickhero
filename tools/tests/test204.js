// Build 271: 👑 투기장 10웨이브마다 보스 — 보스를 잡아야 웨이브가 끝나고 큰 보상
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 150; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = 9; G.st.timer = 0.05; }); await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({ w: SH.G.st.arena, boss: SH.G.boss && SH.G.boss.name }));
  console.log(JSON.stringify(r)); check(r.w === 10 && r.boss === '불꽃 대마왕', 'boss at wave 10');
  await page.evaluate(() => { if (SH.G.intro) endIntro(); }); await page.waitForTimeout(1200);
  const t1 = await page.evaluate(() => SH.G.st.timer); await page.waitForTimeout(800); const t2 = await page.evaluate(() => SH.G.st.timer);
  check(t1 === t2, 'timer paused during boss ' + t1 + ' ' + t2);
  await page.screenshot({ path: `${OUT}/b271_boss.png` });
  const g0 = await page.evaluate(() => SH.G.gold);
  await page.evaluate(() => { const B = SH.G.boss; hurtEnemy(B, 1e12, 0, 1, 0); }); await page.waitForTimeout(800);
  const r2 = await page.evaluate(() => ({ w: SH.G.st.arena, gold: SH.G.gold, mode: SH.G.mode, clear: SH.G.st.clear }));
  console.log(JSON.stringify(r2), g0); check(r2.w === 11 && r2.gold >= g0 + 500 && r2.mode === 'stage' && !r2.clear, 'next wave after boss with reward');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
