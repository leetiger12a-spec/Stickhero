// 🦸 새 그림체 영웅 (Build 176~177): 서 있기·베기·걷기 그림, 모자 위치, 머리띠 색
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(600);
  check(await page.evaluate(() => !!SPR.hero && !!SPR.hero_slash && !!SPR.hero_walk), 'sprites');
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.y = 150; });
  await page.waitForTimeout(300);
  const clip = { x: 95, y: 260, width: 200, height: 230 };
  await page.screenshot({ path: `${OUT}/b176_stand.png`, clip });
  await page.evaluate(() => { const p = SH.G.p; p.act = 'slash'; p.actT = 0.12; }); await page.waitForTimeout(16);
  await page.screenshot({ path: `${OUT}/b176_slash.png`, clip });
  await page.keyboard.down('d'); await page.waitForTimeout(350); await page.screenshot({ path: `${OUT}/b176_walk.png`, clip: { x: 95, y: 260, width: 260, height: 230 } }); await page.keyboard.up('d');
  // 모자 + 파란 머리띠
  await page.evaluate(() => { try { localStorage.setItem('stickhero_hat', '1'); } catch (e) {} if (typeof hatSel !== 'undefined') hatSel = 1; bandSel = Math.min(2, HEADBANDS.length - 1); applyHeadband(); }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b176_hat.png`, clip: { x: 60, y: 230, width: 300, height: 280 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
