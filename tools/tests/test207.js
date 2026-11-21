// Build 274: 🍖 펫 간식 — 금고 300 → 고른 펫 경험치 +100, 최고 레벨이면 안 줌
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bank: 1000, bestStars: 10 })); localStorage.setItem('stickhero_pet', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.click('#bWard'); await page.waitForTimeout(300);
  check(await page.evaluate(() => document.getElementById('bTreat').textContent.includes('강아지')), 'treat button for puppy');
  const b0 = await page.evaluate(() => bankGold()); await page.click('#bTreat'); await page.waitForTimeout(150);
  const r = await page.evaluate(() => ({ xp: ST.petXp.puppy, lv: petLv('puppy'), bank: bankGold(), msg: document.getElementById('gachaMsg').textContent }));
  console.log(JSON.stringify(r)); check(r.xp === 100 && r.lv === 2 && r.bank === b0 - 300 && r.msg.includes('Lv 2'), 'treat gives xp, level up');
  await page.screenshot({ path: `${OUT}/b274_treat.png` });
  await page.evaluate(() => { ST.petXp.puppy = 9999; renderWard(); }); await page.click('#bTreat'); await page.waitForTimeout(100);
  check(await page.evaluate(b => bankGold() === b, r.bank), 'no treat at max');
  await page.click('#petGrid .sw[data-i="0"]'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('bTreat').style.display === 'none'), 'hidden without pet');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
