// Build 225~: 새 그림체 보스들 — 각 보스 그림이 불러와지고 등장 시 그려짐 (BN 목록만 늘리면 됨)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BN = [0, 1, 2, 3, 4, 5];
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  for (const n of BN) {
    const r = await page.evaluate(async n => {
      const G = SH.G, k = 'boss' + n; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; window.__bossN = n; SH.spawnBoss(); G.intro = null;
      const bo = G.boss; bo.hp = bo.maxHp = 1e9; bo.x = G.p.x + 120; bo.y = G.p.y - 60; bo.spd = 0;
      let seen = false; const d = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (img) { if (img === SPR[k] || img === SPR_SRC[k]) seen = true; return d.apply(this, arguments); };
      await new Promise(q => setTimeout(q, 300)); CanvasRenderingContext2D.prototype.drawImage = d;
      const h = SPR_SRC[k] && SPR_SRC[k].naturalHeight; G.enemies = []; G.boss = null; return { seen, h };
    }, n);
    check(r.seen && r.h === 480, `boss${n} ` + JSON.stringify(r));
  }
  check(await page.evaluate(() => SPR_SRC.boss_final && SPR_SRC.boss_final.naturalHeight === 480 && SPR.boss_final.width > 0), 'final boss loaded');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
