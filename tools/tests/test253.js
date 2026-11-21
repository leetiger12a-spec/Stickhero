// Build 337: 퀘스트 3종 — ⛲ 분수 · 💰 현상금 · 👻 유령 정예
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; window.__bountyT = 999; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.gold = 2000; G.quests = [{ id: 'fountain', goal: 1, prog: 0, done: false }, { id: 'bounty', goal: 1, prog: 0, done: false }, { id: 'ghostel', goal: 1, prog: 0, done: false }];
    const g = makeEnemy('grunt', G.p.x + 200, G.p.y); makeElite(g, 'ghost'); G.enemies.push(g); g.phaseT = 0; g.eT = 9; hurtEnemy(g, 1e12, 0, 1, 0);
    G.t = 100; G.bt = 99999; G.bountyT = 0.01; await new Promise(q => setTimeout(q, 300)); const e = G.enemies.find(x => x.bounty > 0); e.phaseT = 0; e.eT = 9; e.shieldT = 0; hurtEnemy(e, 1e12, 0, 1, 0); SH.openMap(); });
  await page.click('#bFnt'); await page.click('#bGoFnt'); await page.waitForTimeout(200);
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done)); console.log(q.join(' ')); check(q.every(x => x.endsWith(':true')), 'quests done');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
