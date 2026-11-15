// 🐱 함께 다니는 동료 최대 2명 (Build 203): 3명째부터 숙소에서 쉼, ⏸에서 골라 바꾸기, 저장·불러오기, 옛 저장(4명)은 2명만 함께
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; for (const t of ['sword', 'archer', 'bomber', 'shield']) hireAlly(t); return { on: G.allies.map(a => a.type), rest: G.bench.map(a => a.type), cnt: allyCount() }; });
  console.log(JSON.stringify(r)); check(r.on.join() === 'sword,archer' && r.rest.join() === 'bomber,shield' && r.cnt === 4, 'max 2 active');
  await page.click('#bPause'); await page.waitForTimeout(200);
  check(await page.evaluate(() => document.querySelectorAll('.apk').length === 4 && document.querySelectorAll('.apk.on').length === 2), 'picker shown');
  await page.screenshot({ path: `${OUT}/b203_pick.png` });
  // 💤 폭탄 → 함께 (꽉 차서 마지막(활)과 바꿈)
  await page.click('.apk[data-on="0"][data-i="0"]'); await page.waitForTimeout(150);
  const s = await page.evaluate(() => ({ on: SH.G.allies.map(a => a.type), rest: SH.G.bench.map(a => a.type) }));
  console.log(JSON.stringify(s)); check(s.on.join() === 'sword,bomber' && s.rest.includes('archer') && s.rest.includes('shield'), 'swap');
  // ✅ 칼 → 쉬기 (1명만 함께도 가능)
  await page.click('.apk[data-on="1"][data-i="0"]'); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.allies.length === 1 && SH.G.bench.length === 3), 'bench one');
  // 저장·불러오기
  const sv = await page.evaluate(() => { const d = buildSave(); loadGame(d); return { on: SH.G.allies.length, rest: SH.G.bench.length }; });
  check(sv.on === 1 && sv.rest === 3, 'save/load ' + JSON.stringify(sv));
  // 옛 저장: 4명 모두 함께였던 것 → 2명만
  const old = await page.evaluate(() => { const d = buildSave(); d.allies = [['sword', 2, 0, 'a'], ['archer', 1, 0, 'b'], ['bomber', 1, 0, 'c'], ['shield', 1, 0, 'd']]; loadGame(d); return [SH.G.allies.length, SH.G.bench.length]; });
  check(old[0] === 2 && old[1] === 2, 'old save ' + old);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
