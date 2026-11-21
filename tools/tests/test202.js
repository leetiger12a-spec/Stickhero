// Build 269: 🎞 도감 카드에서 걷기 → 공격 움직임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1500);
  await page.evaluate(() => { ST.kc.e_charger = 5; showDexCard('e_charger'); }); await page.waitForTimeout(300);
  const seen = new Set(); for (let i = 0; i < 30; i++) { seen.add(await page.evaluate(() => { const l = document.querySelector('#dexCard .dexAnimLab'); return l && l.textContent.split(' · ')[0]; })); await page.waitForTimeout(150); }
  console.log([...seen]); check(seen.has('🚶 걷기') && seen.has('⚔ 공격'), 'walk and attack shown');
  check(await page.evaluate(() => !!document.querySelector('#dexCard canvas.dexAnim')), 'canvas');
  await page.screenshot({ path: `${OUT}/b269_dex.png` });
  await page.evaluate(() => { document.getElementById('dexCard').click(); showDexCard('boss_final'); }); await page.waitForTimeout(200);
  check(await page.evaluate(() => !document.querySelector('#dexCard canvas') && !!document.querySelector('#dexCard img')), 'boss keeps image');
  await page.evaluate(() => { document.getElementById('dexCard').click(); showDexCard('sword', true); }); await page.waitForTimeout(400);
  check(await page.evaluate(() => !!document.querySelector('#dexCard canvas.dexAnim')), 'ally anim');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
