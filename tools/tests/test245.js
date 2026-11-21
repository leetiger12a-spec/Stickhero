// Build 325: 퀘스트 2종 — 🧲 자석 정예 · 💪 투기장 기세 +30%
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'magnet', goal: 1, prog: 0, done: false }, { id: 'momentum', goal: 1, prog: 0, done: false }]; const e = makeEnemy('grunt', G.p.x + 300, G.p.y); makeElite(e, 'magnet'); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); G.stageN = 3; SH.openMap(); });
  await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arena = 10; G.st.timer = 0.05; await new Promise(q => setTimeout(q, 400)); if (G.intro) endIntro(); if (G.boss) hurtEnemy(G.boss, 1e13, 0, 1, 0); await new Promise(q => setTimeout(q, 400)); });
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done + ':' + SH.G.st.arena)); console.log(q.join(' ')); check(q.every(x => x.includes(':true')), 'quests done');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
