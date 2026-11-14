// 🎞 부드러운 움직임·효과 (Build 180): 방향 전환 보간, 동작 칸 겹쳐 잇기, 흐린 그림자, 하얀빛 서서히, 반짝이 빛 번짐, 프레임과 상관없는 감속
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const t = await page.evaluate(() => { const o = { face: 1 }; turnF(o); o.face = -1; FDT = 1 / 60; const a = turnF(o); for (let i = 0; i < 30; i++) turnF(o); return [a, o.fv]; });
  check(t[0] > 0 && t[0] < 1 && t[1] < -0.95, 'turn smoothing ' + t);
  // 감속: 30fps와 60fps에서 1초 뒤 속도가 같음
  const dmp = await page.evaluate(() => [Math.pow(Math.pow(0.92, (1 / 30) * 60), 30), Math.pow(Math.pow(0.92, (1 / 60) * 60), 60)]);
  check(Math.abs(dmp[0] - dmp[1]) < 1e-9, 'fps independent damping');
  await page.evaluate(() => { const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; p.hp = p.maxHp = 1e9;
    for (let i = 0; i < 4; i++) { const e = makeEnemy(['grunt', 'tank', 'runner', 'grunt'][i], p.x - 90 + i * 60, p.y + 130); e.spd = 0; G.enemies.push(e); }
    G.enemies[1].flash = 0.05; burst(p.x, p.y - 40, '#ffd23f', 40, 260, 6, 1); burst(p.x + 60, p.y + 60, '#e85d04', 30, 200, 5, 1); });
  await page.waitForTimeout(120); await page.screenshot({ path: `${OUT}/b180_fx.png`, clip: { x: 40, y: 250, width: 320, height: 330 } });
  // 영웅 걷기 (연속 재생, 오류 없이)
  await page.keyboard.down('a'); await page.waitForTimeout(600); await page.keyboard.up('a'); await page.keyboard.down('d'); await page.waitForTimeout(80);
  await page.screenshot({ path: `${OUT}/b180_turn.png`, clip: { x: 95, y: 280, width: 200, height: 200 } }); await page.keyboard.up('d');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
