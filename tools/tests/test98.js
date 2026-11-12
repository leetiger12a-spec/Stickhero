// 새 퀘스트 4종 (Build 141): 펫이 물어 오기·동료 필살기·한 번에 콤보·겨울 친구 — 조건에 맞을 때만 나오고, 실제 행동으로 진행
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__winter = false; localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 45 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const pool = () => page.evaluate(() => QUESTS.filter(q => !q.ok || q.ok()).map(q => q.id).filter(i => ['petfetch', 'ult', 'combo', 'winter'].includes(i)).join());
  const p0 = await pool(); console.log('pool none', p0); check(p0 === 'combo', 'pool without conditions');
  await page.evaluate(() => { petSel = 1; window.__winter = true; const G = SH.G; G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; hireAlly('sword'); G.allies[0].lvl = 5; });
  const p1 = await pool(); console.log('pool all', p1); check(p1 === 'petfetch,ult,combo,winter', 'pool with conditions');
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.need = 1e9; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.p.meleeCd = 99; G.p.x = 0; G.p.y = 120; G.p.magnet = 1;
    G.quests = [{ id: 'petfetch', goal: 3, prog: 0, done: false }, { id: 'combo', goal: 12, prog: 0, done: false }, { id: 'winter', goal: 2, prog: 0, done: false }]; });
  await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.coins = []; for (let i = 0; i < 4; i++) dropCoin(G.p.x + 150, G.p.y + i * 8); G.coins.forEach(c => { c.z = 0; c.vz = 0; }); G.pet.cd = 0; await new Promise(q => setTimeout(q, 200));
    const kill = t => { const e = makeEnemy(t, 600, 600); G.enemies.push(e); killEnemy(e); }; for (let i = 0; i < 5; i++) kill('grunt'); G.comboT = 0; for (let i = 0; i < 13; i++) kill('grunt'); kill('e_snowman'); kill('e_ginger'); G.gems = []; G.items = [];
    return G.quests.map(q => q.prog + '/' + q.goal + (q.done ? '✔' : '')); });
  console.log(r.join(' | ')); check(r.every(x => x.endsWith('✔')), 'quests not done');
  // 필살기 퀘스트
  const u = await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'ult', goal: 2, prog: 0, done: false }]; const a = G.allies[0], e = makeEnemy('tank', a.x + 40, a.y); e.hp = e.maxHp = 1e6; G.enemies = [e]; allyUlt(a, 1); allyUlt(a, 1); return G.quests[0].done; });
  check(u, 'ult quest');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
