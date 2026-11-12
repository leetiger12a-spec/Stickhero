// 행운 룰렛 (Build 148): 출석 화면에 룰렛, 하루 1번, 칸마다 보상 (금고·다음 판 시작 금화·별), 빨간 점은 룰렛이 남아도 켜짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const meta = () => page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')) || {});
  await page.click('#bDaily'); await page.waitForTimeout(200); await page.click('#bDailyGet'); await page.waitForTimeout(100);
  check(await page.evaluate(() => $('bDaily').classList.contains('new') && !$('bSpin').disabled), 'spin not available after daily');
  // 금고 칸(1번=🪙60) 강제
  const b0 = (await meta()).bank || 0; await page.evaluate(() => doSpin(1)); await page.waitForTimeout(2900);
  let m = await meta(); console.log('bank +', m.bank - b0, await page.evaluate(() => $('spinRes').textContent)); check(m.bank - b0 === 60 && m.spinDay, 'bank prize wrong');
  check(await page.evaluate(() => $('bSpin').disabled && !$('bDaily').classList.contains('new')), 'spin twice / dot still on');
  check(await page.evaluate(() => doSpin(0) === null), 'second spin allowed');
  await page.screenshot({ path: `${OUT}/b148_spin.png` });
  // 다음 판 시작 보너스 (내일 돌린 셈)
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.spinDay = 'x'; localStorage.setItem('stickhero_meta', JSON.stringify(m)); doSpin(4); });
  m = await meta(); check(m.startBonus === 100, 'start bonus not saved');
  await page.evaluate(() => { $('bDailyOk').click(); }); await page.click('#bStart'); await page.waitForTimeout(800);
  const g = await page.evaluate(() => [SH.G.gold, (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).startBonus]); console.log('start gold', g.join()); check(g[0] >= 100 && !g[1], 'start bonus not applied');
  // 무게: 많이 돌리면 30이 가장 많고 500이 가장 적음
  const dist = await page.evaluate(() => { const c = Array(SPIN.length).fill(0); for (let k = 0; k < 4000; k++) { const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.spinDay = 'x'; localStorage.setItem('stickhero_meta', JSON.stringify(m)); c[doSpin()]++; } return c; });
  console.log('dist', dist.join()); check(dist[0] > dist[7] * 5, 'weights wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
