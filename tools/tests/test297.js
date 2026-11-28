// Build 399: 🌪 바람 부채 퀘스트(회오리로 잡기) + 업적 2개(태풍의 주인·회오리 300)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.weapons = { fan: 5 }; G.timers = {};
    G.quests = [{ id: 'whirl', goal: 3, prog: 0, done: false }]; const w0 = (ST.wk || {}).fan || 0;
    for (let i = 0; i < 4; i++) { const e = makeEnemy('grunt', G.p.x + 120 + i * 8, G.p.y - 10); e.hp = e.maxHp = 5; e.spd = 0; e.dmg = 0; G.enemies.push(e); }
    await new Promise(q => setTimeout(q, 2500));
    const a1 = ACH.find(a => a.id === 'typhoon'), a2 = ACH.find(a => a.id === 'whirl300');
    return { q: G.quests[0].prog, wk: ((ST.wk || {}).fan || 0) - w0, a1: a1 && a1.p(), a2: a2 && a2.p(), qdef: !!QUESTS.find(q => q.id === 'whirl') };
  });
  console.log(JSON.stringify(r));
  check(r.qdef && r.q >= 3, 'whirl quest counts'); check(r.wk >= 3 && r.a2 && r.a2[1] === 300 && r.a1 && r.a1[1] === 1, 'achievements');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
