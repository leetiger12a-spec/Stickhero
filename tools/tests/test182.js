// Build 252: 무한 탑 대결 층 — 20·30·40·60…층 보스 2마리 연달아 (50층 황금 골렘은 그대로), 지도 카드 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 60, ach: { floor10: true, floor25: true, floor50: true } })); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => [10, 15, 20, 30, 50, 60].map(f => towerBoss2(f)).join() === ',,13,14,,12'), 'which floors');
  const r = await page.evaluate(async () => {
    const G = SH.G; window.__towerRule = null; SH.tower(20); G.intro = null; G.p.hp = G.p.maxHp = 1e9;
    await new Promise(q => setTimeout(q, 2000)); G.intro = null; const b1 = G.boss && G.boss.name;
    killEnemy(G.boss); const c1 = !!G.st.clear; await new Promise(q => setTimeout(q, 2200)); G.intro = null;
    const b2 = G.boss && G.boss.name; if (G.boss) killEnemy(G.boss); await new Promise(q => setTimeout(q, 300));
    return { b1, c1, b2, c2: !!G.st.clear };
  });
  console.log(JSON.stringify(r));
  check(r.b1 && !r.c1 && r.b2 === '얼음 해골 왕' && r.c2, 'tower duel floor');
  const plain = await page.evaluate(async () => { const G = SH.G; SH.tower(15); G.p.hp = G.p.maxHp = 1e9; for (let i = 0; i < 40 && !G.boss; i++) { await new Promise(q => setTimeout(q, 100)); G.intro = null; } G.intro = null; killEnemy(G.boss); await new Promise(q => setTimeout(q, 300)); return !!G.st.clear; });
  check(plain, 'normal boss floor clears with one boss');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
