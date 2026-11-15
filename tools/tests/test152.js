// 🧙 새 그림체 바위 골렘 (제미나이) (Build 217): 그림 불러옴 + 화면에 그려짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const ok = await page.evaluate(() => ['e_golem'].map(k => SPR[k] && SPR[k].width > 0 && SPR_SRC[k] && SPR_SRC[k].naturalHeight === 256));
  check(ok.every(Boolean), 'sprites ' + ok);
  const drawn = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    ['e_golem'].forEach((t, i) => { const e = makeEnemy(t, G.p.x - 60 + i * 60, G.p.y - 70); e.spd = 0; e.dmg = 0; G.enemies.push(e); });
    const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img) { for (const k of ['e_golem']) if (img === SPR[k] || img === SPR[k + '_walk']) seen.add(k); return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 300)); CanvasRenderingContext2D.prototype.drawImage = d; return [...seen].length;
  });
  check(drawn === 1, 'drawn ' + drawn);
  await page.evaluate(() => { SH.G.cam.x = SH.G.p.x; SH.G.cam.y = SH.G.p.y - 40; }); await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b217_golem.png`, clip: { x: 60, y: 250, width: 270, height: 260 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
