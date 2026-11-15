// Build 220: 회오리 부메랑 3개(덜 정신없게, 한 개 힘 85) + 화면 더 넓게(620 기준)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9;
    G.weapons = { boomerang: MAX_WLV + 1 }; G.timers = {};
    for (let i = 0; i < 8; i++) { const e = makeEnemy('tank', G.p.x + 120 + i * 10, G.p.y); e.hp = e.maxHp = 1e9; e.spd = 0; e.dmg = 0; G.enemies.push(e); }
    let mx = 0; for (let k = 0; k < 30; k++) { await new Promise(q => setTimeout(q, 100)); mx = Math.max(mx, G.booms.filter(b => b.big).length); }
    return { mx, st: wStat('boomerang'), scale: SCALE };
  });
  console.log(JSON.stringify(r));
  check(r.st.count === 3 && r.st.dmg === 85, 'evo stat'); check(r.mx >= 3 && r.mx <= 6, 'big booms on screen ' + r.mx);
  check(Math.abs(r.scale - 412 / 620) < 0.01, 'scale');
  await page.evaluate(() => { SH.G.cam.x = SH.G.p.x; SH.G.cam.y = SH.G.p.y; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b220_boom.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
