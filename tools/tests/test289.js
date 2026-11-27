// Build 389: ⛄ 눈사람 눈덩이 — 영웅이 가까우면 눈덩이를 던지고, 맞으면 잠깐 느려지고, 그림 오류 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const e = makeEnemy('e_snowman', G.p.x + 150, G.p.y - 40); e.spd = 0; e.hp = e.maxHp = 1e9; e.snowT = 0.2; G.enemies.push(e); G.cam.x = G.p.x + 60; G.cam.y = G.p.y - 20;
    let thrown = 0, slowed = false, t0 = performance.now();
    while (performance.now() - t0 < 4000) { if (G.ebullets.some(b => b.snow)) thrown = Math.max(thrown, G.ebullets.filter(b => b.snow).length); if (G.p.slowT > 0) slowed = true; if (thrown && slowed) break; await new Promise(q => setTimeout(q, 30)); }
    const far = makeEnemy('e_snowman', G.p.x + 600, G.p.y); far.spd = 0; far.hp = far.maxHp = 1e9; far.snowT = 0; G.enemies = [far]; G.ebullets.length = 0;
    await new Promise(q => setTimeout(q, 700)); const farShots = G.ebullets.filter(b => b.snow).length;
    return { thrown, slowed, farShots };
  });
  console.log(JSON.stringify(r));
  check(r.thrown >= 1 && r.slowed, 'snowball thrown and slows hero'); check(r.farShots === 0, 'no snowball when hero is far');
  await page.evaluate(() => { const G = SH.G; const e = makeEnemy('e_snowman', G.p.x + 140, G.p.y - 40); e.spd = 0; e.hp = e.maxHp = 1e9; e.snowT = 0; G.enemies = [e]; }); await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/b389_snowball.png`, clip: { x: 95, y: 280, width: 260, height: 200 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
