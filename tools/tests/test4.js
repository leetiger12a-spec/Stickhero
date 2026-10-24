const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2];
const URL = 'file:///home/user/Stickhero/index.html';
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const check = (c, m) => { if (!c) errors.push(m); };
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  await page.goto(URL);
  await page.tap('#bStart');
  await page.waitForTimeout(500);
  // 첫 망루 → 출격 문 열림
  await page.evaluate(() => { SH.G.p.logs = 12; const pd = SH.G.pads[0]; SH.G.p.x = pd.x; SH.G.p.y = pd.y; });
  await page.waitForTimeout(1200);
  check(await page.evaluate(() => SH.G.gateOpen), 'gate not open');
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 60; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_01_gate.png` });
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 128; });
  await page.waitForTimeout(1500);
  check(await page.evaluate(() => SH.G.mode) === 'stage', 'did not enter stage');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_02_stage_start.png` });
  // 첫 무리 근처로
  await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 9999; SH.give('sword', 3); SH.G.p.y = SH.G.st.groups[0].y + 280; });
  await page.waitForTimeout(3000); await pick();
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_03_stage_fight.png` });
  // 끝으로 → 보스
  await page.evaluate(() => { SH.G.p.y = -SH.G.st.L + 250; });
  await page.waitForTimeout(2500); await pick();
  check(await page.evaluate(() => !!SH.G.boss), 'stage boss not spawned');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_04_stage_boss.png` });
  await page.evaluate(() => { SH.G.boss.hp = 1; });
  await page.waitForTimeout(2500); await pick();
  check(await page.evaluate(() => !!SH.G.st.portal), 'portal missing');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_05_portal.png` });
  for (let i = 0; i < 20 && await page.evaluate(() => SH.G.mode) === 'stage'; i++) { await pick(); await page.evaluate(() => { const pt = SH.G.st && SH.G.st.portal; if (pt) { SH.G.p.x = pt.x; SH.G.p.y = pt.y; } }); await page.waitForTimeout(300); }
  const r = await page.evaluate(() => ({ mode: SH.G.mode, stageN: SH.G.stageN, gold: SH.G.gold }));
  console.log('after return', JSON.stringify(r));
  check(r.mode === 'base' && r.stageN === 1, 'return failed');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_06_back.png` });
  // 2번째 스테이지(폐허)에서 쓰러짐 → 후퇴
  await page.evaluate(() => { SH.enterStage(); SH.G.p.y = -900; });
  await page.waitForTimeout(800); await pick();
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_07_ruins.png` });
  await pick(); await page.evaluate(() => { SH.kill(); SH.G.respawnT = 0.3; });
  for (let i = 0; i < 5; i++) { await page.waitForTimeout(250); await pick(); }
  const r2 = await page.evaluate(() => ({ mode: SH.G.mode, dead: SH.G.p.dead, stageN: SH.G.stageN }));
  console.log('after fail', JSON.stringify(r2));
  check(r2.mode === 'base' && !r2.dead && r2.stageN === 1, 'fail return wrong');
  // 3번째 테마(던전) 화면
  await page.evaluate(() => { SH.G.stageN = 2; SH.enterStage(); SH.G.p.y = -700; });
  await page.waitForTimeout(1200); await pick();
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b4_08_dungeon.png` });
  // 가속 시뮬레이션: 스테이지 안에서 60초
  const sim = await page.evaluate(() => { for (let i = 0; i < 1800; i++) { if (SH.state === 'levelup') SH.choose(0); SH.G.p.y -= 2; update(1 / 30); } return { mode: SH.G.mode, e: SH.G.enemies.length, y: Math.round(SH.G.p.y) }; });
  console.log('sim', JSON.stringify(sim));
  await browser.close();
  console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e));
  process.exit(errors.length ? 1 : 0);
})();
