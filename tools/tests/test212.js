// Build 279: 🎞 도감 그림을 누르면 자동 → 걷기만 → 공격만 → 자동 (카드는 안 닫힘)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1500);
  await page.evaluate(() => showDexCard('e_bat')); await page.waitForTimeout(300);
  const labs = async (k = 14) => { const s = new Set(); for (let i = 0; i < k; i++) { s.add(await page.evaluate(() => document.querySelector('#dexCard .dexAnimLab').textContent.split(' ')[0] + ' ' + document.querySelector('#dexCard .dexAnimLab').textContent.split(' ')[1])); await page.waitForTimeout(140); } return [...s]; };
  await page.click('#dexCard canvas.dexAnim'); await page.waitForTimeout(100); const w = await labs();
  await page.click('#dexCard canvas.dexAnim'); await page.waitForTimeout(100); const a = await labs();
  console.log(w, a); check(w.length === 1 && w[0].includes('걷기') && a.length === 1 && a[0].includes('공격'), 'walk-only then attack-only');
  check(await page.evaluate(() => document.getElementById('dexCard').classList.contains('show')), 'card stays open');
  await page.screenshot({ path: `${OUT}/b279_dex.png` });
  await page.click('#dexCard canvas.dexAnim'); await page.waitForTimeout(100); const au = await labs(24); check(au.length === 2, 'back to auto');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
