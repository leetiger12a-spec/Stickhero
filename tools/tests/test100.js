// 보름달 밤 (Build 143): 5번째 밤은 보름달 — 알림, 적 나오는 비율 2배(보통 밤 1.5배), 아침 보너스 2배, 하늘에 큰 달
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__ban = []; const r = window.banner; window.banner = (t, s, c, d) => { __ban.push(t + ' | ' + s); return r(t, s, c, d); }; });
  const night = async nights => { await page.evaluate(n => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.p.inv = 0; G.nights = n; G.nightOn = false; G.bt = NIGHT_START + NIGHT_CYCLE * 3 + 5; G.ghostDone = true; }, nights); await page.waitForTimeout(250);
    return page.evaluate(() => { const r = { moon: !!SH.G.moon, ban: __ban.join(' / ') }; __ban = []; return r; }); };
  const a = await night(2); const m = await night(4); console.log(JSON.stringify(a), JSON.stringify(m));
  check(!a.moon && a.ban.includes('밤이') && m.moon && m.ban.includes('보름달'), 'moon on 5th night only');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_CYCLE * 3 + 20; }); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b143_moon.png` });
  // 아침 보너스 2배
  const g = await page.evaluate(async () => { const G = SH.G, g0 = G.gold; G.bt = NIGHT_START + NIGHT_CYCLE * 3 + NIGHT_LEN + 0.2; G.enemies = []; await new Promise(q => setTimeout(q, 250)); return { gain: G.gold - g0, nights: G.nights, moon: !!G.moon, moons: ST.moons, ban: __ban.join(' / ') }; });
  console.log(JSON.stringify(g)); check(g.ban.includes('🪙' + (40 + 20 * 5) * 2) && g.gain >= 280 && !g.moon && g.moons === 1, 'moon morning bonus wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
