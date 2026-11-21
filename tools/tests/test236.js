// Build 313: 🍀 행운의 레벨업 — 가끔 카드 4장 (4번 키로도 고름)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__lucky = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.xp = SH.G.need + 1; }); await page.waitForTimeout(900);
  const n = await page.evaluate(() => ({ cards: document.querySelectorAll('#cards .card').length, lucky: !!document.querySelector('#cards .lucky') })); console.log(JSON.stringify(n));
  check(n.cards === 4 && n.lucky, '4 cards'); await page.screenshot({ path: `${OUT}/b313_lucky.png` });
  const w0 = await page.evaluate(() => JSON.stringify([SH.G.weapons, SH.G.passives])); await page.keyboard.press('4'); await page.waitForTimeout(300);
  check(await page.evaluate(w0 => SH.state !== 'levelup' && JSON.stringify([SH.G.weapons, SH.G.passives]) !== w0, w0) || await page.evaluate(() => SH.state !== 'levelup'), 'key 4 picks');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
