// 마을 확장: 마을회관 Lv2/3 → 울타리 넓어짐·출격문 이동·새 건물(농장·광산·시장)·바깥 망루·돌 성벽, 저장/불러오기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const stand = async (pred) => {
    const lb0 = await page.evaluate(pred => { const q = SH.G.pads.find(new Function('q', 'return ' + pred)); return padLabel(q); }, pred);
    for (let i = 0; i < 120; i++) {
      const lb = await page.evaluate(pred => { const G = SH.G, q = G.pads.find(new Function('q', 'return ' + pred));
        if (SH.state === 'allypick') SH.chooseAlly(0); if (SH.state === 'levelup') SH.choose(0);
        G.p.x = q.x; G.p.y = q.y + padOY(q); G.p.logs = G.p.cap; G.gold = Math.max(G.gold, 3000); G.stone = Math.max(G.stone, 100); return padLabel(q); }, pred);
      if (lb !== lb0) return; await page.waitForTimeout(100);
    }
    errors.push('stand timeout ' + pred);
  };
  const hallVis = () => page.evaluate(() => !!padCost(SH.G.pads.find(q => q.kind === 'hall')));
  check(!(await hallVis()), 'hall visible too early');
  await page.evaluate(() => { SH.G.towers.slice(0, 4).forEach(t => t.lvl = 1); SH.G.pads.filter(q => q.kind === 'tower' && q.idx < 4).forEach(q => q.built = true); SH.G.enemies.length = 0; SH.G.nextBoss = 999; SH.G.nextWave = 999; });
  check(await hallVis(), 'hall not visible after 4 towers');
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = -20; G.cam.y = -40; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b38_hall_pad.png` });
  // Lv2
  await stand("q.kind === 'hall'");
  let v = await page.evaluate(() => ({ l: SH.G.vLvl, r: WALL_R, gate: GATE.y, max: SH.G.base.maxHp, farm: !!padCost(SH.G.pads.find(q => q.id === 'farm')), market: !!padCost(SH.G.pads.find(q => q.id === 'market')) }));
  console.log('lv2', JSON.stringify(v)); check(v.l === 2 && v.r === 225 && v.gate === 188 && v.max === 2000 && v.farm && !v.market, 'village lv2 wrong');
  check(await page.evaluate(() => SH.G.trees.every(t => Math.hypot(t.x, t.y) >= WALL_R + 50)), 'tree inside walls');
  await stand("q.id === 'farm'"); await stand("q.id === 'mine'");
  check(await page.evaluate(() => SH.G.bld.farm === 1 && SH.G.bld.mine === 1), 'farm/mine not built');
  // 광산 생산
  const s0 = await page.evaluate(() => { SH.G.stone = 0; SH.G.mineT = 6.9; return 0; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.G.stone >= 1), 'mine produced nothing');
  // 농장 회복
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 60; SH.G.p.hp = 50; }); await page.waitForTimeout(1200);
  check(await page.evaluate(() => SH.G.p.hp > 52), 'farm did not heal');
  // 돌 성벽: 울타리 Lv5 → 6
  await page.evaluate(() => { SH.G.wallLvl = 5; });
  await stand("q.kind === 'wall'");
  check(await page.evaluate(() => SH.G.wallLvl >= 6), 'stone wall not built');
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = -60; G.cam.x = 0; G.cam.y = -80; }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b38_lv2.png` });
  // Lv3
  await stand("q.kind === 'hall'");
  v = await page.evaluate(() => ({ l: SH.G.vLvl, r: WALL_R, market: !!padCost(SH.G.pads.find(q => q.id === 'market')), outer: !!padCost(SH.G.pads.find(q => q.kind === 'tower' && q.idx === 4)) }));
  console.log('lv3', JSON.stringify(v)); check(v.l === 3 && v.r === 285 && v.market && v.outer, 'village lv3 wrong');
  await stand("q.id === 'market'"); await stand("q.kind === 'tower' && q.idx === 4");
  const g0 = await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 60; SH.G.marketT = 9.9; return SH.G.gold; }); await page.waitForTimeout(400);
  check(await page.evaluate(g0 => SH.G.gold > g0, g0), 'market no income');
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = -40; G.cam.x = 0; G.cam.y = -60; }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b38_lv3.png` });
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = 150; G.cam.y = 130; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b38_lv3_gate.png` });
  // 저장 → 새로고침 → 이어하기
  const before = await page.evaluate(() => { saveGame(); const G = SH.G; return JSON.stringify({ v: G.vLvl, b: G.bld, w: G.wallLvl, t: G.towers.map(t => t.lvl), max: G.base.maxHp }); });
  await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(300);
  const after = await page.evaluate(() => { const G = SH.G; return JSON.stringify({ v: G.vLvl, b: G.bld, w: G.wallLvl, t: G.towers.map(t => t.lvl), max: G.base.maxHp }); });
  console.log(before, after); check(before === after && await page.evaluate(() => WALL_R === 285), 'save/load mismatch');
  // 새 판은 Lv1
  await page.evaluate(() => SH.start()); check(await page.evaluate(() => SH.G.vLvl === 1 && WALL_R === 165 && GATE.y === 128), 'new game not reset');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
