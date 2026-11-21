// Build 287: 🧭 미니맵에 정예·황금 몬스터·떠돌이 상인 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const n = await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.weapons = {};
    const e = makeEnemy('grunt', 600, 300); makeElite(e, 'shield'); e.spd = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e); const g = makeEnemy('grunt', -600, 300); makeGolden(g); g.spd = 0; g.hp = g.maxHp = 1e9; G.enemies.push(g);
    let fills = 0; const o = CanvasRenderingContext2D.prototype.fill; CanvasRenderingContext2D.prototype.fill = function () { if (this.fillStyle === '#ff4d6d') fills++; return o.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 400)); CanvasRenderingContext2D.prototype.fill = o; return fills; });
  console.log('elite marker fills', n); check(n > 0, 'elite on minimap');
  await page.screenshot({ path: `${OUT}/b287_mini.png`, clip: { x: 0, y: 60, width: 120, height: 120 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
