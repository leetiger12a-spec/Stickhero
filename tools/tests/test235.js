// Build 312: 🔥 상점 오늘의 할인 — 날마다 강화 1개 30% 할인
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bank: 1000 })); window.__saleDay = 1; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.click('#bShopT'); await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({ id: saleId(), btn: [...document.querySelectorAll('.sbuy')].map(b => b.textContent), tag: document.querySelectorAll('#shopList .sale').length }));
  console.log(JSON.stringify(r)); check(r.id === 'atk' && r.btn[1] === '🪙35' && r.btn[0] === '🪙40' && r.tag === 1, 'atk 50 → 35');
  await page.click('.sbuy >> nth=1'); await page.waitForTimeout(100); check(await page.evaluate(() => bankGold() === 965), 'paid sale price');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
