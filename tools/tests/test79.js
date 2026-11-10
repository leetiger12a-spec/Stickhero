// 동료 말풍선 (Build 120): 적이 있으면 14~20초마다 동료 한 명이 말함, 보스를 잡으면 동료 모두 응원, 2초 뒤 사라짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; hireAlly('sword'); hireAlly('archer'); hireAlly('golem'); for (const a of G.allies) { a.hp = a.maxHp = 1e6; } });
  // 적 없음: 말 안 함
  await page.evaluate(() => { SH.G.allySayT = 0.05; }); await page.waitForTimeout(200); check(await page.evaluate(() => SH.G.allies.every(a => !a.say)), 'spoke with no enemies');
  // 적 있음: 한 명
  await page.evaluate(() => { const G = SH.G; for (let i = 0; i < 6; i++) { const e = makeEnemy('grunt', 500 + i * 10, 500); e.spd = 0; G.enemies.push(e); } G.allySayT = 0.05; }); await page.waitForTimeout(200);
  const n1 = await page.evaluate(() => SH.G.allies.filter(a => a.say && a.say.kind === 'fight').length); console.log('fight speakers', n1); check(n1 === 1, 'not exactly one');
  // 보스 처치 → 모두 응원
  await page.evaluate(() => { SH.G.allies.forEach(a => a.say = null); SH.spawnBoss(); SH.G.intro = null; killEnemy(SH.G.boss); }); await page.waitForTimeout(500);
  const n2 = await page.evaluate(() => SH.G.allies.filter(a => a.say && a.say.kind === 'cheer').length); console.log('cheer', n2); check(n2 === 3, 'not all cheer');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.allies[0].x; G.cam.y = G.allies[0].y; }); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b120_ally.png` });
  await page.waitForTimeout(3600); check(await page.evaluate(() => SH.G.allies.every(a => !a.say || a.say.kind !== 'cheer')), 'cheer did not go away');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
