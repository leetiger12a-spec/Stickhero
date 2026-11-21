// Build 342: 💚 치유 정예 — 3초마다 주변(170) 적 체력 15% 회복, 멀리 있는 적·자기 자신은 안 됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.dmgMul = 0; G.weapons = {};
    const h = makeEnemy('grunt', G.p.x + 500, G.p.y); makeElite(h, 'heal'); h.eT = 0.05; const near = makeEnemy('tank', h.x + 60, h.y), far = makeEnemy('tank', h.x + 400, h.y); G.enemies.push(h, near, far);
    for (const o of [near, far]) { o.hp = o.maxHp * 0.5; o.spd = 0; } h.spd = 0; h.hp = h.maxHp * 0.5; await new Promise(q => setTimeout(q, 250));
    const out = { near: near.hp / near.maxHp, far: far.hp / far.maxHp, self: h.hp / h.maxHp }; G.p.dmgMul = 1; hurtEnemy(h, 1e12, 0, 1, 0); return { ...out, st: ST.healElites, kinds: Object.keys(ELITE_K).length }; });
  console.log(JSON.stringify(r)); check(Math.abs(r.near - 0.65) < 0.02 && r.far === 0.5 && r.self === 0.5 && r.st >= 1 && r.kinds === 12, 'heal elite');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
