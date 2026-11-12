// 새 업적 6개 (Build 101): 유령 상자 1·10개, 밤 10번, 첫 모자·모자 8개, 독·별 진화 — 기록(ST.ghosts·nightsAll)이 저장되고 달성되면 금고에 들어감
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const ids = ['ghost1', 'ghost10', 'night10', 'hat1', 'hat8', 'newevo'];
  const got = () => page.evaluate(ids => { checkAch(); const a = (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).ach || {}; return ids.map(i => !!a[i]); }, ids);
  check(await page.evaluate(ids => ids.every(i => ACH.some(A => A.id === i)) && ACH.length === 44, ids), 'achievements missing');
  let g = await got(); console.log('start', g.join()); check(g.every(x => !x), 'got too early');
  // 유령 상자 1개 잡기 (실제로 밤에 잡음) + 밤 1번 버티기
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.bt = NIGHT_START + 8.5; }); await page.waitForTimeout(300);
  await page.evaluate(() => { const G = SH.G; G.p.x = G.ghost.x; G.p.y = G.ghost.y; }); await page.waitForTimeout(150);
  await page.evaluate(() => { SH.G.chests = []; SH.G.bt = NIGHT_START + NIGHT_LEN + 0.3; }); await page.waitForTimeout(300);
  const st = await page.evaluate(() => [ST.ghosts, ST.nightsAll]); console.log('ST', st.join()); check(st[0] === 1 && st[1] === 1, 'stats not counted');
  g = await got(); console.log('after 1', g.join()); check(g[0] && !g[1] && !g[2], 'ghost1 wrong');
  // 저장되는지
  const saved = await page.evaluate(() => { checkAch(); return (JSON.parse(localStorage.getItem('stickhero_meta')).st || {}).ghosts; }); check(saved === 1, 'ghosts not saved');
  // 나머지: 숫자 채우기
  const bank0 = await page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0);
  await page.evaluate(() => { ST.ghosts = 10; ST.nightsAll = 10; ST.evoT.push('poison', 'star'); const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.bestStars = 40; localStorage.setItem('stickhero_meta', JSON.stringify(m)); });
  g = await got(); console.log('all', g.join()); check(g.every(Boolean), 'not all achieved');
  const bank1 = await page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')).bank); console.log('bank +', bank1 - bank0); check(bank1 - bank0 >= 400 + 250 + 80 + 500 + 300, 'bank reward wrong');   /* 첫 진화 등 다른 업적도 같이 달성될 수 있음 */
  await page.evaluate(() => openAch()); await page.waitForTimeout(300); await page.evaluate(() => { const l = document.getElementById('achList'); l.scrollTop = l.scrollHeight; }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b101_ach.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
