// Build 393: 🎄 겨울 퀘스트 2종(선물 줍기·선물 쿠키 잡기) + 업적 2개(산타 도우미·선물 부자) — 겨울에만 나오고 제대로 셈
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__winter = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const okW = ['gift', 'giftc'].every(k => QUESTS.find(q => q.id === k).ok()); window.__winter = false; const okOff = ['gift', 'giftc'].some(k => QUESTS.find(q => q.id === k).ok()); window.__winter = true;
    G.quests = [{ id: 'gift', goal: 3, prog: 0, done: false }, { id: 'giftc', goal: 6, prog: 0, done: false }];
    const g0 = ST.giftsT || 0; for (let i = 0; i < 3; i++) useItem({ kind: 'gift' });
    G.giftWT = 0; await new Promise(q => setTimeout(q, 300)); const gc = G.enemies.filter(e => e.giftC); gc.forEach(e => killEnemy(e)); await new Promise(q => setTimeout(q, 60));
    const kids = G.enemies.filter(e => e.small && !e.dead); kids.forEach(e => killEnemy(e));
    const a1 = ACH.find(a => a.id === 'gift30'), a2 = ACH.find(a => a.id === 'xmas1');
    return { okW, okOff, q: G.quests.map(q => [q.id, q.prog, q.done]), gifts: (ST.giftsT || 0) - g0, gc: gc.length, a1: a1 && a1.p(), a2: a2 && a2.p() };
  });
  console.log(JSON.stringify(r));
  check(r.okW && !r.okOff, 'winter quests only in winter'); check(r.q[0][2] && r.q[1][2] && r.q[1][1] === 6, 'gift quests complete (small cookies not counted)');
  check(r.gifts === 3 && r.a1 && r.a1[0] >= 3 && r.a1[1] === 30, 'gift30 achievement counts'); check(r.a2 && r.a2[1] === 1, 'xmas achievement exists');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
