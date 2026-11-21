// Build 318: 🔥 하드 보스 러시 — 러시 1번 완주 뒤 열림, 보스 체력 2배, 완주하면 금고 800
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; SH.openMap(); }); await page.click('#bTower'); await page.waitForTimeout(150);
  check(await page.evaluate(() => !document.getElementById('bGoHRush')), 'locked');
  await page.evaluate(() => { ST.rushes = 1; SH.openMap(); }); await page.click('#bTower'); await page.waitForTimeout(150); await page.click('#bGoHRush'); await page.waitForTimeout(300);
  const b0 = await page.evaluate(() => bankGold()); let hp = 0;
  for (let i = 0; i < 5; i++) { const h = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.t = 99; for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); const B = G.boss, r = B.hard; hurtEnemy(B, 1e12, 0, 1, 0); return r; }); hp += h ? 1 : 0; await page.waitForTimeout(400); }
  const r = await page.evaluate(() => ({ bank: bankGold(), n: ST.hrushes })); console.log(hp, b0, JSON.stringify(r));
  check(hp === 5 && r.bank >= b0 + 800 && r.n === 1, 'hard rush');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
