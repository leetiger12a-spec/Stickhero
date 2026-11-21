// Build 347: ⛲ 분수 행운 2종 — 🧲 줍는 범위 2배 · ⚡ 필살기 2배 빨리 (끝나면 원래대로)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G, m0 = G.p.magnet; G.fntK = 'mag'; G.fntT = 60; recalcStats(); const m1 = G.p.magnet;
    G.fntK = 'ult'; recalcStats(); const m2 = G.p.magnet; G.ult = 0; ultGain(5); const u1 = G.ult; G.fntT = 0; G.ult = 0; ultGain(5); const u0 = G.ult; return { m0, m1, m2, u0, u1, n: Object.keys(FNT).length }; });
  console.log(JSON.stringify(r)); check(r.m1 === r.m0 * 2 && r.m2 === r.m0 && r.u1 === r.u0 * 2 && r.n === 7, 'new lucks');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
