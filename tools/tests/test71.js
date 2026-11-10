// 무지개 구슬 (Build 112): 구슬이 떨어질 때 아주 가끔(0.3%) 함께 나옴(한 번에 1개), 다음 레벨 경험치의 60%, 주우면 "🌈 무지개 구슬!"
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.pending = 0; G.p.x = 0; G.p.y = 120; G.p.magnet = 10; });
  const n = await page.evaluate(() => { const G = SH.G; let c = 0; for (let i = 0; i < 4000; i++) { G.gems = []; dropGem(600, 600, 1); c += G.gems.filter(g => g.rainbow).length; } G.gems = []; return c; });
  console.log('rainbow /4000', n); check(n > 2 && n < 30, 'rate off');
  const one = await page.evaluate(() => { const G = SH.G, r = Math.random; Math.random = () => 0; for (let i = 0; i < 5; i++) dropGem(300, 300, 1); Math.random = r; const k = G.gems.filter(g => g.rainbow); return [k.length, k[0].v, G.need]; });
  console.log('one', one.join()); check(one[0] === 1 && one[1] >= 30 && one[1] >= Math.round(one[2] * 0.6), 'rainbow value/limit wrong');
  await page.evaluate(() => { const G = SH.G; G.cam.x = 300; G.cam.y = 300; G.p.x = 300; G.p.y = 230; }); await page.waitForTimeout(120); await page.screenshot({ path: `${OUT}/b112_rainbow.png` });
  const x0 = await page.evaluate(() => SH.G.xp + SH.G.lvl * 1e6); await page.evaluate(() => { const g = SH.G.gems.find(g => g.rainbow); SH.G.p.x = g.x; SH.G.p.y = g.y + 10; }); await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({ left: SH.G.gems.filter(g => g.rainbow).length, n: SH.G.rainbows, txt: SH.G.texts.some(t => t.text.startsWith('🌈')) }));
  console.log(JSON.stringify(r)); check(r.left === 0 && r.n === 1 && r.txt, 'pickup wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
