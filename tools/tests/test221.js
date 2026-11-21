// Build 288: 🩸 핏빛 달 밤 8초 뒤 핏빛 대장(아주 튼튼한 정예) — 잡으면 큰 보물 상자
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__blood = true; window.__eliteChestP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.nights = 2; G.nightOn = false; G.bt = NIGHT_START + NIGHT_CYCLE * 3 + 5; G.ghostDone = true; await new Promise(q => setTimeout(q, 300)); G.bloodLeaderT = 0.1; await new Promise(q => setTimeout(q, 400)); });
  const r = await page.evaluate(() => { const L = SH.G.enemies.find(e => e.bloodBoss); return L ? { hp: L.maxHp, elite: L.elite, scale: L.scale } : null; });
  console.log(JSON.stringify(r)); check(r && r.elite && r.scale > 1.5, 'leader spawned');
  await page.evaluate(() => { const G = SH.G, L = G.enemies.find(e => e.bloodBoss); G.p.x = L.x - 60; G.p.y = L.y; G.cam.x = G.p.x; G.cam.y = G.p.y; L.spd = 0; }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b288_leader.png` });
  const c = await page.evaluate(() => { const G = SH.G, c0 = (G.chests || []).filter(c => !c.small).length, L = G.enemies.find(e => e.bloodBoss); hurtEnemy(L, 1e12, 0, 1, 0); return { big: (G.chests || []).filter(c => !c.small).length - c0, n: ST.bloodLeaders }; });
  console.log(JSON.stringify(c)); check(c.big === 1 && c.n === 1, 'big chest on kill');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
