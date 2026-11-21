// Build 273: 🎰 꾸미기 뽑기 — 금고 500, 잠긴 것 중 하나 열림, 꽝 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bank: 1200 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.click('#bWard'); await page.waitForTimeout(300);
  const n0 = await page.evaluate(() => ({ pool: gachaPool().length, locks: document.querySelectorAll('#ovWard .sw.lock').length }));
  await page.click('#bGacha'); await page.waitForTimeout(200);
  const r1 = await page.evaluate(() => ({ pool: gachaPool().length, bank: bankGold(), got: wardGot(), msg: document.getElementById('gachaMsg').textContent, locks: document.querySelectorAll('#ovWard .sw.lock').length }));
  console.log(JSON.stringify(n0), JSON.stringify(r1));
  check(r1.pool === n0.pool - 1 && r1.bank === 700 && r1.got.length === 1 && r1.msg.includes('열렸다'), 'one unlocked, paid 500');
  check(r1.locks < n0.locks, 'one fewer lock button');
  await page.screenshot({ path: `${OUT}/b273_gacha.png` });
  await page.click('#bGacha'); await page.click('#bGacha'); await page.waitForTimeout(200);
  const r2 = await page.evaluate(() => ({ bank: bankGold(), got: wardGot().length, msg: document.getElementById('gachaMsg').textContent }));
  console.log(JSON.stringify(r2)); check(r2.bank === 200 && r2.got === 2 && r2.msg.includes('모자라요'), 'not enough bank');
  // 열린 것은 고를 수 있음
  const k = r1.got[0]; const ok = await page.evaluate(k => { const kind = k[0], i = +k.slice(1), grid = { b: 'wardGrid', h: 'hatGrid', p: 'petGrid' }[kind]; const btn = document.getElementById(grid).children[i]; btn.click(); return btn.className; }, k);
  check(!ok.includes('lock'), 'unlocked item selectable');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
