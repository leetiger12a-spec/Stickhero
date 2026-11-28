// Build 333: 💥 투기장 폭발 웨이브 — 쓰러진 적 자리에 0.9초 경고 뒤 펑, 금화 1.5배
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'boomw'; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e6; G.st.arenaRule = 'boomw'; const plain = makeEnemy('grunt', 0, 0).gold; G.st.arenaRule = null; const g0 = makeEnemy('grunt', 0, 0).gold; G.st.arenaRule = 'boomw';
    const e = makeEnemy('grunt', G.p.x + 30, G.p.y); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); const hz = G.hazards.filter(h => h.boomw).length, hp0 = G.p.hp;
    await new Promise(q => setTimeout(q, 1400)); return { plain, g0, hz, hurt: G.p.hp < hp0, n: Object.keys(ARENA_RULES).length }; });
  console.log(JSON.stringify(r)); check(r.hz === 1 && r.hurt && r.plain >= r.g0 && r.n === 8, 'boom wave');
  await page.evaluate(() => { const G = SH.G; for (let i = 0; i < 3; i++) { const e = makeEnemy('grunt', G.p.x + 60 + i * 50, G.p.y - 40); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); } }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b333_boom.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
