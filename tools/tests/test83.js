// 무지개 + 금화 비 (Build 124): 낮에 비가 그치면 무지개(8초) + 3초 동안 영웅 둘레에 금화가 떨어짐, 밤 때문에 그치면 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.bt = 100; G.rainOn = 0.1; G.rainNext = 999; G.coins = []; G.p.magnet = 1; });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({ rb: SH.G.rainbowT, ban: SH.G.banner && SH.G.banner.text, coins: SH.G.coins.length, say: SH.G.say && SH.G.say.kind })); console.log(JSON.stringify(r));
  check(r.rb > 5 && r.ban.includes('무지개') && r.coins >= 3 && r.say === 'rainbow', 'rainbow/coins missing');
  await page.screenshot({ path: `${OUT}/b124_rainbow.png` });
  // 밤 때문에 그치면 무지개 없음
  await page.evaluate(() => { const G = SH.G; G.rainbowT = 0; G.coinRain = 0; G.rainOn = 20; G.bt = NIGHT_START + 1; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => !SH.G.rainOn && !(SH.G.rainbowT > 0)), 'rainbow after night stop');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
