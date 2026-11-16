// Build 223: 아래 무기 칸·능력 줄·오른쪽 둥근 버튼 작게
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = [];
    Object.assign(G.weapons, { sword: 5, shotgun: 3, boomerang: 6, bolt: 2, hammer: 4, ice: 1, pistol: 5 }); for (const k of ['hp', 'speed', 'magnet', 'might', 'armor', 'bag']) G.passives[k] = 2; G.bag = [{ small: true }]; G.ultK = 100; });
  await page.waitForTimeout(500);
  const sz = await page.evaluate(() => ['bSos', 'bUlt', 'bBag'].map(id => { const r = document.getElementById(id).getBoundingClientRect(); return [id, Math.round(r.width), Math.round(r.bottom)]; }));
  console.log(JSON.stringify(sz)); check(sz.every(x => x[1] === 0 || (x[1] >= 52 && x[1] <= 60)), 'buttons about 54px');   // 가방은 통통 튀어서 조금 커짐
  await page.screenshot({ path: `${OUT}/b223_ui.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
