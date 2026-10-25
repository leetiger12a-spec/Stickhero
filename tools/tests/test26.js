// 업적·칭호: 기록이 쌓이고(게임오버 후에도), 달성하면 금고 보상, 칭호 달기 → 영웅 머리 위, 시작 화면·일시정지에서 열기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html');
  // 시작 화면에서 열기
  await page.click('#bAchT'); await page.waitForTimeout(200);
  const sub0 = await page.evaluate(() => document.getElementById('achSub').textContent); console.log(sub0); check(sub0.includes('0/19'), 'ach count wrong');
  await page.click('#bAchOk'); await page.click('#bStart'); await page.waitForTimeout(300);
  // 첫 망루 · 적 잡기 · 보스 · 특수 적
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    const q = G.pads.find(q => q.kind === 'tower' && q.idx === 0); padDone(q);
    for (const t of ['grunt', 'e_slime', 'e_bat']) { const e = makeEnemy(t, 500, 500); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); }
    G.bossCount = 3; spawnBoss(400, 400); SH.skipIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); });
  await page.waitForTimeout(1500);
  const m1 = await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); return { ach: Object.keys(m.ach || {}).sort().join(), bank: m.bank || 0, st: m.st }; });
  console.log('meta', JSON.stringify(m1)); check(m1.ach === 'boss1,tower1' && m1.bank === 150 && m1.st.kills >= 3 && m1.st.bossT.includes('얼음 용') && m1.st.specT.length === 2, 'ach/stats wrong');
  // 게임오버 뒤에도 기록 유지 + 7일째(ST.day) 
  await page.evaluate(() => { SH.G.day = 6; SH.killBase(); }); await page.waitForTimeout(2800);
  await page.click('#bRetry'); await page.waitForTimeout(1500);
  check(await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); return m.ach.day7 && m.st.kills >= 3; }), 'day7 or stats lost after game over');
  // 일시정지 → 업적 → 칭호 달기
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bAchP'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b47_ach.png` });
  await page.click('.arow button >> nth=0'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !!JSON.parse(localStorage.getItem('stickhero_meta')).title), 'title not set');
  await page.click('#bAchOk'); await page.click('#bResume'); await page.waitForTimeout(400);
  check(await page.evaluate(() => heroTitle() === '새내기 영웅' || !!heroTitle()), 'hero title missing');
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 92; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b47_title.png` });
  // 새로고침해도 기록 그대로
  await page.reload(); await page.waitForTimeout(600);
  check(await page.evaluate(() => ST.kills >= 3 && ST.bosses >= 1), 'stats not reloaded');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
