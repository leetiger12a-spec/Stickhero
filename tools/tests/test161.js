// Build 229~: 새 그림체 마을 건물 — 그림이 불러와지고 마을 화면이 오류 없이 그려짐 (NB 목록만 늘리면 됨)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const NB = ['hall', 'hall2', 'hall3', 'hall_broken'];
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const r = await page.evaluate(NB => NB.map(n => [n, !!(SPR[n] && SPR[n].width > 0 && SPR_SRC[n] && SPR_SRC[n].naturalWidth > 0)]), NB);
  console.log(JSON.stringify(r)); check(r.every(x => x[1]), 'buildings loaded');
  for (const lv of [1, 2, 3]) { await page.evaluate(lv => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.vLvl = lv; G.p.x = 0; G.p.y = 90; }, lv); await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/b229_hall${lv}.png`, clip: { x: 106, y: 280, width: 200, height: 200 } }); }
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
