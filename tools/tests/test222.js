// Build 290: 📰 새 버전 선물을 받으면 '새로 생긴 것' 카드 (지난번 빌드 뒤로, 최근 것부터 8개)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ lastBuild: 284, bank: 0 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1000);
  await page.click('#bMail', { force: true }); await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({ show: document.getElementById('dexCard').classList.contains('show'), rows: [...document.querySelectorAll('#dexCard .newsL div')].map(d => d.textContent), bank: bankGold() }));
  console.log(JSON.stringify(r)); check(r.show && r.rows.length === 8 && r.rows[0].includes('B300') && r.bank >= 100, 'news card B285~B290');
  await page.screenshot({ path: `${OUT}/b290_news.png` });
  await page.click('#dexCard .tap'); await page.waitForTimeout(150); check(await page.evaluate(() => !document.getElementById('dexCard').classList.contains('show')), 'closes');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
