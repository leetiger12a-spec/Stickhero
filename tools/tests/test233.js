// Build 309: 🏟 투기장 기세 — 웨이브마다 공격 +3% (최대 +60%), 나가면 원래대로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const d0 = await page.evaluate(() => SH.G.p.dmgMul);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  for (let i = 0; i < 4; i++) { await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 1e9; SH.G.st.timer = 0.05; }); await page.waitForTimeout(350); }
  const d1 = await page.evaluate(() => SH.G.p.dmgMul); await page.evaluate(() => SH.returnBase(true)); await page.waitForTimeout(200); const d2 = await page.evaluate(() => SH.G.p.dmgMul);
  console.log(d0, d1, d2); check(Math.abs(d1 / d0 - 1.12) < 0.01 && Math.abs(d2 - d0) < 1e-9, 'momentum');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
