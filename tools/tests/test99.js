// 망루 Lv6 (Build 142): 마을 Lv3이 되어야 Lv6 강화(🪙180) 가능, Lv6은 불화살 — 맞은 곳에 불길
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G, pd = G.pads.find(q => q.kind === 'tower' && q.idx === 0); G.towers[0].lvl = 5; pd.built = true; const out = {};
    G.vLvl = 2; out.c2 = padCost(pd); out.l2 = padLabel(pd); G.vLvl = 3; out.c3 = padCost(pd); out.l3 = padLabel(pd); padDone(pd); out.lvl = G.towers[0].lvl; out.ban = G.banner.text; out.c4 = padCost(pd); return out; });
  console.log(JSON.stringify(r)); check(r.c2 === null && r.l2.includes('MAX') && r.c3 && r.c3.g === 180 && r.l3.includes('Lv6') && r.lvl === 6 && r.ban.includes('6') && r.c4 === null, 'lv6 upgrade wrong');
  // 불화살: 적을 맞히면 불길
  const f = await page.evaluate(async () => { const G = SH.G, t = G.towers[0]; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.weapons = {}; G.p.meleeCd = 99; G.pflames = []; G.bullets = [];
    const e = makeEnemy('tank', t.x + 120, t.y - 30); e.hp = e.maxHp = 1e6; e.spd = 0; G.enemies = [e]; t.cd = 0; await new Promise(q => setTimeout(q, 700)); return { fire: G.bullets.some(b => b.fireA) || G.pflames.length > 0, flames: G.pflames.length }; });
  console.log(JSON.stringify(f)); check(f.flames >= 1, 'no flame from fire arrow');
  await page.evaluate(() => { const G = SH.G, t = G.towers[0]; G.cam.x = t.x + 60; G.cam.y = t.y - 30; }); await page.waitForTimeout(100); await page.screenshot({ path: `${OUT}/b142_tower.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
