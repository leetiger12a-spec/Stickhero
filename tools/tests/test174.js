// Build 244: 탑 새 특별 층 — 🐘 거인 층(크고 튼튼·느림) · 🩸 흡혈 층(잡으면 회복·적 공격 1.3배), 보상 배수
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 30, ach: { floor10: true, floor25: true } })); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  // 보통 층 기준
  const base = await page.evaluate(() => { window.__towerRule = null; SH.tower(12); const e = makeEnemy('grunt', 0, 0); return { hp: e.maxHp / 1, spd: e.spd, r: e.r, dmg: e.dmg }; });
  const g = await page.evaluate(() => { window.__towerRule = 'giant'; SH.tower(12); SH.G.p.hp = SH.G.p.maxHp = 1e6; const e = makeEnemy('grunt', 0, 0); return { rule: SH.G.st.rule, hp: e.maxHp, r: e.r, sc: e.scale, spd: e.spd, ban: SH.G.banner && SH.G.banner.text }; });
  console.log(JSON.stringify(base), JSON.stringify(g));
  check(g.rule === 'giant' && Math.abs(g.hp / base.hp - 2) < 0.01 && g.sc === 1.45 && g.spd < base.spd * 0.85 && g.ban.includes('거인'), 'giant floor');
  await page.waitForTimeout(1600); await page.screenshot({ path: `${OUT}/b244_giant.png` });
  const v = await page.evaluate(() => { window.__towerRule = 'vamp'; SH.tower(12); const p = SH.G.p; p.maxHp = 1000; p.hp = 500; const e = makeEnemy('grunt', p.x + 30, p.y); e.hp = 1; SH.G.enemies.push(e); const d = e.dmg; killEnemy(e); return { rule: SH.G.st.rule, hp: p.hp, d }; });
  console.log(JSON.stringify(v));
  check(v.rule === 'vamp' && v.hp === 530 && Math.abs(v.d / base.dmg - 1.3) < 0.01, 'vamp floor');
  const pr = await page.evaluate(() => { window.__towerRule = 'giant'; SH.tower(12); const g0 = SH.G.gold; SH.G.enemies.length = 0; stageClear(SH.G.p.x, SH.G.p.y); return SH.G.gold - g0; });
  check(pr === Math.round((15 + 12 * 6) * 1.6), 'giant prize ' + pr);
  // 무작위로 고를 때 6가지 모두 나올 수 있음
  check(await page.evaluate(() => Object.keys(TOWER_RULES).length === 6), 'six rules');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
