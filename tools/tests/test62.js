// 매일 출석 보상 (Build 102): 시작 화면 📅 버튼(빨간 점), 받기 → 금고, 같은 날 두 번 안 됨, 다음 날 이어서 2일째, 하루 건너뛰면 1일째, 7일째 다음은 1일째
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const meta = () => page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')) || {});
  check(await page.evaluate(() => $('bDaily').classList.contains('new')), 'no red dot');
  await page.click('#bDaily'); await page.waitForTimeout(300);
  const cells = await page.evaluate(() => [...document.querySelectorAll('#dailyGrid .dd')].map(c => c.className)); console.log('cells', cells.join(' | '));
  check(cells.length === 7 && cells[0].includes('now'), 'grid wrong');
  await page.screenshot({ path: `${OUT}/b102_daily.png` });
  await page.click('#bDailyGet'); await page.waitForTimeout(200);
  let m = await meta(); console.log('after get', JSON.stringify({ bank: m.bank, daily: m.daily })); check(m.bank === 30 && m.daily.step === 1, 'day1 reward wrong');
  check(await page.evaluate(() => $('bDailyGet').style.display === 'none' && !$('bDaily').classList.contains('new')), 'can claim twice');
  await page.click('#bDailyOk'); await page.waitForTimeout(200); check(await page.evaluate(() => SH.state === 'title'), 'not back to title');
  // 어제 받은 것으로 → 오늘 2일째
  const setLast = (days, step) => page.evaluate(([days, step]) => { const d = new Date(); d.setDate(d.getDate() - days); const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.daily = { last: todayKey(d), step }; localStorage.setItem('stickhero_meta', JSON.stringify(m)); }, [days, step]);
  await setLast(1, 1); let st = await page.evaluate(() => dailyState()); check(st.can && st.next === 2, 'streak not 2: ' + JSON.stringify(st));
  await setLast(2, 3); st = await page.evaluate(() => dailyState()); check(st.can && st.next === 1, 'skip did not reset');
  await setLast(1, 7); st = await page.evaluate(() => dailyState()); check(st.next === 1, 'after day7 not 1');
  await setLast(1, 6); await page.click('#bDaily'); await page.waitForTimeout(200); await page.click('#bDailyGet'); await page.waitForTimeout(200);
  m = await meta(); console.log('day7', m.bank, m.daily.step); check(m.bank === 30 + 250 && m.daily.step === 7, 'day7 reward wrong');
  await page.screenshot({ path: `${OUT}/b102_day7.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
