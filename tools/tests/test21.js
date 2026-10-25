// 새 적 6종: 궁수(화살), 자폭병(울타리 펑), 박쥐(울타리 넘기), 분열 슬라임, 주술사(회복), 돌격병(돌진) + 등장 시간
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const setup = () => page.evaluate(() => { const G = SH.G; G.enemies = G.enemies.filter(e => e.camp); G.ebullets = []; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.camps.forEach(c => c.spawnT = 999); G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.towers.forEach(t => t.lvl = 0); });
  // 등장 시간
  const pool = await page.evaluate(() => { const r = {}; SH.G.bt = 130; r.t100 = SPECIALS.filter(s => SH.G.bt >= s[1]).map(s => s[0]); SH.G.bt = 0; r.st0 = pickSpecial(0); r.st5 = SPECIALS.filter(s => 5 >= s[2]).length; return r; });
  console.log('pool', JSON.stringify(pool)); check(pool.t100.join() === 'e_slime' && pool.st0 === null && pool.st5 === 6, 'unlock schedule wrong');
  await setup();
  // 전부 소환해서 사진
  await page.evaluate(() => { const G = SH.G; ['e_archer', 'e_bomber', 'e_bat', 'e_slime', 'e_shaman', 'e_charger'].forEach((t, i) => G.enemies.push(makeEnemy(t, -150 + i * 60, 300))); G.p.x = 0; G.p.y = 420; G.cam.y = 360; G.seen = {}; });
  await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/b42_all.png` });
  // 궁수: 멈춰서 화살
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = 500; G.enemies.push(makeEnemy('e_archer', 0, 680)); });
  await page.waitForTimeout(2600);
  const ar = await page.evaluate(() => { const e = SH.G.enemies.find(e => e.type === 'e_archer'); return { d: Math.round(Math.hypot(e.x - SH.G.p.x, e.y - SH.G.p.y)), hp: SH.G.p.hp }; });
  console.log('archer', JSON.stringify(ar)); check(ar.d > 150 && ar.hp < 1e6, 'archer did not keep distance and shoot');
  // 궁수 화살 → 울타리
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = -600; G.p.y = -600; G.walls.forEach(w => w.hp = w.maxHp); G.enemies.push(makeEnemy('e_archer', 330, 0)); });
  await page.waitForTimeout(3500);
  check(await page.evaluate(() => SH.G.walls.some(w => w.hp < w.maxHp)), 'archer arrows did not hit wall');
  // 자폭병: 울타리 펑
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = -600; G.p.y = -600; G.walls.forEach(w => w.hp = w.maxHp); G.enemies.push(makeEnemy('e_bomber', 0, 200)); });
  await page.waitForTimeout(1500);
  const bo = await page.evaluate(() => ({ alive: SH.G.enemies.some(e => e.type === 'e_bomber'), wall: SH.G.walls[segOf(0, 200)].hp, max: SH.G.walls[0].maxHp }));
  console.log('bomber', JSON.stringify(bo)); check(!bo.alive && bo.wall < bo.max - 30, 'bomber did not explode at wall');
  // 박쥐: 울타리 넘어 회관
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = -600; G.p.y = -600; G.walls.forEach(w => w.hp = w.maxHp); G.base.hp = G.base.maxHp; G.enemies.push(makeEnemy('e_bat', 0, 220)); });
  await page.waitForTimeout(3500);
  const bat = await page.evaluate(() => { const e = SH.G.enemies.find(e => e.type === 'e_bat'); return { r: e ? Math.round(Math.hypot(e.x, e.y)) : -1, base: SH.G.base.hp, max: SH.G.base.maxHp }; });
  console.log('bat', JSON.stringify(bat)); check(bat.r >= 0 && bat.r < 80 && bat.base < bat.max, 'bat did not fly over wall');
  // 분열 슬라임
  await setup();
  await page.evaluate(() => { const G = SH.G; const e = makeEnemy('e_slime', 300, 300); G.enemies.push(e); hurtEnemy(e, 1e6, 0, 1, 0); });
  const sl = await page.evaluate(() => SH.G.enemies.filter(e => e.type === 'e_slime' && e.small).length); console.log('slimes', sl); check(sl === 2, 'slime did not split');
  check(await page.evaluate(() => { const e = SH.G.enemies.find(e => e.small); hurtEnemy(e, 1e6, 0, 1, 0); return SH.G.enemies.filter(e => e.type === 'e_slime' && !e.dead).length === 1; }), 'small slime split again');
  // 주술사 회복
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = -600; G.p.y = -600; const s = makeEnemy('e_shaman', 400, 400), g = makeEnemy('tank', 430, 400); g.hp = 10; G.enemies.push(s, g); s.healT = 0.05; });
  await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.G.enemies.find(e => e.type === 'tank').hp > 10), 'shaman did not heal');
  // 돌격병
  await setup();
  await page.evaluate(() => { const G = SH.G; G.p.x = 300; G.p.y = 300; G.enemies.push(makeEnemy('e_charger', 300, 450)); });
  await page.waitForTimeout(400);
  check(await page.evaluate(() => { const e = SH.G.enemies.find(e => e.type === 'e_charger'); return e && e.dashCd > 0; }), 'charger did not dash');
  // 스테이지에도 나옴
  await page.evaluate(() => { SH.G.stageN = 9; SH.enterStage(6); }); await page.waitForTimeout(300);
  await page.evaluate(() => { for (const g of SH.G.st.groups) { g.done = false; g.y = SH.G.p.y - 100; } }); await page.waitForTimeout(300);
  const st = await page.evaluate(() => SH.G.enemies.filter(e => e.type.startsWith('e_')).length); console.log('stage specials', st); check(st > 0, 'no specials in stage');
  await page.screenshot({ path: `${OUT}/b42_stage.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
