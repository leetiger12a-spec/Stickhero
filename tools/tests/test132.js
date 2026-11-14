// 👹 몬스터 동작 그림 (Build 191~): 졸개 걷기·공격 시트, 황금·맞을 때는 기존 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => !!SPR.grunt_walk && !!SPR.grunt_atk && WALK_SHEET.grunt && ACT_SHEET.grunt.eatk && !!SPR.runner_walk && !!SPR.runner_atk && !!SPR.tank_walk && !!SPR.tank_atk && !!SPR.e_slime_walk && !!SPR.e_slime_atk && !!SPR.e_archer_walk && !!SPR.e_archer_atk && !!SPR.e_bomber_walk && !!SPR.e_bomber_atk), 'sheets loaded');
  const r = await page.evaluate(() => { const e = makeEnemy('grunt', 0, 0); const a = enemyAnim(e); e.lunge = 0.1; const b = enemyAnim(e); e.flash = 0.05; const c = enemyAnim(e); e.flash = 0; e.golden = true; const d = enemyAnim(e); return [a.walking, b.act, c.act, d.act]; });
  check(r[0] === true && r[1] === 'eatk' && r[2] === undefined && r[3] === undefined, 'anim pick ' + r);
  await page.evaluate(() => { const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; p.hp = p.maxHp = 1e9;
    for (let i = 0; i < 4; i++) { const e = makeEnemy(['grunt', 'runner', 'tank', 'e_slime'][i], p.x - 90 + i * 60, p.y + 120); G.enemies.push(e); } G.enemies[1].lunge = 0.12; G.enemies[1].spd = 0; });
  await page.waitForTimeout(60); await page.screenshot({ path: `${OUT}/b191_grunt.png`, clip: { x: 60, y: 300, width: 280, height: 260 } });
  await page.waitForTimeout(1500);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
