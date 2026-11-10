// 화면 밖 표시 (Build 106): 미니맵에 보물 상자·유령 상자, 화면 가장자리에 👻·🎁 화살표 (화면 안이면 안 그림)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.p.x = 0; G.p.y = 120; });
  // 그린 화살표 세기
  await page.evaluate(() => { window.__arr = []; const r = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, x, y) { if (['👻', '🎁', '👑'].includes(t)) __arr.push(t); return r.apply(this, arguments); }; });
  const count = async () => { await page.evaluate(() => { __arr = []; }); await page.waitForTimeout(150); return page.evaluate(() => [...new Set(__arr)].sort().join('')); };
  check(await count() === '', 'arrows with nothing');
  // 먼 상자 + 먼 유령 상자 + 먼 보스
  await page.evaluate(() => { const G = SH.G; dropChest(700, 120); G.ghost = { x: -650, y: -300, t: 0, run: 0, rest: 0 }; G.ghostDone = true; G.bt = NIGHT_START + 20; });
  await page.waitForTimeout(100); await page.evaluate(() => { SH.spawnBoss(); const G = SH.G; G.intro = null; G.boss.x = 0; G.boss.y = 800; G.boss.spd = 0; });
  await page.waitForTimeout(200);
  let a = await count(); console.log('arrows', a); check(a === '🎁👻', 'arrows wrong (보스는 원래 화살표)');
  await page.screenshot({ path: `${OUT}/b106_arrows.png` });
  // 미니맵에 상자(주황 네모)·유령(하늘색 점) — drawMinimap 안 fillRect 색 확인
  const mm = await page.evaluate(() => { const seen = new Set(), c = CanvasRenderingContext2D.prototype, fr = c.fillRect; c.fillRect = function () { seen.add(this.fillStyle); return fr.apply(this, arguments); }; drawMinimap(10, 10, 140); c.fillRect = fr; return [...seen]; });
  check(mm.includes('#ffb703'), 'chest not on minimap');
  // 상자에 가까이 가면 🎁 화살표 없어짐
  await page.evaluate(() => { const G = SH.G; G.boss.hp = 0; G.boss.dead = true; G.boss = null; G.enemies = []; G.p.x = 600; G.p.y = 120; G.cam.x = 600; G.cam.y = 100; }); await page.waitForTimeout(300);
  a = await count(); console.log('near chest', a); check(!a.includes('🎁'), 'chest arrow while on screen');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
