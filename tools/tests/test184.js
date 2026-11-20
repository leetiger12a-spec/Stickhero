// Build 254: 🛒 떠돌이 상인 — 낮에 나타나 물건 하나, 옆에 1.2초 서면 금화로 사요, 모자라면 못 사요, 40초 뒤 떠남
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.gold = 0;
    const R = Math.random; Math.random = () => 0.4; G.merchT = 0.05; await new Promise(q => setTimeout(q, 200)); Math.random = R;
    const m = G.merchant; if (!m) return { none: true };
    const k = m.k, price = m.price; G.p.x = m.x; G.p.y = m.y; G.p.hp = G.p.maxHp * 0.5;
    await new Promise(q => setTimeout(q, 1500)); const stillPoor = !!G.merchant;
    G.cam.x = m.x; G.cam.y = m.y;
    G.gold = 10000; const bag0 = (G.bag || []).length; await new Promise(q => setTimeout(q, 1600));
    return { k, price, stillPoor, gone: !G.merchant, gold: G.gold, hp: G.p.hp / G.p.maxHp, bag: (G.bag || []).length - bag0, ult: G.ult };
  });
  console.log(JSON.stringify(r));
  check(!r.none, 'merchant appeared'); check(r.stillPoor, 'no buy without gold');
  check(r.gone && r.gold === 10000 - r.price, 'bought with gold');
  check(r.k === 'heal' ? r.hp === 1 : r.k === 'chest' ? r.bag === 1 : r.ult === 100, 'item effect ' + r.k);
  // 떠남
  const left = await page.evaluate(async () => { const G = SH.G; G.merchT = 0.05; await new Promise(q => setTimeout(q, 200)); if (!G.merchant) return 'none'; G.p.x = G.merchant.x + 300; G.merchant.t = 0.1; await new Promise(q => setTimeout(q, 300)); return !G.merchant; });
  check(left === true, 'leaves after time ' + left);
  await page.evaluate(async () => { const G = SH.G; G.merchT = 0.05; await new Promise(q => setTimeout(q, 200)); if (G.merchant) { G.p.x = G.merchant.x - 70; G.p.y = G.merchant.y + 40; G.cam.x = G.merchant.x; G.cam.y = G.merchant.y; } }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b254_merchant.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
