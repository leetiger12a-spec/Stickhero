// 무한 탑: 잠금 → 열림, 층 버티기 → 포털 2개, 다음 층, 5층 보스, 마을 귀환, 최고 기록
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  // 잠김
  await page.evaluate(() => SH.openMap()); await page.waitForTimeout(200);
  await page.click('#bTower'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('mapCard').textContent.includes('🔒')), 'tower should be locked');
  // 3칸 깬 상태로
  await page.evaluate(() => { localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 3 })); SH.G.stageN = 3; });
  await page.click('#bTower'); await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/b36_tower_card.png` });
  await page.click('#bGoTower'); await page.waitForTimeout(1200);
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.st.tower === 1), 'tower floor 1 not entered');
  await page.screenshot({ path: `${OUT}/b36_floor1.png` });
  // 버티기 성공 → 포털 2개
  await page.evaluate(() => { SH.G.p.hp = 1e6; SH.G.st.timer = 0.05; }); await page.waitForTimeout(500);
  const pr = await page.evaluate(() => ({ p: !!SH.G.st.portal, p2: !!SH.G.st.portal2, gold: SH.G.gold, best: JSON.parse(localStorage.getItem('stickhero_meta')).bestFloor }));
  console.log('clear1', JSON.stringify(pr)); check(pr.p && pr.p2 && pr.best === 1, 'portals/best missing');
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b36_portals.png` });
  // 다음 층 포털에 서기
  await page.evaluate(() => { const q = SH.G.st.portal; SH.G.p.x = q.x; SH.G.p.y = q.y; }); await page.waitForTimeout(1000);
  check(await page.evaluate(() => SH.G.st && SH.G.st.tower === 2), 'floor 2 not entered');
  // 5층 보스
  await page.evaluate(() => SH.tower(5)); await page.waitForTimeout(2200);
  check(await page.evaluate(() => !!SH.G.boss), 'no boss on floor 5');
  await page.screenshot({ path: `${OUT}/b36_boss_intro.png` });
  await page.evaluate(() => SH.skipIntro()); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/b36_boss.png` });
  await page.evaluate(() => { SH.G.boss.hp = 1; }); await page.waitForTimeout(100);
  await page.evaluate(() => { const bo = SH.G.boss; SH.G.p.x = bo.x; SH.G.p.y = bo.y + 40; }); 
  for (let i = 0; i < 40 && await page.evaluate(() => !SH.G.st.clear); i++) await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.st.clear && JSON.parse(localStorage.getItem('stickhero_meta')).bestFloor === 5), 'boss floor clear failed');
  // 레벨업 카드가 떠 있으면 고르기
  const pick = async () => { for (let i = 0; i < 6; i++) { const st = await page.evaluate(() => SH.state); if (st !== 'levelup') break; await page.evaluate(() => SH.choose(0)); await page.waitForTimeout(200); } };
  await page.waitForTimeout(300); await pick(); console.log('state', await page.evaluate(() => SH.state));
  // 마을로 포털
  await page.evaluate(() => { const q = SH.G.st.portal2; SH.G.p.x = q.x; SH.G.p.y = q.y; });
  for (let i = 0; i < 30 && await page.evaluate(() => SH.G.mode === 'stage'); i++) { await page.waitForTimeout(200); await pick(); }
  console.log('dbg', await page.evaluate(() => JSON.stringify({ mode: SH.G.mode, q: SH.G.st && SH.G.st.portal2, p: [SH.G.p.x, SH.G.p.y, SH.G.p.dead], intro: !!SH.G.intro, deadT: SH.G.deadT })));
  check(await page.evaluate(() => SH.G.mode === 'base'), 'not returned home');
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b36_home.png` });
  // 탑에서 쓰러지면 마을로
  await page.evaluate(() => SH.tower(3)); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.p.hp = 0; SH.G.p.dead = true; SH.G.deadT = 0; SH.G.respawnT = 0.1; }); await page.waitForTimeout(1500); await pick();
  console.log('after death mode', await page.evaluate(() => SH.G.mode));
  await page.evaluate(() => SH.openMap()); await page.click('#bTower'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('mapCard').textContent.includes('5층')), 'best floor not shown');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
