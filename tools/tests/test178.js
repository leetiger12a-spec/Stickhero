// Build 248: 보스 새 기술 🎯 표적 쿵 — 영웅 자리에 빨간 원 → 1초 뒤 쿵 (안에 있으면 아프고, 피하면 안 아픔)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bossN = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const cast = () => page.evaluate(async () => {
    const G = SH.G; G.hazards = []; const bo = G.boss; bo.mode = 'walk'; bo.st = 0; const R = Math.random; Math.random = () => 0.7;
    await new Promise(q => requestAnimationFrame(() => requestAnimationFrame(q))); Math.random = R; return G.hazards.filter(h => h.slam).length;
  });
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.maxHp = 1000; G.p.hp = 1000; SH.spawnBoss(); G.intro = null; const bo = G.boss; bo.hp = bo.maxHp = 1e9; bo.spd = 0; bo.x = G.p.x + 260; bo.y = G.p.y; bo.weakCd = 99; G.weapons = {}; });
  const n = await cast(); console.log('slams', n); check(n >= 3, 'slam circles');
  await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/b248_slam.png` });
  // 안에 서 있기 → 아픔
  const hit = await page.evaluate(async () => { const G = SH.G, p = G.p, h = G.hazards.find(h => h.slam); p.x = h.x; p.y = h.y; p.inv = 0; const hp0 = p.hp; await new Promise(q => setTimeout(q, 1300)); return hp0 - p.hp; });
  // 피하기 → 안 아픔
  await cast();
  const dodge = await page.evaluate(async () => { const G = SH.G, p = G.p; p.hp = p.maxHp; for (const h of G.hazards) { h.x = p.x + 400; } p.inv = 0; const hp0 = p.hp; await new Promise(q => setTimeout(q, 1500)); return hp0 - p.hp; });
  console.log('hit', hit, 'dodge', dodge); check(hit > 0, 'slam hurts inside'); check(dodge === 0, 'no damage when dodged');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
