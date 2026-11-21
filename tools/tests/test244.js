// Build 324: 📅 도감 보스 카드에 '오늘의 보스' 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.evaluate(() => showDexCard('boss3')); check(await page.evaluate(() => !document.getElementById('dexCard').innerText.includes('오늘의 보스')), 'no tag on title'); await page.evaluate(() => document.getElementById('dexCard').classList.remove('show'));
  await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { SH.G.stageN = 6; const T = dbossToday(), k = 'boss' + T.n; showDexCard(k); const a = document.getElementById('dexCard').innerText.includes('오늘의 보스'); document.getElementById('dexCard').classList.remove('show'); showDexCard('boss' + (T.n === 0 ? 1 : 0)); const o = document.getElementById('dexCard').innerText.includes('오늘의 보스!'); return { a, o }; });
  console.log(JSON.stringify(r)); check(r.a && !r.o, 'tag only on today');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
