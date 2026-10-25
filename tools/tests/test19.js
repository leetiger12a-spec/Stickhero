// 월드 확장: 야생 지대(월드 반지름 1100), 바위 캐기, 적 진지(부대 출발·파괴 보상·재건), 미니맵, 저장/불러오기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const w = await page.evaluate(() => ({ rocks: SH.G.rocks.length, camps: SH.G.camps.length, campE: SH.G.enemies.filter(e => e.camp).length, r: SH.G.camps.map(c => Math.round(Math.hypot(c.x, c.y))) }));
  console.log('world', JSON.stringify(w)); check(w.rocks === 7 && w.camps === 3 && w.campE === 3 && w.r.every(r => r > 850 && r < 1000), 'world setup wrong');
  await page.screenshot({ path: `${OUT}/b40_start.png` });
  // 바위 캐기
  await page.evaluate(() => { const G = SH.G, o = G.rocks[0]; G.nextBoss = 999; G.nextWave = 999; G.p.hp = G.p.maxHp = 1e6; G.p.x = o.x + 34; G.p.y = o.y; G.stone = 0; });
  await page.waitForTimeout(1600);
  const st = await page.evaluate(() => ({ stone: SH.G.stone, s: SH.G.rocks[0].s }));
  console.log('mine', JSON.stringify(st)); check(st.stone >= 2 && st.s <= 4, 'rock mining failed');
  await page.screenshot({ path: `${OUT}/b40_rock.png` });
  // 영웅이 월드 끝까지 갈 수 있음
  await page.evaluate(() => { SH.G.p.x = 2000; SH.G.p.y = 0; keys.d = true; }); await page.waitForTimeout(200);
  const pr = await page.evaluate(() => { keys.d = false; return Math.hypot(SH.G.p.x, SH.G.p.y); }); console.log('edge', pr); check(pr > 1000 && pr < 1100, 'world edge clamp wrong');
  // 진지 앞으로
  const n0 = await page.evaluate(() => { const c = SH.G.camps[0]; SH.G.p.x = c.x * 0.86; SH.G.p.y = c.y * 0.86; SH.G.spawnAcc = -1e9; SH.G.bt = 200; c.spawnT = 0.05; return SH.G.enemies.filter(e => !e.camp).length; });
  await page.waitForTimeout(500);
  const guards = await page.evaluate(n0 => SH.G.enemies.filter(e => !e.camp).length - n0, n0);
  console.log('guards', guards); check(guards >= 2, 'camp spawned no squad');
  await page.screenshot({ path: `${OUT}/b40_camp.png` });
  // 진지 파괴
  const before = await page.evaluate(() => ({ stone: SH.G.stone, down: campsDown() }));
  await page.evaluate(() => { const e = SH.G.camps[0].e; e.hp = 1; hurtEnemy(e, 50, 0, 1, 0); });
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({ stone: SH.G.stone, down: campsDown(), lvl: SH.G.camps[0].lvl, rb: SH.G.camps[0].rebuild, inList: SH.G.enemies.some(e => e.camp === SH.G.camps[0]) }));
  console.log('destroy', JSON.stringify(before), JSON.stringify(after));
  check(after.down === 1 && after.lvl === 1 && after.stone >= before.stone + 12 && !after.inList && after.rb > 200, 'camp destroy wrong');
  await page.screenshot({ path: `${OUT}/b40_ruin.png` });
  // 재건 (더 튼튼)
  const hp0 = await page.evaluate(() => SH.G.camps[1].e.maxHp);
  await page.evaluate(() => { SH.G.spawnAcc = 0; SH.G.camps[0].rebuild = 0.05; }); await page.waitForTimeout(300);
  const reb = await page.evaluate(() => ({ down: campsDown(), hp: SH.G.camps[0].e && SH.G.camps[0].e.maxHp }));
  console.log('rebuild', JSON.stringify(reb), hp0); check(reb.down === 0 && reb.hp > hp0, 'camp rebuild wrong');
  // 저장 → 이어하기
  await page.evaluate(() => { const G = SH.G; G.enemies = G.enemies.filter(e => e.camp); G.p.x = 0; G.p.y = 92; G.camps[2].e.hp = G.camps[2].e.maxHp / 2; saveGame(); });
  const s0 = await page.evaluate(() => JSON.stringify({ c: SH.G.camps.map(c => [Math.round(c.x), c.lvl, c.e ? Math.round(c.e.hp / c.e.maxHp * 100) : 0]), r: SH.G.rocks.map(o => o.s) }));
  await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(300);
  const s1 = await page.evaluate(() => JSON.stringify({ c: SH.G.camps.map(c => [Math.round(c.x), c.lvl, c.e ? Math.round(c.e.hp / c.e.maxHp * 100) : 0]), r: SH.G.rocks.map(o => o.s) }));
  console.log(s0, s1); check(s0 === s1 && await page.evaluate(() => SH.G.enemies.filter(e => e.camp).length === 3), 'save/load mismatch');
  await page.screenshot({ path: `${OUT}/b40_home.png` });
  // 스테이지 갔다 와도 진지 유지
  await page.evaluate(() => { SH.G.stageN = 1; SH.enterStage(0); }); await page.waitForTimeout(300);
  await page.evaluate(() => SH.returnBase(false)); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.enemies.filter(e => e.camp).length === 3), 'camps lost after stage');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
