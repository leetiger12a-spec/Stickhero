// Build 278: 💡 도감 보스 카드에 이기는 법
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200);
  const t = await page.evaluate(() => { const r = {}; for (const k of ['boss4', 'boss2', 'boss_final']) { showDexCard(k); const el = document.querySelector('#dexCard .btip'); r[k] = el && el.textContent; document.getElementById('dexCard').click(); } showDexCard('grunt'); r.grunt = !!document.querySelector('#dexCard .btip'); return r; });
  console.log(JSON.stringify(t)); check(t.boss4.includes('거미줄') && t.boss2.includes('불길') && t.boss_final.includes('이기는 법') && !t.grunt, 'boss tips in dex');
  await page.evaluate(() => { document.getElementById('dexCard').click(); showDexCard('boss4'); }); await page.waitForTimeout(200); await page.screenshot({ path: `${OUT}/b278_tip.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
