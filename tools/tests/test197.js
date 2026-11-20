// 자폭병 덮치기 12칸 (Build 266)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const T = ['e_bomber'];
  check(await page.evaluate(T => T.every(k => SPR[k + '_atk'] && SPR[k + '_atk'].width > 0), T), 'sheets loaded');
  const seen = await page.evaluate(async T => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    T.forEach((t, i) => { const e = makeEnemy(t, G.p.x - 70 + i * 70, G.p.y - 90); e.spd = 0; e.dmg = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e); });
    const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img) { for (const k of T) if (img === SPR[k + '_atk']) seen.add(k); return d.apply(this, arguments); };
    for (let j = 0; j < 4; j++) { G.enemies.forEach(e => { e.lunge = ACTS.eatk; e.flash = 0; e.hitT = 0; }); await new Promise(q => setTimeout(q, 120)); }
    CanvasRenderingContext2D.prototype.drawImage = d; return [...seen];
  }, T);
  console.log('atk drawn', seen.join()); check(seen.length === 1, 'attack sheets drawn ' + seen);
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.p.x; G.cam.y = G.p.y - 60; G.enemies.forEach(e => { e.lunge = ACTS.eatk * 0.45; e.flash = 0; e.hitT = 0; }); }); await page.waitForTimeout(40);
  await page.screenshot({ path: `${OUT}/b266_atk.png`, clip: { x: 60, y: 230, width: 270, height: 220 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
