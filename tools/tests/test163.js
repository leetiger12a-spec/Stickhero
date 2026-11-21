// Build 233: 도감 크게 보기 — 잡은 몬스터·보스·동료 칸을 누르면 큰 그림 카드, 다시 누르면 닫힘, 못 만난 칸은 안 열림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { ST.kc.grunt = 50; ST.bk[BOSSES[0].name] = 3; ST.alv.sword = 3; togglePause(); openDex(); });
  await page.waitForTimeout(200);
  await page.click('.dex[data-k="boss0"]'); await page.waitForTimeout(200);
  const c1 = await page.evaluate(() => ({ on: document.getElementById('dexCard').classList.contains('show'), t: document.getElementById('dexCard').textContent }));
  console.log(JSON.stringify(c1)); check(c1.on && c1.t.includes('800') && c1.t.includes('3번'), 'boss card');
  await page.screenshot({ path: `${OUT}/b233_card.png` });
  await page.click('#dexCard .tap'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !document.getElementById('dexCard').classList.contains('show')), 'card closes');
  await page.click('.dex[data-k="grunt"]'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('dexCard').textContent.includes('50마리')), 'mob card'); await page.click('#dexCard .tap');
  await page.click('.dex.ally[data-k="sword"]'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('dexCard').textContent.includes('Lv3')), 'ally card'); await page.click('#dexCard .tap');
  const off = await page.$('.dex.off'); if (off) { await off.click(); await page.waitForTimeout(100); check(await page.evaluate(() => !document.getElementById('dexCard').classList.contains('show')), 'locked stays closed'); }
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
