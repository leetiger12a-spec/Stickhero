// Build 257: ⭐ 별 강화 (금화 쓸 곳) + 보통 이상 더 어렵게
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { window.__noSale = true; localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bank: 999999, up: { hp: 10, atk: 9, spd: 8, mag: 6, luck: 8, start: 5 } })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.evaluate(() => openShop()); await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({ rows: [...document.querySelectorAll('#shopList .srow')].map(x => x.innerText.replace(/\s+/g, ' ')), btn: [...document.querySelectorAll('.sbuy')].map(x => x.textContent), hp: upPct('hp'), atk: upPct('atk') }));
  console.log(JSON.stringify(r, null, 1));
  check(r.rows[0].includes('Lv 10/10') || r.rows[0].includes('★0'), 'hp row at top'); check(r.btn[0] !== 'MAX', 'hp not max'); check(r.btn[2] === 'MAX', 'spd max');
  check(r.hp === 100 && r.atk === 54, 'pct before');
  await page.screenshot({ path: `${OUT}/b257_shop1.png` });
  await page.click('.sbuy >> nth=0'); await page.click('.sbuy >> nth=1'); await page.click('.sbuy >> nth=1'); await page.waitForTimeout(200);
  const r2 = await page.evaluate(() => ({ hp: upPct('hp'), atk: upPct('atk'), row: document.querySelector('#shopList .srow').innerText.replace(/\s+/g, ' '), bank: bankGold(), c11: upCost(UPGRADES[0], 11), c29: upCost(UPGRADES[0], 29) }));
  console.log(JSON.stringify(r2));
  check(r2.hp === 103 && r2.atk === 62, 'star pct'); check(r2.row.includes('★1/20'), 'star label'); check(r2.c29 > 20000, 'steep cost');
  await page.screenshot({ path: `${OUT}/b257_shop2.png` });
  const d = await page.evaluate(() => DIFFS.map(x => [x.name, x.ehp, x.edmg, x.boss]));
  console.log(JSON.stringify(d)); check(d[0][1] === 0.5 && d[2][1] === 1.3 && d[4][3] === 2.8, 'diffs');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
