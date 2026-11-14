// 👑 보스 러시 후보 (Build 170): 해골 왕국 열면 해골 왕 5마리 포함, Lv 30부터 센 보스만, 해골 왕으로 러시 시작
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const p = await page.evaluate(() => { const G = SH.G; G.stageN = 6; const a = rushPool(); G.stageN = 15; const c = rushPool(); G.lvl = 40; const d = rushPool(); return { a, c, d }; });
  console.log(JSON.stringify(p));
  check(p.a.length === 10 && !p.a.includes(11), 'pool before skull');
  check(p.c.length === 15 && [11, 12, 13, 14, 15].every(n => p.c.includes(n)) && !p.c.includes(10), 'pool with skull');
  check(p.d.every(n => n >= 3) && p.d.includes(15), 'pool hi level');
  // 해골 왕만 남겨서 러시 시작
  await page.evaluate(() => { window.__rp = rushPool; rushPool = () => [11, 12, 13, 14, 15]; startRush(); }); await page.waitForTimeout(2600);
  const r = await page.evaluate(() => ({ list: SH.G.st.rush.list, boss: SH.G.boss && SH.G.boss.name }));
  console.log(JSON.stringify(r)); check(r.list.length === 5 && r.boss === '번개 해골 왕', 'rush with skull kings');
  await page.evaluate(() => SH.skipIntro && SH.skipIntro()); await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/b170_rush.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
