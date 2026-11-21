// Build 284: 새 퀘스트 5종 — 투기장 웨이브·투기장 포털·새 정예·동굴·보스 연습
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'arenaw', goal: 2, prog: 0, done: false }, { id: 'arenaOut', goal: 1, prog: 0, done: false }, { id: 'newelite', goal: 2, prog: 0, done: false }];
    G.enemies = []; for (const k of ['fire', 'bolt']) { const e = makeEnemy('grunt', G.p.x + 300, G.p.y); makeElite(e, k); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); } G.hazards = []; G.stageN = 3; G.gold = 500; SH.openMap(); });
  await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(400);
  for (let i = 0; i < 5; i++) { await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.timer = 0.05; }); await page.waitForTimeout(350); }
  await page.evaluate(() => { const G = SH.G, P = G.st.portal; G.p.x = P.x; G.p.y = P.y; }); await page.waitForTimeout(1200);
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done));
  console.log(q.join(' ')); check(q.every(x => x.endsWith('true')), 'all three quests done');
  check(await page.evaluate(() => ['arenaw', 'arenaOut', 'newelite', 'cave', 'practice'].every(i => QUESTS.find(Q => Q.id === i))), 'quest defs');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
