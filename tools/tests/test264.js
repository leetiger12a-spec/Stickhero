// Build 348: 퀘스트 3종 — 🗺 보물 지도 파기 · 💚 치유 정예 · 🌑 일식 웨이브 깨기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; window.__bountyT = 999; window.__tmapT = 999; window.__arenaRule = 'eclipse'; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.quests = [{ id: 'tmap', goal: 1, prog: 0, done: false }, { id: 'healel', goal: 1, prog: 0, done: false }, { id: 'eclipse', goal: 1, prog: 0, done: false }];
    const h = makeEnemy('grunt', G.p.x + 200, G.p.y); makeElite(h, 'heal'); G.enemies.push(h); hurtEnemy(h, 1e12, 0, 1, 0);
    G.tmap = { x: G.p.x, y: G.p.y, dig: 2.9, t: 0 }; await new Promise(q => setTimeout(q, 300)); G.stageN = 3; SH.openMap(); });
  await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = 3; G.st.arenaRule = 'eclipse'; G.st.timer = 0.05; await new Promise(q => setTimeout(q, 500)); });
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done)); console.log(q.join(' ')); check(q.every(x => x.endsWith(':true')), 'quests done');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
