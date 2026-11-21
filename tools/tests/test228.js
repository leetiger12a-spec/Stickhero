// Build 302: ⏱ 보스 러시 완주 기록 (가장 빠른 시간) — 배너·기록실·탑 카드
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 6; G.p.hp = G.p.maxHp = 1e9; startRush(); });
  for (let i = 0; i < 5; i++) { await page.evaluate(async () => { const G = SH.G; G.st.t = 99; for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); }); await page.waitForTimeout(400); }
  const r = await page.evaluate(() => ({ best: ST.rushBest, ban: SH.G.banner && SH.G.banner.text, row: statRows().find(x => x[0].includes('러시 최고')) }));
  console.log(JSON.stringify(r)); check(r.best > 0 && /신기록/.test(r.ban) && r.row[1] !== '-', 'rush best recorded');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
