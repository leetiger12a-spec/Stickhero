// 안개 (Build 152): 날씨 차례에 반은 안개(25초) — 알림, 영웅 둘레만 보임, 적이 15% 더 아픔, 밤이 오면 걷힘, 비와 안개가 둘 다 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; });
  const hit = () => page.evaluate(() => { const e = makeEnemy('tank', 300, 300); e.hp = e.maxHp = 1e6; const r = Math.random; Math.random = () => 0.9; hurtEnemy(e, 100, 0, 0, 0); Math.random = r; return 1e6 - e.hp; });
  const d0 = await hit();
  await page.evaluate(() => { window.__weather = 'fog'; SH.G.bt = 100; SH.G.rainNext = 0.05; }); await page.waitForTimeout(400);
  const f = await page.evaluate(() => ({ fog: SH.G.fogOn, rain: SH.G.rainOn, ban: SH.G.banner && SH.G.banner.text })); console.log(JSON.stringify(f));
  check(f.fog > 20 && !f.rain && f.ban.includes('안개'), 'fog did not start');
  const d1 = await hit(); console.log('dmg', d0, d1); check(d1 === Math.round(d0 * 1.15), 'fog +15% wrong');
  await page.waitForTimeout(1800); await page.screenshot({ path: `${OUT}/b152_fog.png` });
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 1; }); await page.waitForTimeout(300); check(await page.evaluate(() => !SH.G.fogOn), 'fog in night');
  // 반반: 많이 돌리면 비·안개 둘 다
  const mix = await page.evaluate(() => { window.__weather = undefined; const G = SH.G; let fog = 0, rain = 0; for (let i = 0; i < 200; i++) { G.fogOn = 0; G.rainOn = 0; G.rainNext = 0; G.bt = 100; updRain(0.016, false); if (G.fogOn) fog++; if (G.rainOn) rain++; } G.fogOn = G.rainOn = 0; return [fog, rain]; });
  console.log('fog/rain of 200', mix.join()); check(mix[0] > 60 && mix[1] > 60, 'not both kinds');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
