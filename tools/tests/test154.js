// Build 219: 화면 넓게(SCALE 540 기준) + 알림 작게 + 쉬는 동료가 숙소 옆에서 졸기(💤)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const sc = await page.evaluate(() => ({ SCALE, VW }));
  console.log(JSON.stringify(sc)); check(Math.abs(sc.SCALE - 412 / 540) < 0.01 && sc.VW > 530, 'wider view');
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = [];
    G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true;
    for (const t of ['sword', 'archer', 'bomber', 'shield']) hireAlly(t);
    G.p.x = pd.x - 40; G.p.y = pd.y + 130;
    let n = 0; const o = drawResting; window.drawResting = function (r) { n++; return o(r); };
    await new Promise(q => setTimeout(q, 300)); window.drawResting = o;
    return { spots: benchSpots().length, drawn: n };
  });
  console.log(JSON.stringify(r)); check(r.spots === 2 && r.drawn > 0, 'resting allies drawn');
  // 마을 밖(모험)에서는 안 보임
  check(await page.evaluate(() => { const m = SH.G.mode; SH.G.mode = 'stage'; const k = benchSpots().length; SH.G.mode = m; return k === 0; }), 'only in village');
  await page.evaluate(() => banner('적 진지에서 부대가 나왔다!', '작은 지도의 빨간 점 · 진지를 부수면 적이 줄어요', '#ffd23f', 2)); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b219_rest.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
