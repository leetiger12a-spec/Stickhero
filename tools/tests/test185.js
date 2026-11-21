// Build 255: 업적 3개(상인 5번·구르기 100번·탑 대결 층 3번) + 퀘스트 2종(구르기 N번·상인에게 사기)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { window.__msale = false; localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 60 })); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const q = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    G.quests = [{ id: 'dash', goal: 2, prog: 0, done: false }, { id: 'merch', goal: 1, prog: 0, done: false }];
    doDash(); await new Promise(r => setTimeout(r, 300)); G.dashCd = 0; doDash(); await new Promise(r => setTimeout(r, 300));
    G.merchant = { x: G.p.x, y: G.p.y, t: 40, k: 'chest', price: 10, hold: 0 }; G.gold = 100; await new Promise(r => setTimeout(r, 1500));
    return G.quests.map(x => x.id + (x.done ? '✔' : x.prog));
  });
  console.log(q.join(' ')); check(q.join() === 'dash✔,merch✔', 'quests');
  // 탑 대결 층 깨면 횟수
  const td = await page.evaluate(async () => { const G = SH.G; window.__towerRule = null; SH.tower(20); G.p.hp = G.p.maxHp = 1e9;
    for (let k = 0; k < 2; k++) { for (let i = 0; i < 40 && !G.boss; i++) { await new Promise(r => setTimeout(r, 100)); G.intro = null; } G.intro = null; if (G.boss) killEnemy(G.boss); await new Promise(r => setTimeout(r, 200)); }
    return ST.towerDuels || 0; });
  check(td === 1, 'tower duel count ' + td);
  const a = await page.evaluate(() => { ST.merchBuys = 5; ST.dashes = 100; ST.towerDuels = 3; checkAch(); const m = JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}; return [m.merch5, m.dash100, m.tduel3].map(Boolean); });
  console.log(JSON.stringify(a)); check(a.every(Boolean), 'achievements');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
