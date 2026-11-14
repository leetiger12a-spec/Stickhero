// 💪 레벨 맞춤 세기 + 레전드 난이도 + 탑 21층 위 강화 (Build 166)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  check(await page.evaluate(() => document.querySelectorAll('#diffPills .pill').length === 5 && [...document.querySelectorAll('#diffPills .pill')].pop().textContent === '레전드'), 'legend pill');
  await page.screenshot({ path: `${OUT}/b166_title.png` });
  await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const G = SH.G, base = makeEnemy('grunt', 0, 0);
    G.lvl = 94; const hi = makeEnemy('grunt', 0, 0);
    G.lvl = 30; const at30 = makeEnemy('grunt', 0, 0);
    return { h1: base.hp, h94: hi.hp, d1: base.dmg, d94: hi.dmg, h30: at30.hp };
  });
  console.log(JSON.stringify(r));
  check(Math.abs(r.h94 / r.h1 - 2.6) < 0.01 && Math.abs(r.d94 / r.d1 - 1.768) < 0.01 && r.h30 === r.h1, 'level scale');
  // 10레벨마다 알림
  await page.evaluate(() => { const G = SH.G; G.lvl = 39; G.xp = G.need + 1; G.p.hp = G.p.maxHp = 1e6; }); await page.waitForTimeout(500);
  check(await page.evaluate(() => SH.G.lvl === 40 && SH.G.banner && SH.G.banner.text.includes('강해졌다')), 'lvl 40 banner');
  // 탑 25층: 체력 x1.3
  const t = await page.evaluate(() => { const G = SH.G; G.lvl = 1; SH.tower(20); const a = makeEnemy('grunt', 0, 0).hp; SH.tower(25); const c = makeEnemy('grunt', 0, 0).hp; return c / a; });
  check(Math.abs(t - 1.3) < 0.01, 'tower scale ' + t);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
