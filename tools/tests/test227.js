// Build 301: 🎁 투기장 5웨이브마다 작은 상자, 10웨이브마다 큰 상자
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(400);
  const c = async w => page.evaluate(async w => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.chests = []; G.st.arena = w; G.st.timer = 0.05; await new Promise(q => setTimeout(q, 400)); if (G.boss) { if (G.intro) endIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); await new Promise(q => setTimeout(q, 300)); } return (G.chests || []).map(x => x.small ? 's' : 'b').join(''); }, w);
  const a = await c(4), b5 = await c(5), b10 = await c(10); console.log(a, b5, b10);
  check(a === '' && b5.includes('s') && b10.includes('b'), 'arena chests');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
