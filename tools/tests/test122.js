// 💥 영웅 필살기 (Build 169): 처치로 게이지, 100%면 버튼 → 주변 적 처치·보스 10%·무적·화면 효과, 스페이스 키
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e6; });
  check(await page.evaluate(() => $('bUlt').classList.contains('show') && !$('bUlt').classList.contains('ready') && !castUlt()), 'ult not ready');
  // 처치 50번 → 100%
  await page.evaluate(() => { const G = SH.G; for (let i = 0; i < 50; i++) { const e = makeEnemy('grunt', 300, 300); G.enemies.push(e); hurtEnemy(e, 1e9, 0, 0, 0); } }); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.ult === 100 && $('bUlt').classList.contains('ready') && $('ultTx').textContent === '필살!'), 'ult ready');
  await page.screenshot({ path: `${OUT}/b169_ready.png` });
  const r = await page.evaluate(() => { const G = SH.G, p = G.p; G.enemies.length = 0;
    for (let i = 0; i < 12; i++) G.enemies.push(makeEnemy('tank', p.x + rand(-300, 300), p.y + rand(-300, 300)));
    const far = makeEnemy('grunt', p.x + 900, p.y); G.enemies.push(far); SH.spawnBoss(p.x + 100, p.y - 100); const bo = G.boss; bo.x = p.x + 100; bo.y = p.y - 100; const bh = bo.hp; return { bh, far: far.id }; });
  await page.evaluate(() => SH.skipIntro && SH.skipIntro()); await page.waitForTimeout(200);
  await page.keyboard.press('Space'); await page.waitForTimeout(120);
  await page.screenshot({ path: `${OUT}/b169_boom.png` });
  const s = await page.evaluate(id => { const G = SH.G; return { tanks: G.enemies.filter(e => e.type === 'tank' && !e.dead).length, far: G.enemies.some(e => e.id === id && !e.dead), boss: G.boss && G.boss.hp / G.boss.maxHp, ult: G.ult, inv: G.p.inv > 0.5 }; }, r.far);
  console.log(JSON.stringify(s));
  check(s.tanks === 0 && s.far && s.boss > 0.75 && s.boss < 0.95 && s.ult === 24 && s.inv, 'ult effect');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
