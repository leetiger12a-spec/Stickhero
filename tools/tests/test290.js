// Build 390: 🍪 쿠키맨이 쓰러지면 작은 쿠키 2개 (작은 쿠키는 다시 안 갈라지고, 겨울 퀘스트에 안 셈)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6;
    const e = makeEnemy('e_ginger', G.p.x + 120, G.p.y - 40); e.dmg = 0; G.enemies.push(e); G.cam.x = G.p.x + 60; G.cam.y = G.p.y - 20;
    killEnemy(e); await new Promise(q => setTimeout(q, 60));
    const kids = G.enemies.filter(m => !m.dead && m.type === 'e_ginger');
    const ok1 = kids.length === 2 && kids.every(m => m.small && m.scale === 0.6 && m.hp < e.maxHp * 0.3 && m.spd > e.spd);
    await new Promise(q => setTimeout(q, 300));
    kids.forEach(m => killEnemy(m)); await new Promise(q => setTimeout(q, 60));
    const after = G.enemies.filter(m => !m.dead && m.type === 'e_ginger').length;
    return { kids: kids.length, ok1, after };
  });
  console.log(JSON.stringify(r)); check(r.ok1, 'split into 2 small fast cookies'); check(r.after === 0, 'small cookies do not split again');
  await page.evaluate(() => { const G = SH.G; G.enemies = []; const e = makeEnemy('e_ginger', G.p.x + 120, G.p.y - 40); e.dmg = 0; e.spd = 0; G.enemies.push(e); killEnemy(e); G.enemies.forEach(m => { m.spd = 0; m.dmg = 0; }); }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b390_ginger_split.png`, clip: { x: 95, y: 280, width: 260, height: 200 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
