// Build 392: 🎄 크리스마스 트리 — 겨울에 선물을 주우면 장식 +1 (영구 저장), 12개면 완성 + 🪙500, 겨울이 아니면 안 늘고 안 보임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__winter = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const m = readJSON(META_KEY) || {}; delete m.xmas; writeJSON(META_KEY, m);
    for (let i = 0; i < 5; i++) useItem({ kind: 'gift' });
    const n5 = xmasData().n; let drawn = 0; const d0 = window.drawXmas; 
    const g0 = G.gold; for (let i = 0; i < 9; i++) useItem({ kind: 'gift' });
    const x = xmasData(), gain = G.gold - g0;
    window.__winter = false; useItem({ kind: 'gift' }); const nOff = xmasData().n; window.__winter = true;
    return { n5, n: x.n, done: x.done, gain, nOff, saved: (readJSON(META_KEY).xmas || {}).n };
  });
  console.log(JSON.stringify(r));
  check(r.n5 === 5, 'gift adds ornament'); check(r.n === 12 && r.done && r.saved === 12, 'tree completes at 12 and is saved'); check(r.gain >= 500, 'completion gives 500 gold'); check(r.nOff === 12, 'stops at 12');
  await page.evaluate(() => { const G = SH.G, P = xmasPos(); G.p.x = P.x - 90; G.p.y = P.y + 40; G.cam.x = P.x - 20; G.cam.y = P.y - 30; }); await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/b392_xmas.png`, clip: { x: 95, y: 250, width: 240, height: 220 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
