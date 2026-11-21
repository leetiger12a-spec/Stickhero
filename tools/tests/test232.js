// Build 308: 🎲 투기장 특별 웨이브 2개 더 — ⚔ 정예 웨이브 · ✨ 황금 웨이브
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const r = await page.evaluate(() => { const G = SH.G, out = {}; for (const R of ['elitew', 'goldw']) { G.st.arenaRule = R; let el = 0, go = 0; for (let i = 0; i < 400; i++) { const e = makeEnemy('grunt', 0, 0); if (e.elite) el++; if (e.golden) go++; } out[R] = [el, go]; } return { out, n: Object.keys(ARENA_RULES).length }; });
  console.log(JSON.stringify(r)); check(r.n === 6 && r.out.elitew[0] > 100 && r.out.goldw[1] > 60, 'elite/gold waves');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
