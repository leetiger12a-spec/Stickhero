// Build 253: 🐱 동료 작전 — ⏸ 버튼으로 보통/돌격/지키기, 기억, 돌격은 멀리 있는 적까지 쫓아가고 지키기는 영웅 곁에 남음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const run = mode => page.evaluate(async ({ mode, dist }) => {
    allyMode = mode; const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9; G.p.x = 0; G.p.y = 60;
    if (!G.allies.length) hireAlly('sword'); const a = G.allies[0]; a.x = 30; a.y = 60; a.hp = a.maxHp = 1e9;
    const e = makeEnemy('tank', dist, 60); e.spd = 0; e.dmg = 0; e.hp = e.maxHp = 1e9; G.enemies.push(e);
    await new Promise(q => setTimeout(q, 1500)); const ax = a.x; G.enemies = []; return Math.round(ax);
  }, { mode, dist: mode === 2 ? 200 : 320 });
  const normal = await run(0), charge = await run(1), guard = await run(2);
  console.log(JSON.stringify({ normal, charge, guard }));
  check(normal < 100, 'normal stays (enemy 320 away)'); check(charge > 200, 'charge chases far'); check(guard < 100, 'guard stays (enemy 200 away)');
  await page.click('#bPause'); await page.waitForTimeout(150);
  const t = []; for (let i = 0; i < 3; i++) { await page.click('#bAllyP'); await page.waitForTimeout(80); t.push(await page.textContent('#bAllyP')); }
  console.log(t.join(' | ')); check(t[0].includes('보통') && t[1].includes('돌격') && t[2].includes('지키기'), 'button cycles');
  await page.click('#bAllyP'); await page.reload(); await page.waitForTimeout(800);
  check(await page.evaluate(() => allyMode === 0), 'remembered');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
