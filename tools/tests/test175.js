// Build 245: 새 하루 퀘스트 4종 — 정예·황금·보물 상자·교대가 진행도에 쌓임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9;
    G.quests = ['elite', 'golden', 'chest', 'swap'].map(id => ({ id, goal: id === 'chest' ? 2 : 1, prog: 0, done: false }));
    const e1 = makeEnemy('tank', G.p.x + 40, G.p.y); makeElite(e1); G.enemies.push(e1); killEnemy(e1);
    const e2 = makeEnemy('grunt', G.p.x + 40, G.p.y); makeGolden(e2); G.enemies.push(e2); killEnemy(e2);
    bagPut({ small: true }, true); bagPut({ small: true }, true);
    for (const t of ['sword', 'archer', 'bomber']) hireAlly(t); swapAlly(false, 0);
    return G.quests.map(q => q.id + ':' + q.prog + (q.done ? '✔' : ''));
  });
  console.log(r.join(' ')); check(r.every(x => x.endsWith('✔')), 'all quests done ' + r);
  const txt = await page.evaluate(() => ['elite', 'golden', 'chest', 'swap'].map(id => QUESTS.find(q => q.id === id).txt(3)).join(' | '));
  console.log(txt); check(!txt.includes('undefined'), 'quest text');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
