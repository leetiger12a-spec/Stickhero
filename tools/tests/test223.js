// Build 296: 📅 오늘의 보스 — 하루 1번, 정해진 보스 + 특기, 이기면 금고 400 + 상자
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 6; G.day = 2; SH.openMap(); }); await page.click('#bTower'); await page.waitForTimeout(200);
  const txt = await page.evaluate(() => document.getElementById('mapCard').innerText); check(txt.includes('오늘의 보스'), 'card text');
  await page.screenshot({ path: `${OUT}/b296_card.png` });
  const T = await page.evaluate(() => dbossToday()); await page.click('#bGoDBoss'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.t = 99; }); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => { const B = SH.G.boss; if (SH.G.intro) endIntro(); return B && { name: B.name, d: B.dboss }; });
  console.log(JSON.stringify(T), JSON.stringify(r)); check(r && r.d, 'daily boss spawned');
  const bk0 = await page.evaluate(() => bankGold()); await page.evaluate(() => hurtEnemy(SH.G.boss, 1e12, 0, 1, 0)); await page.waitForTimeout(400);
  const w = await page.evaluate(() => ({ bank: bankGold(), chests: (SH.G.chests || []).length, n: ST.dbossWins })); console.log(bk0, JSON.stringify(w));
  check(w.bank === bk0 + 400 && w.chests >= 1 && w.n === 1, 'reward');
  await page.evaluate(() => { SH.returnBase(true); SH.openMap(); }); await page.click('#bTower'); await page.waitForTimeout(200);
  check(await page.evaluate(() => !document.getElementById('bGoDBoss')), 'once per day');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
