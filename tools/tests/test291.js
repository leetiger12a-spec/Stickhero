// Build 391: 🎁 선물 쿠키 무리 — 겨울 마을에서 쿠키맨 6마리가 몰려오고, 잡으면 선물·사탕이 꼭 나오고, 겨울이 아니면 안 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__winter = true; window.__giftWT = 0.5; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.giftWT = 0.3; G.giftWaves = 0;
    await new Promise(q => setTimeout(q, 1200));
    const gc = G.enemies.filter(e => e.giftC && e.type === 'e_ginger'); const items0 = G.items.length;
    gc.forEach(e => killEnemy(e)); await new Promise(q => setTimeout(q, 60));
    const drops = G.items.length - items0;
    window.__winter = false; G.giftWT = 0; G.enemies = []; await new Promise(q => setTimeout(q, 600));
    return { n: gc.length, drops, waves: G.giftWaves || 0, offSeason: G.enemies.filter(e => e.giftC).length };
  });
  console.log(JSON.stringify(r));
  check(r.n === 6 && r.waves === 1, 'gift wave of 6 cookies'); check(r.drops === 6, 'every gift cookie drops a gift/candy'); check(r.offSeason === 0, 'no gift wave outside winter');
  await page.evaluate(() => { window.__winter = true; const G = SH.G; G.giftWT = 0; G.enemies = []; }); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.enemies.filter(e => e.giftC).forEach((e, i) => { e.x = G.p.x + 60 + (i % 3) * 45; e.y = G.p.y - 60 + Math.floor(i / 3) * 50; e.spd = 0; e.dmg = 0; }); G.cam.x = G.p.x + 100; G.cam.y = G.p.y - 40; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b391_giftwave.png`, clip: { x: 95, y: 260, width: 260, height: 200 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
