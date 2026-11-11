// 보스 빨리 잡기 기록 (Build 132): 보스를 잡으면 걸린 초를 기록, 더 빨리 잡으면 바뀌고 알림, 느리면 그대로, 도감에 "🏆 가장 빨리 N초", 저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const kill = sec => page.evaluate(sec => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.need = 1e9; G.texts = []; window.__bossN = 0; SH.spawnBoss(); G.intro = null; const e = G.boss; e.bornT = G.t - sec; killEnemy(e); G.chests = []; G.gems = [];
    return { name: e.name, rec: (ST.bfast || {})[e.name], txt: G.texts.some(t => t.text.includes('최고 기록')) }; }, sec);
  const a = await kill(40); const b2 = await kill(25); const c = await kill(60); console.log(JSON.stringify([a, b2, c]));
  check(a.rec === 40 && !a.txt, 'first record'); check(b2.name === a.name && b2.rec === 25 && b2.txt, 'faster not recorded'); check(c.rec === 25 && !c.txt, 'slower changed record');
  const saved = await page.evaluate(n => { checkAch(); return ((JSON.parse(localStorage.getItem('stickhero_meta')).st || {}).bfast || {})[n]; }, a.name); check(saved === 25, 'not saved');
  await page.evaluate(() => { togglePause(); openDex(); }); await page.waitForTimeout(200);
  const dex = await page.evaluate(() => [...document.querySelectorAll('.cnt.fast')].map(e => e.textContent)); console.log(dex); check(dex.some(t => t.includes('25초')), 'not in dex');
  await page.evaluate(() => { const el = document.querySelector('.cnt.fast'); el && el.scrollIntoView({ block: 'center' }); }); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b132_dex.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
