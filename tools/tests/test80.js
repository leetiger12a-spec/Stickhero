// 피해 숫자 켜기/끄기 (Build 121): 일시정지 화면 🔢 버튼, 끄면 피해 숫자가 안 뜸, 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const hit = () => page.evaluate(() => { const G = SH.G; G.weapons = {}; G.p.meleeCd = 99; G.texts = []; const e = makeEnemy('tank', 300, 300); e.hp = e.maxHp = 1e9; G.enemies = [e]; for (let i = 0; i < 20; i++) hurtEnemy(e, 10, 0, 0, 0); return G.texts.filter(t => /^\d+!?$/.test(t.text)).length; });
  check(await hit() === 20, 'numbers missing when on');
  await page.evaluate(() => togglePause()); await page.waitForTimeout(100); check(await page.evaluate(() => $('bNumP').textContent.includes('켬')), 'button text');
  await page.click('#bNumP'); await page.waitForTimeout(100); check(await page.evaluate(() => $('bNumP').textContent.includes('끔') && localStorage.getItem('stickhero_num') === '0'), 'toggle not saved');
  await page.screenshot({ path: `${OUT}/b121_pause.png` });
  await page.click('#bResume'); await page.waitForTimeout(100); check(await hit() === 0, 'numbers shown when off');
  await page.reload(); await page.waitForTimeout(700); check(await page.evaluate(() => numOn === false), 'not kept after reload');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
