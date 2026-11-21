// Build 241: 도감 카드 — 황금 잡으면 금색 카드 + ✨황금 표, 보스 카드에서 바로 "다시 싸우기"(마을 일시정지에서)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { ST.kc.grunt = 50; ST.goldT.push('grunt'); ST.bk[BOSSES[0].name] = 3; const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.enemies = []; togglePause(); openDex(); });
  await page.waitForTimeout(200);
  await page.click('.dex[data-k="grunt"]'); await page.waitForTimeout(150);
  check(await page.evaluate(() => !!document.querySelector('#dexCard .card.gold .gtag')), 'gold card');
  await page.screenshot({ path: `${OUT}/b241_gold.png` });
  await page.click('#dexCard .tap'); await page.waitForTimeout(100);
  await page.click('.dex[data-k="boss0"]'); await page.waitForTimeout(150);
  check(await page.evaluate(() => !document.querySelector('#dexCard .card.gold')), 'not gold boss');
  await page.click('#dexCard .dexFight'); await page.waitForTimeout(500);
  const st = await page.evaluate(() => ({ s: SH.state, mode: SH.G.mode, card: document.getElementById('dexCard').classList.contains('show') }));
  console.log(JSON.stringify(st)); check(st.s === 'play' && st.mode === 'stage' && !st.card, 'practice from card');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
