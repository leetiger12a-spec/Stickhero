// Build 224: 새 그림체 대왕 슬라임 보스 — 그림 불러옴 + 보스 등장 시 그려짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => SPR_SRC.boss0 && SPR_SRC.boss0.naturalHeight === 480), 'boss0 loaded');
  const drawn = await page.evaluate(async () => {
    const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.bossCount = 0; SH.spawnBoss(); G.intro = null; const bo = G.boss; bo.hp = bo.maxHp = 1e9; bo.x = G.p.x + 120; bo.y = G.p.y - 60; bo.spd = 0;
    let seen = false; const d = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img) { if (img === SPR.boss0 || img === SPR_SRC.boss0) seen = true; return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 400)); CanvasRenderingContext2D.prototype.drawImage = d; G.cam.x = bo.x; G.cam.y = bo.y; return seen;
  });
  check(drawn, 'boss0 drawn'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b224_boss0.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
