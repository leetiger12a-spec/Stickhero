// 대박 상자 (Build 130): 큰 상자의 8%가 대박 — 무지개 빛, 열면 보상 3개 + 금화, 화면 제목 "🌟 대박 상자!", 작은 상자는 대박 안 됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.need = 1e9; G.p.x = 0; G.p.y = 300; });
  const rate = await page.evaluate(() => { const G = SH.G; let j = 0, sj = 0; for (let i = 0; i < 3000; i++) { G.chests = []; dropChest(500, 500); j += G.chests[0].jack ? 1 : 0; G.chests = []; dropChest(500, 500, true); sj += G.chests[0].jack ? 1 : 0; } G.chests = []; return [j, sj]; });
  console.log('jack /3000 big, small', rate.join()); check(rate[0] > 150 && rate[0] < 340 && rate[1] === 0, 'jack rate wrong');
  await page.evaluate(() => { const G = SH.G; dropChest(0, 200); G.chests[0].jack = true; G.cam.x = 0; G.cam.y = 200; }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b130_ground.png` });
  const g0 = await page.evaluate(() => SH.G.gold); await page.evaluate(() => { SH.G.chests[0].t = 1; SH.G.p.y = 210; }); await page.waitForTimeout(400);
  const r = await page.evaluate(g0 => ({ st: SH.state, title: $('chestTitle').textContent, n: document.querySelectorAll('#chestItems .ci').length, jack: $('ovChest').classList.contains('jack'), gold: SH.G.gold - g0 }), g0);
  console.log(JSON.stringify(r)); check(r.st === 'chest' && r.title.includes('대박') && r.n === 4 && r.jack && r.gold >= 150, 'jack chest open wrong');
  await page.waitForTimeout(2200); await page.screenshot({ path: `${OUT}/b130_open.png` });
  await page.click('#bChestOk'); await page.waitForTimeout(200);
  // 보통 상자는 jack 표시 없음
  await page.evaluate(() => { const G = SH.G; G.chests = []; dropChest(0, 200); G.chests[0].jack = false; G.chests[0].t = 1; G.p.x = 0; G.p.y = 210; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.state === 'chest' && !$('ovChest').classList.contains('jack') && !$('chestTitle').textContent.includes('대박')), 'normal chest marked jack');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
