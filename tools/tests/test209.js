// Build 276: 🩸 핏빛 달 밤 — 보통 이상·3번째 밤부터 가끔, 적 2배·정예 +12%, 아침에 상자 + 보너스 2배
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__blood = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__ban = []; const r = window.banner; window.banner = (t, s, c, d) => { __ban.push(t + ' | ' + s); return r(t, s, c, d); }; });
  const night = n => page.evaluate(async n => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.nights = n; G.nightOn = false; G.blood = false; G.bt = NIGHT_START + NIGHT_CYCLE * 3 + 5; G.ghostDone = true; await new Promise(q => setTimeout(q, 250)); const r = { blood: !!G.blood, moon: !!G.moon, ban: __ban.join(' / ') }; __ban = []; return r; }, n);
  const a = await night(1), c = await night(2), m = await night(4); console.log(JSON.stringify([a, c, m]));
  check(!a.blood && c.blood && c.ban.includes('핏빛') && !m.blood && m.moon, 'blood on 3rd night+, not on full moon');
  await night(2); await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_CYCLE * 3 + 20; }); await page.waitForTimeout(200); await page.screenshot({ path: `${OUT}/b276_blood.png` });
  const g = await page.evaluate(async () => { const G = SH.G, g0 = G.gold, c0 = (G.chests || []).length; G.bt = NIGHT_START + NIGHT_CYCLE * 3 + NIGHT_LEN + 0.2; G.enemies = []; await new Promise(q => setTimeout(q, 250)); return { gain: G.gold - g0, chests: (G.chests || []).length - c0, blood: !!G.blood, n: ST.bloods }; });
  console.log(JSON.stringify(g)); check(g.gain >= (40 + 20 * 3) * 2 && g.chests === 1 && !g.blood && g.n === 1, 'blood morning: chest + double bonus');
  await page.evaluate(() => { SH.G.diff = 1; }); const e = await night(2); check(!e.blood, 'no blood on easy');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
