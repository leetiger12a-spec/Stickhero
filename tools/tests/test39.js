// 단계별 적 (Build 67): 같은 적은 시간이 지나도 세기 고정, 마을 시간·다음 날·모험 칸·탑 층에 따라 단계가 오르고 센 종류가 섞여 나옴, 단계 알림, 새 적 그림 9종
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const G = SH.G, out = {};
    out.sprites = TIERS.flat().every(t => !!SPR[t]);
    G.bt = 0; const h0 = makeEnemy('grunt', 0, 0).hp; G.bt = 900; const h1 = makeEnemy('grunt', 0, 0).hp; out.fixed = h0 === h1;
    out.tiers = [0, 100, 200, 400, 700].map(t => { G.bt = t; return Math.floor(tierNow()); }).join();
    G.bt = 100; G.day = 2; out.day2 = Math.floor(tierNow()); G.day = 1;
    const mix = t => { G.bt = t; const c = {}; for (let i = 0; i < 4000; i++) { const ty = tierType(tierNow()); const k = TIERS.findIndex(x => x.includes(ty)); c[k] = (c[k] || 0) + 1; } return c; };
    out.mix200 = mix(200); out.mix700 = mix(700); out.mix1000 = mix(1000);
    out.stage = [0, 3, 6, 9].map(i => { G.mode = 'stage'; G.st = { n: i, tower: 0 }; return Math.floor(tierNow()); }).join();
    out.tower = [1, 6, 11, 16, 30].map(f => { G.st = { n: 0, tower: f }; return Math.floor(tierNow()); }).join();
    G.mode = 'base'; G.st = null; G.bt = 0;
    return out;
  });
  console.log(JSON.stringify(r));
  check(r.sprites, 'tier sprites not loaded'); check(r.fixed, 'same enemy got stronger over time');
  check(r.tiers === '0,0,1,2,3', 'village tiers wrong'); check(r.day2 === 1, 'day 2 not faster');
  check(r.mix200[1] > r.mix200[0] * 0.3 && !r.mix200[2], 'tier 2 mix wrong'); check(r.mix1000[3] > r.mix1000[2] && r.mix1000[3] > 2000, 'late tier 4 not dominant');
  check(r.stage === '0,1,2,3', 'stage tiers wrong'); check(r.tower === '0,1,2,3,3', 'tower tiers wrong');
  // 단계 알림 + 화면에 센 적들
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.bt = 400; G.banner = null; });
  await page.waitForTimeout(300);
  const bn = await page.evaluate(() => SH.G.banner && SH.G.banner.text); console.log('banner', bn); check(bn && bn.includes('3단계'), 'tier banner missing');
  await page.evaluate(() => { const G = SH.G; G.banner = null; G.p.x = 0; G.p.y = 330; TIERS.slice(1).flat().forEach((t, i) => { const e = makeEnemy(t, -110 + (i % 3) * 110, 180 + Math.floor(i / 3) * 70); e.spd = 0; e.dmg = 0; G.enemies.push(e); }); });
  // 그림 있는 적은 막대 인간을 같이 그리지 않음 (Build 64~66 버그)
  const sticks = await page.evaluate(() => { let n = 0; const D = drawStickman; window.drawStickman = function () { n++; return D.apply(this, arguments); }; drawEnemy(SH.G.enemies.find(e => e.type === 'e_golem')); drawEnemy(SH.G.enemies.find(e => e.type === 'e_knight')); window.drawStickman = D; return n; });
  check(sticks === 0, 'stickman drawn over sprite enemy');
  await page.waitForTimeout(600); await page.screenshot({ path: `${OUT}/b67_tiers.png`, clip: { x: 20, y: 160, width: 350, height: 330 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
