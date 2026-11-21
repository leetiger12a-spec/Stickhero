// Build 283: ⚡ 번개 정예(영웅 자리에 번개) · 💣 폭발 정예(쓰러지면 0.8초 뒤 펑)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.hazards = []; G.weapons = {}; G.p.hp = G.p.maxHp = 1000; G.p.inv = 0;
    const e = makeEnemy('grunt', G.p.x + 250, G.p.y); makeElite(e, 'bolt'); e.eT = 0.05; e.spd = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e);
    await new Promise(q => setTimeout(q, 300)); const bolt = G.hazards.filter(h => h.bolt).length; const hp0 = G.p.hp; await new Promise(q => setTimeout(q, 1200));
    return { bolt, hurt: hp0 - G.p.hp }; });
  console.log(JSON.stringify(r)); check(r.bolt === 1 && r.hurt > 0, 'bolt strikes hero spot');
  const r2 = await page.evaluate(async () => { const G = SH.G; G.enemies = []; G.hazards = []; G.p.hp = 1000; G.p.inv = 0;
    const e = makeEnemy('grunt', G.p.x + 30, G.p.y); makeElite(e, 'bomb'); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); const n = G.hazards.length;
    await new Promise(q => setTimeout(q, 1300)); return { n, hurt: 1000 - G.p.hp }; });
  console.log(JSON.stringify(r2)); check(r2.n === 1 && r2.hurt > 0, 'bomb elite explodes');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
