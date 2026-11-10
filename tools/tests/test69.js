// 자석 아이템 (Build 110): 적을 잡으면 아주 가끔 떨어짐(한 번에 1개), 주우면 모든 구슬·금화가 끌려옴, 25초 뒤 사라짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.pending = 0; G.p.x = 0; G.p.y = 120; G.p.magnet = 10; G.need = 1e9; });
  // 확률: 1000마리 잡아 떨어진 수 (한 번에 1개만 있으니 줍지 않으면 1개)
  const n = await page.evaluate(() => { const G = SH.G; let c = 0; for (let i = 0; i < 3000; i++) { G.items = []; rollItem(500, 500); c += G.items.length; } G.items = []; const rnd = Math.random; Math.random = () => 0; for (let i = 0; i < 50; i++) rollItem(500, 500); Math.random = rnd; return [c, G.items.filter(i => i.kind === 'magnet').length]; });
  console.log('drops /3000, max on field', n.join()); check(n[0] > 3 && n[0] < 30, 'drop rate off'); check(n[1] === 1, 'more than one magnet');
  // 구슬·금화 멀리 깔고 자석 줍기
  await page.evaluate(() => { const G = SH.G; G.items = []; G.gems = []; G.coins = []; for (let i = 0; i < 20; i++) { dropGem(-500 + i * 50, 600, 1); dropCoin(500, -600 + i * 20); } dropItem('magnet', 0, 200); });
  await page.waitForTimeout(200); await page.screenshot({ path: `${OUT}/b110_magnet.png` });
  const before = await page.evaluate(() => [SH.G.gems.length, SH.G.coins.length]);
  await page.evaluate(() => { SH.G.p.y = 210; }); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.items.length === 0 && SH.G.gems.every(g => g.pull)), 'magnet not used');
  await page.waitForTimeout(3500); const after = await page.evaluate(() => [SH.G.gems.length, SH.G.coins.length]); console.log('gems/coins', before.join(), '->', after.join());
  check(after[0] === 0 && after[1] === 0, 'not all pulled');
  // 25초 뒤 사라짐
  await page.evaluate(() => { dropItem('magnet', 600, 600); SH.G.items[0].t = 24.9; }); await page.waitForTimeout(300); check(await page.evaluate(() => SH.G.items.length === 0), 'item did not expire');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
