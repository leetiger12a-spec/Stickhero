// Build 270: 🏟 투기장 — 입장료 100, 웨이브 20초씩, 웨이브마다 적이 세지고 보상, 쓰러지면 기록 남기고 마을로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 1; SH.openMap(); });
  check(await page.evaluate(() => getComputedStyle(document.getElementById('bArena')).display === 'none'), 'locked hidden');
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; G.gold = 150; SH.openMap(); }); await page.waitForTimeout(200);
  check(await page.evaluate(() => getComputedStyle(document.getElementById('bArena')).display !== 'none'), 'arena button shown');
  await page.click('#bArena'); await page.waitForTimeout(200); await page.screenshot({ path: `${OUT}/b270_card.png` });
  await page.click('#bGoArena'); await page.waitForTimeout(500);
  const r1 = await page.evaluate(() => ({ gold: SH.G.gold, arena: SH.G.st && SH.G.st.arena, mode: SH.G.mode }));
  console.log(JSON.stringify(r1)); check(r1.gold === 150 && r1.arena === 1 && r1.mode === 'stage', 'entered free (first today)');
  const hp1 = await page.evaluate(() => makeEnemy('grunt', 0, 0).maxHp);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.timer = 0.05; }); await page.waitForTimeout(500);
  const r2 = await page.evaluate(() => ({ gold: SH.G.gold, arena: SH.G.st.arena, best: ST.arenaBest, hp: makeEnemy('grunt', 0, 0).maxHp }));
  console.log(JSON.stringify(r2), hp1); check(r2.arena === 2 && r2.best === 1 && r2.gold >= 50 + 55 && r2.hp > hp1 * 1.15, 'wave 2, reward, stronger');
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b270_wave.png` });
  for (let i = 0; i < 3; i++) { await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400); }
  check(await page.evaluate(() => SH.G.st.arena === 5), 'wave 5');
  await page.evaluate(() => { const G = SH.G; G.p.maxHp = 100; G.p.hp = 0; G.p.dead = true; G.respawnT = 0.01; }); await page.waitForTimeout(800);
  const r3 = await page.evaluate(() => ({ mode: SH.G.mode, best: ST.arenaBest, ach: !!ACH.find(a => a.id === 'arena10') }));
  console.log(JSON.stringify(r3)); check(r3.mode === 'base' && r3.best === 4 && r3.ach, 'back to base with record');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
