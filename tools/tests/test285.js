// Build 384·386: ⛄ 눈사람 통통 걷기 (12칸 시트, 12번 칸 ✦ 뺌) — 걸을 때 칸이 바뀌고 12번 칸은 안 씀
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => SPR_SRC.e_snowman_walk && SPR_SRC.e_snowman_walk.naturalWidth === 2424), 'sheet loaded');
  // Build 386: 눈사람은 몸이 흰색 — 흰 얼굴·몸이 구멍으로 지워지면 안 됨 (걷기·공격 12칸 모두 얼굴 가운데·몸 가운데가 불투명)
  const solid = await page.evaluate(() => ['e_snowman_walk', 'e_snowman_atk'].every(k => { const im = SPR_SRC[k], c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const cw = c.width / 12;
    for (let i = 0; i < 12; i++) for (const y of [0.4, 0.8]) if (x.getImageData(Math.floor(i * cw + cw / 2), Math.floor(c.height * y), 1, 1).data[3] < 200) return false; return true; }));
  console.log('snowman body solid', solid); check(solid, 'snowman white face/body not cut out');
  const frames = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const e = makeEnemy('e_snowman', G.p.x + 150, G.p.y - 80); e.dmg = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e);
    const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === SPR.e_snowman_walk && arguments.length > 5) seen.add(Math.round(sx / 202)); return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 2500)); CanvasRenderingContext2D.prototype.drawImage = d; return [...seen];
  });
  console.log('frames seen', frames); check(frames.length >= 4 && !frames.includes(11), 'walk frames ' + frames);
  await page.evaluate(() => { const G = SH.G, e = G.enemies[0]; e.x = G.p.x + 70; e.y = G.p.y - 60; e.spd = 0; G.cam.x = G.p.x; G.cam.y = G.p.y; }); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/b384_snowman.png`, clip: { x: 95, y: 300, width: 200, height: 200 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
