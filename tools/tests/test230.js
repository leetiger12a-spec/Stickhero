// Build 304: 새 퀘스트 3종 — 오늘의 보스·투기장 특별 웨이브·금화 줍기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'swift'; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.quests = [{ id: 'coins', goal: 5, prog: 0, done: false }, { id: 'arenarule', goal: 1, prog: 0, done: false }, { id: 'dboss', goal: 1, prog: 0, done: false }];
    for (let i = 0; i < 8; i++) dropCoin(G.p.x + 3, G.p.y + 3); await new Promise(q => setTimeout(q, 600)); G.stageN = 6; G.p.hp = G.p.maxHp = 1e9; startDBoss(); G.st.t = 99; for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); await new Promise(q => setTimeout(q, 300)); SH.returnBase(true); SH.openMap(); });
  await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 1e9; SH.G.st.timer = 0.05; }); await page.waitForTimeout(350); }
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done)); console.log(q.join(' ')); check(q.every(x => x.endsWith('true')), 'three quests done');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
