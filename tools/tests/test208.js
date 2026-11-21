// Build 275: 🔥 불꽃 정예(쓰러지면 불길) · ❄ 얼음 정예(닿으면 느려짐)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.hazards = []; G.p.hp = G.p.maxHp = 1e6;
    const f = makeEnemy('grunt', G.p.x + 200, G.p.y); makeElite(f, 'fire'); G.enemies.push(f); hurtEnemy(f, 1e9, 0, 1, 0);
    return { fireHaz: G.hazards.length, kinds: Object.keys(ELITE_K) }; });
  console.log(JSON.stringify(r)); check(r.fireHaz >= 4 && r.kinds.includes('ice'), 'fire elite leaves flames');
  await page.evaluate(() => { const G = SH.G; G.hazards = []; G.p.slowT = 0; G.weapons = {}; G.allies.forEach(a => a.dead = true); window.__slows = 0; const o = window.slowHero; window.slowHero = function (t) { window.__slows++; return o(t); }; const e = makeEnemy('grunt', G.p.x + 30, G.p.y); makeElite(e, 'ice'); e.awake = true; e.hp = e.maxHp = 1e9; G.enemies.push(e); }); await page.waitForTimeout(1200);
  const s = await page.evaluate(() => window.__slows); console.log('slow', s); check(s > 0, 'ice elite slows hero');
  await page.screenshot({ path: `${OUT}/b275_ice.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
