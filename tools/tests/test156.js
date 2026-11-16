// Build 221: 마을에서 쉬는 동료 옆에 1초 서면 교대 (꽉 차면 마지막 동료가 쉬러 감)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = [];
    G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true;
    for (const t of ['sword', 'archer', 'bomber', 'shield']) hireAlly(t);
    const before = G.allies.map(a => a.type).join();
    const sp = benchSpots()[0]; G.p.x = sp.x + 5; G.p.y = sp.y + 5;
    await new Promise(q => setTimeout(q, 500)); const mid = G.allies.map(a => a.type).join(), gauge = G.benchStand && G.benchStand.t;
    await new Promise(q => setTimeout(q, 900));
    return { before, mid, gauge, after: G.allies.map(a => a.type).join(), bench: G.bench.map(a => a.type).join(), n: G.allies.length };
  });
  console.log(JSON.stringify(r));
  check(r.before === 'sword,archer' && r.mid === r.before && r.gauge > 0.2, 'gauge before swap');
  check(r.after === 'sword,bomber' && r.bench.includes('archer') && r.n === 2, 'swapped after 1s');
  // 계속 서 있어도 또 바뀌지 않음 (떠났다가 다시 와야 함)
  const again = await page.evaluate(async () => { await new Promise(q => setTimeout(q, 1500)); return SH.G.allies.map(a => a.type).join(); });
  check(again === r.after, 'no repeat swap ' + again);
  await page.screenshot({ path: `${OUT}/b221_swap.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
