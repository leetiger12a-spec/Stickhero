// Build 363: 🤖 강철 거인 걷기 동작 시트 — 보스가 움직일 때 시트 칸이 바뀜, 크기는 원래 그림과 비슷
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bossN = 1; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.spawnAcc = -1e9; SH.spawnBoss(); endIntro(); const B = G.boss; B.x = G.p.x + 160; B.y = G.p.y - 40;
    const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === SPR.boss1_walk && arguments.length > 5) seen.add(Math.round(sx)); return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 1500)); CanvasRenderingContext2D.prototype.drawImage = d; return { frames: seen.size, loaded: !!SPR.boss1_walk }; });
  console.log(JSON.stringify(r)); check(r.loaded && r.frames >= 5, 'boss walk frames');
  await page.evaluate(() => { const G = SH.G, B = G.boss; B.x = G.p.x + 110; B.y = G.p.y - 60; G.cam.x = G.p.x; G.cam.y = G.p.y; }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b363_boss.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
