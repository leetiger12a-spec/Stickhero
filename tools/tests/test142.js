// 🧙 srunner 걷기 GIF GIF (Build 210): 12칸 시트 불러옴 · 걸을 때 칸이 바뀜 · 멈춰서 공격해도 오류 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => SPR_SRC.e_srunner_walk && SPR_SRC.e_srunner_walk.naturalWidth === 2268), 'sheet loaded');
  const frames = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const e = makeEnemy('e_srunner', G.p.x + 150, G.p.y - 80); e.dmg = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e);
    const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === SPR.e_srunner_walk && arguments.length > 5) seen.add(Math.round(sx)); return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 900)); CanvasRenderingContext2D.prototype.drawImage = d; return seen.size;
  });
  console.log('frames seen', frames); check(frames >= 4, 'walk frames ' + frames);
  await page.evaluate(() => { const G = SH.G, e = G.enemies[0]; e.x = G.p.x + 70; e.y = G.p.y - 60; e.spd = 0; G.cam.x = G.p.x; G.cam.y = G.p.y; }); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/b210_srunner.png`, clip: { x: 95, y: 300, width: 200, height: 200 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
