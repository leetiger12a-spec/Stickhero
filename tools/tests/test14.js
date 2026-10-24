// 보스 특수 공격: 슬라임 점프 / 거인 로켓 펀치 / 대마왕 불길 장판 / 대왕 셋 다
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const setup = n => page.evaluate(n => { const G = SH.G; G.enemies = []; G.boss = null; G.bossCount = n; G.weapons = {}; G.allies = []; G.p.x = 0; G.p.y = 330; G.p.hp = G.p.maxHp = 1e6; G.trees = [];
    SH.spawnBoss(); endIntro(); const e = G.boss; e.x = 0; e.y = 140; e.hp = e.maxHp = 1e9; G.banner = null; SH.bossSpecial(); }, n);
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  // 슬라임 점프
  await setup(0); const hp0 = await page.evaluate(() => SH.G.p.hp);
  await page.waitForTimeout(900); await page.screenshot({ path: `${OUT}/b34_jump.png` });
  check(await page.evaluate(() => SH.G.boss.mode === 'jump' && SH.G.boss.z > 50), 'slime not jumping');
  await page.waitForTimeout(900); await pick();
  check(await page.evaluate(h => SH.G.p.hp < h, hp0), 'slime slam no damage');
  // 거인 로켓 펀치
  const h1 = await page.evaluate(() => SH.G.p.hp); await setup(1); await page.waitForTimeout(950);
  check(await page.evaluate(() => SH.G.fists.length > 0), 'no fist');
  await page.screenshot({ path: `${OUT}/b34_punch.png` });
  await page.waitForTimeout(1500); await pick();
  check(await page.evaluate(h => SH.G.p.hp < h, h1), 'fist no damage');
  // 대마왕 불길
  const h2 = await page.evaluate(() => SH.G.p.hp); await setup(2); await page.waitForTimeout(1300);
  check(await page.evaluate(() => SH.G.hazards.filter(h => h.warn <= 0).length >= 3), 'no fire');
  await page.screenshot({ path: `${OUT}/b34_fire.png` });
  await page.waitForTimeout(1500); await pick();
  check(await page.evaluate(h => SH.G.p.hp < h, h2), 'fire no damage');
  // 보스 처치하면 장판·주먹 정리
  await page.evaluate(() => { const e = SH.G.boss; e.hp = 1; hurtEnemy(e, 999, 0, 0, 0); });
  await page.waitForTimeout(300); await pick();
  check(await page.evaluate(() => SH.G.hazards.length === 0 && SH.G.fists.length === 0), 'hazards not cleared');
  // 최종 보스: 3종 모두 사용
  const kinds = await page.evaluate(() => { const G = SH.G; G.mode = 'stage'; G.st = { n: 9, def: STAGES[9], th: THEMES[4], cages: [], deco: [], rocks: [], groups: [], L: 2600 }; G.stash = { enemies: [], coins: [], gems: [], hearts: [] };
    G.enemies = []; G.boss = null; spawnBoss(0, 0); endIntro(); const e = G.boss, seen = new Set();
    for (let i = 0; i < 40; i++) { startSpecial(e, 1, 0, 1); seen.add(bossKind(e)); e.mode = 'walk'; } return [...seen].sort().join(','); });
  console.log('final kinds', kinds); check(kinds === 'fire,jump,punch', 'final boss kinds');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
