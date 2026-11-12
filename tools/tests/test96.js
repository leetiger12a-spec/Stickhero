// 보스 러시 (Build 139): 무한 탑 카드에 보스 러시 (5칸 깨면 열림, 하루 1번), 보스 5마리 연달아 (사이 25% 회복), 완주하면 금고 +300 + 포털, 쓰러지면 잡은 수 알림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.need = 1e9; G.pads.find(q => q.order === 0).built = true; G.stageN = 4; openMap(); });
  await page.click('#bTower'); await page.waitForTimeout(100); check(await page.evaluate(() => !$('bGoRush') && $('mapCard').textContent.includes('5칸')), 'rush open too early');
  await page.evaluate(() => { SH.G.stageN = 6; openMap(); }); await page.click('#bTower'); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b139_card.png` });
  const bank0 = await page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0);
  await page.click('#bGoRush'); await page.waitForTimeout(300);
  const st = await page.evaluate(() => ({ mode: SH.G.mode, rush: SH.G.st.rush && SH.G.st.rush.list.join(), sorted: SH.G.st.rush.list.every((v, i, a) => !i || a[i - 1] < v) })); console.log(JSON.stringify(st));
  check(st.mode === 'stage' && st.rush && st.sorted, 'rush not started');
  const names = [];
  for (let k = 0; k < 5; k++) {
    const ok = await page.waitForFunction(() => SH.G.boss && !SH.G.boss.dead, null, { timeout: 8000 }).then(() => true, () => false); if (!ok) { check(false, 'boss ' + (k + 1) + ' did not come'); break; }
    names.push(await page.evaluate(() => { const G = SH.G; G.intro = null; G.p.hp = G.p.maxHp * 0.5; const e = G.boss, n = e.name; hurtEnemy(e, 1e12, 0, 1, 0); return n; }));
    await page.waitForTimeout(300); await page.evaluate(() => { SH.G.slow = 0; });
  }
  console.log('bosses', names.join(' · '));
  const end = await page.evaluate(b0 => ({ won: SH.G.st.rush.won, clear: SH.G.st.clear, portal: !!SH.G.st.portal, bank: ((JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0) - b0, rushes: ST.rushes }), bank0);
  console.log(JSON.stringify(end)); check(end.won === 5 && end.clear && end.portal && end.bank === 300 && end.rushes === 1, 'rush end wrong'); check(new Set(names).size === 5, 'same boss twice');
  await page.evaluate(() => returnBase(true)); await page.waitForTimeout(150); check(await page.evaluate(() => SH.G.banner.text.includes('러시')), 'return banner');
  await page.evaluate(() => openMap()); await page.click('#bTower'); await page.waitForTimeout(100); check(await page.evaluate(() => !$('bGoRush') && $('mapCard').textContent.includes('이미')), 'twice same day');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
