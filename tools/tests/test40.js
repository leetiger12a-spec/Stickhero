// 단계 적 특기 (Build 68): 방패·순간 질주·대포알·칼 돌진·숨기·내려찍기·비행·통과+느리게·분열, 처음 나올 때 안내
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1000);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const setup = () => page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.allies = []; G.enemies = G.enemies.filter(e => e.camp); G.ebullets = []; G.rings = []; G.p.x = 0; G.p.y = 330; G.p.slowT = 0; });
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  await setup();
  // 1) 방패: 앞에서 맞으면 −30%
  const sh = await page.evaluate(() => { const R = Math.random; Math.random = () => 0.5; const e = makeEnemy('e_agrunt', 100, 330); e.face = -1; e.hp = e.maxHp = 1e6;
    hurtEnemy(e, 100, 1, 0, 0); const front = 1e6 - e.hp; e.hp = 1e6; hurtEnemy(e, 100, -1, 0, 0); const back = 1e6 - e.hp; Math.random = R; return { front, back }; });
  console.log('shield', JSON.stringify(sh)); check(sh.front < sh.back * 0.75, 'shield not reducing front hits');
  // 2~6, 8) 영웅 근처에 하나씩 → 특기가 실제로 나오는지
  const watch = async (type, dist, ms, fn) => {
    await setup();
    await page.evaluate(([t, d]) => { const G = SH.G, e = makeEnemy(t, G.p.x + d, G.p.y); e.hp = e.maxHp = 1e9; e.dmg = 1; G.enemies.push(e); window.__w = {}; }, [type, dist]);
    for (let i = 0; i < ms / 100; i++) { await page.waitForTimeout(100); await pick(); await page.evaluate(fn); }
    return page.evaluate(() => __w);
  };
  const sr = await watch('e_srunner', 200, 4000, () => { const e = SH.G.enemies.find(e => e.type === 'e_srunner'); if (e && e.sprT > 0) __w.sprint = 1; });
  check(sr.sprint, 'shadow runner never sprinted');
  const st = await watch('e_stank', 210, 4500, () => { if (SH.G.ebullets.some(b => b.cannon)) __w.cannon = 1; });
  check(st.cannon, 'steel tank never fired');
  const kn = await watch('e_knight', 150, 4500, () => { const e = SH.G.enemies.find(e => e.type === 'e_knight'); if (e && e.aimT > 0) __w.aim = 1; if (e && e.dashT > 0) __w.dash = 1; });
  check(kn.aim && kn.dash, 'knight never dashed (aim+dash)');
  const as = await watch('e_assassin', 200, 6000, () => { const e = SH.G.enemies.find(e => e.type === 'e_assassin'); if (e && e.hideT > 0) __w.hide = 1; });
  check(as.hide, 'assassin never hid');
  const og = await watch('e_ogre', 90, 4000, () => { const e = SH.G.enemies.find(e => e.type === 'e_ogre'); if (e && e.slamT > 0) __w.warn = 1; if (SH.G.rings.some(r => r.color === '#c8a27a')) __w.slam = 1; });
  check(og.warn && og.slam, 'ogre never slammed');
  await page.screenshot({ path: `${OUT}/b68_ogre.png`, clip: { x: 45, y: 250, width: 300, height: 300 } });
  const gh = await watch('e_ghost', 5, 2500, () => { if (SH.G.p.slowT > 0) __w.slow = 1; });
  check(gh.slow, 'ghost chain did not slow');
  // 7) 악마 병사·유령 기사: 울타리가 멀쩡해도 안으로
  await setup();
  const fly = await page.evaluate(async () => { const G = SH.G; G.walls.forEach(w => w.hp = Math.max(w.hp, 100));
    const es = ['e_demon', 'e_ghost', 'e_agrunt'].map((t, i) => { const e = makeEnemy(t, WALL_R + 40, -60 + i * 60); e.hp = e.maxHp = 1e9; e.dmg = 0; G.enemies.push(e); return e; });
    G.p.x = 0; G.p.y = -2000; G.p.dead = false; return es.map(e => e.type); });
  await page.waitForTimeout(3500);
  const inside = await page.evaluate(() => SH.G.enemies.filter(e => !e.camp).map(e => e.type + ':' + (e.inside ? 'in' : 'out')).join());
  console.log('walls', inside); check(/e_demon:in/.test(inside) && /e_ghost:in/.test(inside) && /e_agrunt:out/.test(inside), 'flyers did not cross walls (or walker did)');
  // 9) 바위 골렘 분열
  await setup();
  const gs = await page.evaluate(() => { const G = SH.G, e = makeEnemy('e_golem', 0, 200); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); return G.enemies.filter(x => x.type === 'e_golem' && x.small && !x.dead).length; });
  console.log('golem pieces', gs); check(gs === 3, 'golem did not split into 3');
  // 안내
  check(await page.evaluate(() => TIER_INFO.e_golem && SH.G.seen && SH.G.seen.e_golem), 'golem notice not shown');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
