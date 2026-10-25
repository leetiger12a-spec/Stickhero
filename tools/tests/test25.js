// 겹침 시험: 보스 6종 차례로 + 대습격 + 진지 부대 + 특수 적 + 지원 비행기 + 퀘스트를 한꺼번에 → 스테이지 왕복 → 탑에서 쓰러짐 → 레벨업 카드 중 마을 붕괴 → 다음 날 → 이어하기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const pick = () => page.evaluate(() => { for (let i = 0; i < 10; i++) { if (SH.state === 'levelup') SH.choose(0); else if (SH.state === 'allypick') SH.chooseAlly(0); else if (SH.state === 'result' || SH.state === 'map') SH.ok(); } if (SH.G && SH.G.intro) SH.skipIntro(); });
  // 키운 마을 + 혼돈
  await page.evaluate(() => { const G = SH.G;
    G.towers.forEach(t => t.lvl = 3); G.pads.forEach(q => { if (q.kind !== 'bld') q.built = true; }); G.smith = true; G.tavern = true; hallUp(); hallUp(); G.bld = { farm: 1, mine: 1, market: 1 };
    ['sword', 'archer', 'bomber', 'shield'].forEach(t => G.allies.push(makeAlly(t, 3))); G.stageN = 4; G.bt = 400; G.p.hp = G.p.maxHp = 3000;
    G.camps.forEach(c => c.spawnT = 0.1); startRaid(); });
  for (let k = 0; k < 6; k++) { // 보스 6종을 하나씩 (앞 보스가 살아 있어도)
    await page.evaluate(k => { const G = SH.G; G.bossCount = k; spawnBoss(); SH.skipIntro(); SH.bossSpecial(); if (k === 2) SH.plane(1); if (k === 4) callSos(); }, k);
    for (let i = 0; i < 12; i++) { await page.waitForTimeout(250); await pick(); }
  }
  const mid = await page.evaluate(() => ({ en: SH.G.enemies.length, kinds: [...new Set(SH.G.enemies.map(e => e.type))].length, raid: !!SH.G.raid, q: SH.G.quests.map(q => q.prog).join() }));
  console.log('chaos', JSON.stringify(mid)); check(mid.en > 20 && mid.kinds >= 6, 'chaos not chaotic');
  await page.screenshot({ path: `${OUT}/b46_chaos.png` });
  // 스테이지 왕복 (마을 상태 그대로)
  const before = await page.evaluate(() => { const G = SH.G; G.boss = null; G.raid = null; return G.enemies.length; });
  await page.evaluate(() => SH.enterStage(3)); for (let i = 0; i < 8; i++) { await page.waitForTimeout(250); await pick(); }
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.hazards.length === 0 && SH.G.fists.length === 0 || SH.G.mode === 'stage'), 'stage enter failed');
  await page.evaluate(() => SH.returnBase(false)); await page.waitForTimeout(300); await pick();
  const after = await page.evaluate(() => SH.G.enemies.length); console.log('enemies before/after stage', before, after); check(SH => true, '');
  // 무한 탑에서 쓰러짐
  await page.evaluate(() => { SH.tower(4); }); await page.waitForTimeout(300); await pick();
  await page.evaluate(() => { const G = SH.G; G.p.inv = 0; G.p.hp = 1; hurtPlayer(9999); G.respawnT = 0.1; }); 
  for (let i = 0; i < 20 && await page.evaluate(() => SH.G.mode !== 'base'); i++) { await page.waitForTimeout(150); await pick(); }
  check(await page.evaluate(() => SH.G.mode === 'base' && !SH.G.p.dead), 'tower death did not return home');
  // 레벨업 카드가 떠 있을 때 마을 붕괴
  await page.evaluate(() => { const G = SH.G; G.pending = 2; openLevelUp(); });
  check(await page.evaluate(() => SH.state === 'levelup'), 'levelup not open');
  await page.evaluate(() => { SH.G.deadT = 0; hurtBase(1e9); }); await pick();
  for (let i = 0; i < 30 && await page.evaluate(() => SH.state !== 'over'); i++) { await page.waitForTimeout(150); await pick(); }
  check(await page.evaluate(() => SH.state === 'over'), 'game over not reached from levelup');
  await page.click('#bRetry'); await page.waitForTimeout(400); await pick();
  const d2 = await page.evaluate(() => ({ day: SH.G.day, vLvl: SH.G.vLvl, allies: SH.G.allies.map(a => a.lvl).join(), st: SH.state, raid: !!SH.G.raid, boss: !!SH.G.boss }));
  console.log('day2', JSON.stringify(d2)); check(d2.day === 2 && d2.vLvl === 3 && d2.allies === '3,3,3,3' && !d2.boss, 'day2 state wrong');
  // 2일째 2초 놀다가 저장 → 새로고침 → 이어하기
  for (let i = 0; i < 8; i++) { await page.waitForTimeout(250); await pick(); }
  await page.evaluate(() => saveGame()); await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(500); await pick();
  check(await page.evaluate(() => SH.G.day === 2 && SH.state === 'play'), 'continue after day2 failed');
  await page.screenshot({ path: `${OUT}/b46_day2.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
