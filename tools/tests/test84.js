// 업적 추천 (Build 125): 업적 화면 위에 '🎯 거의 다 됐어요' — 안 깬 업적 중 진행률 높은 3개, 진행 0인 건 안 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.evaluate(() => openAch()); await page.waitForTimeout(150);
  check(await page.evaluate(() => [...document.querySelectorAll('#achNext .an')].every(e => !/(^|\D)0\//.test(e.textContent))), 'zero-progress row shown');   /* 마을 Lv 1/3 처럼 처음부터 진행된 것은 나올 수 있음 */
  await page.evaluate(() => { $('bAchOk').click(); ST.kills = 900; ST.ghosts = 7; ST.nightsAll = 2; openAch(); }); await page.waitForTimeout(150);
  const rows = await page.evaluate(() => [...document.querySelectorAll('#achNext .an')].map(e => e.textContent)); console.log(rows.join(' | '));
  check(rows.length === 3, 'not 3 rows'); check(rows[0].includes('900/1000') && rows[1].includes('7/10'), 'not sorted by progress');
  await page.screenshot({ path: `${OUT}/b125_ach.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
