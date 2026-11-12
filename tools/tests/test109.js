// 동료 이름표 (Build 153): 고용하면 종류에 맞는 이름(겹치지 않게), 발밑에 그려짐, 일시정지에서 🔄로 바꾸기, 저장·이어하기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const n = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; for (const t of ['sword', 'archer', 'shield', 'golem']) hireAlly(t); return G.allies.map(a => a.type + ':' + a.name); });
  console.log(n.join(' ')); const names = n.map(x => x.split(':')[1]);
  check(names.every(Boolean) && new Set(names).size === 4, 'names missing/duplicate');
  check(await page.evaluate(() => ALLY_NAMES.dog.includes(SH.G.allies[2].name) && ALLY_NAMES.golem.includes(SH.G.allies[3].name) && ALLY_NAMES.cat.includes(SH.G.allies[0].name)), 'name pool by type');
  // 그려짐
  const drawn = await page.evaluate(async () => { const seen = new Set(), r = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t) { seen.add(t); return r.apply(this, arguments); }; await new Promise(q => setTimeout(q, 200)); CanvasRenderingContext2D.prototype.fillText = r; return SH.G.allies.every(a => seen.has(a.name)); });
  check(drawn, 'names not drawn');
  // 바꾸기
  await page.evaluate(() => togglePause()); await page.waitForTimeout(100); const before = await page.evaluate(() => SH.G.allies[0].name);
  await page.click('#pauseStats .anm[data-i="0"]'); await page.waitForTimeout(100); const after = await page.evaluate(() => SH.G.allies[0].name);
  console.log('rename', before, '->', after); check(before !== after, 'rename did nothing');
  await page.screenshot({ path: `${OUT}/b153_pause.png` });
  // 저장
  await page.evaluate(() => { saveGame(); }); await page.reload(); await page.waitForTimeout(700); await page.click('#bContinue'); await page.waitForTimeout(400);
  check(await page.evaluate(n => SH.G.allies[0].name === n, after), 'name not saved');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
