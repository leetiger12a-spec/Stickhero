// 비 오는 날 (Build 123): 마을 낮에 비 시작(알림) → 빗방울 + 적 10% 느림 + 나무 베기 빨라짐, 30초 뒤 또는 밤이 되면 그침
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; });
  check(await page.evaluate(() => !SH.G.rainOn), 'raining at start');
  await page.evaluate(() => { window.__weather = 'rain'; SH.G.bt = 100; SH.G.rainNext = 0.05; });   /* Build 152: 안개와 반반이라 비로 고정 */ await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ on: SH.G.rainOn > 0, ban: SH.G.banner && SH.G.banner.text, drops: SH.G.drops.length })); console.log(JSON.stringify(r));
  check(r.on && r.ban.includes('비') && r.drops > 10, 'rain did not start');
  // 적 속도: 비/안 비 비교
  const sp = await page.evaluate(async () => { const G = SH.G, mk = () => { const e = makeEnemy('grunt', 0, -900); e.spd = 60; G.enemies.push(e); return e; };
    let e = mk(), y0 = e.y; await new Promise(q => setTimeout(q, 700)); const a = e.y - y0; G.enemies = []; const keep = G.rainOn; G.rainOn = 0; G.rainNext = 999;
    e = mk(); y0 = e.y; await new Promise(q => setTimeout(q, 700)); const c = e.y - y0; G.enemies = []; G.rainOn = keep; return [a, c]; });
  console.log('moved rain/dry', sp.map(v => v.toFixed(1)).join('/')); check(sp[0] < sp[1] * 0.97 && sp[0] > sp[1] * 0.8, 'rain slow not ~10%');
  await page.screenshot({ path: `${OUT}/b123_rain.png` });
  // 밤이 되면 그침
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 1; }); await page.waitForTimeout(300); check(await page.evaluate(() => !SH.G.rainOn), 'rain during night');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
