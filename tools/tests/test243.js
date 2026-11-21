// Build 323: ✨ 투기장 20웨이브마다 황금 보스
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const g = w => page.evaluate(async w => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = w - 1; G.st.timer = 0.05; await new Promise(q => setTimeout(q, 400)); const B = G.boss, r = B && B.golden; if (G.intro) endIntro(); if (B) hurtEnemy(B, 1e13, 0, 1, 0); await new Promise(q => setTimeout(q, 300)); return r; }, w);
  const a = await g(10), c = await g(20); console.log(a, c); check(!a && c, 'gold at 20');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
