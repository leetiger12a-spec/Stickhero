// 새 업적 6개 (Build 140): 펫 Lv5·동굴·대박 상자 3·필살기 50·겨울 친구 50·화난 보스 10 — 실제 행동이 기록을 올리는지 + 달성
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const ids = ['pet5', 'cave1', 'jack3', 'ult50', 'winter50', 'rage10'];
  const got = () => page.evaluate(ids => { checkAch(); const a = (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).ach || {}; return ids.map(i => !!a[i]); }, ids);
  check((await got()).every(x => !x), 'got too early'); check(await page.evaluate(() => ACH.length === 43), 'ACH not 43');
  // 실제 행동 1번씩
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.need = 1e9; G.p.hp = G.p.maxHp = 1e9;
    G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; hireAlly('sword'); const a = G.allies[0]; const e = makeEnemy('tank', a.x + 40, a.y); e.hp = e.maxHp = 1e6; G.enemies = [e]; allyUlt(a, 1);
    const s = makeEnemy('e_snowman', 600, 600); G.enemies.push(s); killEnemy(s);
    SH.spawnBoss(); G.intro = null; G.boss.rage = true; killEnemy(G.boss); G.chests = [];
    chestRewards({ jack: true }); G.items = []; G.gems = []; G.coins = [];
    return [ST.ults, ST.kc.e_snowman, ST.rageKills, ST.jacks]; });
  console.log('counters', r.join()); check(r.every(v => v === 1), 'counters not increased');
  await page.evaluate(() => { ST.ults = 50; ST.kc.e_snowman = 50; ST.rageKills = 10; ST.jacks = 3; ST.caves = 1; ST.petXp = { puppy: 1500 }; });
  const g = await got(); console.log('got', g.join()); check(g.every(Boolean), 'not all achieved');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
