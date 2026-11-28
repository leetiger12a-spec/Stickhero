// Build 344: 🌑 투기장 일식 웨이브 — 어둠 그리기(오류 없음), 금화 2배
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'eclipse'; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arenaRule = null; const g0 = makeEnemy('grunt', 0, 0).gold; G.st.arenaRule = 'eclipse'; const g1 = makeEnemy('grunt', 0, 0).gold;
    let dark = 0; const f = CanvasRenderingContext2D.prototype.createRadialGradient; CanvasRenderingContext2D.prototype.createRadialGradient = function () { dark++; return f.apply(this, arguments); };
    G.st.acc = 6; await new Promise(q => setTimeout(q, 1500)); CanvasRenderingContext2D.prototype.createRadialGradient = f; return { g0, g1, dark, n: Object.keys(ARENA_RULES).length }; });
  console.log(JSON.stringify(r)); check(r.g1 === Math.ceil(r.g0 * 2) && r.dark > 10 && r.n === 8, 'eclipse wave');
  await page.screenshot({ path: `${OUT}/b344_eclipse.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
