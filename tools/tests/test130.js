// 🐱 새 그림체 동료 4명 + 졸개·달리기·탱크·대왕 슬라임 (Build 179): 옛 동작 시트 끔, 성장 전엔 꼬마 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => !isGrown() && WALK_SHEET.ally_sword === 'ally_sword_walk' && ACT_SHEET.ally_sword && WALK_SHEET.ally_archer && WALK_SHEET.ally_bomber && WALK_SHEET.ally_shield && WALK_SHEET.ally_golem), 'sheets off');
  await page.evaluate(() => { const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; p.hp = p.maxHp = 1e9; p.y = 100;
    for (const t of ['sword', 'archer', 'bomber', 'shield']) G.allies.push(makeAlly(t)); G.allies.forEach((a, i) => { a.x = p.x - 100 + i * 66; a.y = p.y + 60; });
    [['grunt', -110], ['runner', -40], ['tank', 40], ['grunt', 110]].forEach(([t, dx]) => { const e = makeEnemy(t, p.x + dx, p.y + 200); e.spd = 0; G.enemies.push(e); });
    SH.spawnBoss(0, 0); });
  await page.waitForTimeout(300); await page.evaluate(() => { SH.skipIntro && SH.skipIntro(); const bo = SH.G.boss; bo.x = SH.G.p.x; bo.y = SH.G.p.y + 400; bo.spd = 0; SH.G.enemies.forEach(e => e.spd = 0); });
  await page.waitForTimeout(600); await page.evaluate(() => { SH.G.banner = null; }); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b179_team.png` });
  await page.keyboard.down('d'); await page.waitForTimeout(500); await page.keyboard.up('d');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
