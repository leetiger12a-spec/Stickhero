// 🧑 성장 이야기 (Build 178): 20칸 첫 클리어 → '성장 이야기' 버튼 → 이야기 3장 → 성장(영원히), 영웅·동료 +20%, 성장 동료·몬스터 그림 / 이미 깬 사람은 다음 판에
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => !isGrown() && SPR.ally_sword_adult && SPR.runner_adult), 'not grown, sprites loaded');
  const d0 = await page.evaluate(() => SH.G.p.dmgMul);
  // 20칸 클리어
  await page.evaluate(() => { const G = SH.G; G.stageN = 19; SH.enterStage(19); }); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e6; G.boss = null; G.enemies.length = 0; stageClear(G.p.x, G.p.y); }); await page.waitForTimeout(300);
  await page.evaluate(() => { const q = SH.G.st.portal; SH.G.p.x = q.x; SH.G.p.y = q.y; }); for (let i = 0; i < 20 && await page.evaluate(() => SH.state !== 'clear'); i++) await page.waitForTimeout(200);
  console.log('state', await page.evaluate(() => [SH.state, $('bClrOk').textContent]));
  check(await page.evaluate(() => $('bClrOk').textContent.startsWith('성장')), 'grow button');
  await page.click('#bClrOk'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.state === 'story' && $('storyCap').textContent.includes('다섯 왕국') && isGrown()), 'grow story 1');
  await page.screenshot({ path: `${OUT}/b178_story.png` });
  for (let i = 0; i < 3; i++) { await page.click('#ovStory', { position: { x: 200, y: 400 } }); await page.waitForTimeout(250); }
  const r = await page.evaluate(() => ({ st: SH.state, ban: SH.G.banner && SH.G.banner.text, dm: SH.G.p.dmgMul, am: allyMul({ lvl: 1 }) }));
  console.log(JSON.stringify(r)); check(r.st === 'play' && r.ban.includes('성장') && Math.abs(r.dm / d0 - 1.2) < 0.001 && Math.abs(r.am - 1.2) < 0.001, 'grown effects');
  // 성장 그림: 동료·달리기 졸개
  await page.evaluate(() => { const G = SH.G, p = G.p; G.enemies.length = 0; for (const t of ['sword', 'archer', 'bomber', 'shield']) G.allies.push(makeAlly(t)); G.allies.forEach((a, i) => { a.x = p.x - 90 + i * 60; a.y = p.y + 70; });
    for (let i = 0; i < 3; i++) { const e = makeEnemy('runner', p.x - 60 + i * 60, p.y + 170); e.spd = 0; G.enemies.push(e); } G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; });
  await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/b178_grown.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
