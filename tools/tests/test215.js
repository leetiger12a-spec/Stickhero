// Build 282: 🎲 투기장 특별 웨이브 — 3·6·9…(5·10 배수 빼고) 거인/질주/떼
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'giant'; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 150; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(400);
  const h1 = await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = 2; return makeEnemy('grunt', 0, 0).maxHp; });
  await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ w: SH.G.st.arena, rule: SH.G.st.arenaRule, hp: makeEnemy('grunt', 0, 0).maxHp, ban: SH.G.banner && SH.G.banner.text }));
  console.log(JSON.stringify(r), h1); check(r.w === 3 && r.rule === 'giant' && r.hp > h1 * 2 && /거인/.test(r.ban), 'giant wave at 3');
  await page.waitForTimeout(1200); await page.screenshot({ path: `${OUT}/b282_giant.png` });
  await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.G.st.arena === 4 && !SH.G.st.arenaRule), 'normal wave 4');
  await page.evaluate(() => { SH.G.st.arena = 14; SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.G.st.arena === 15 && !SH.G.st.arenaRule), 'no rule on wave 15 (elite wave)');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
