// Build 280: 🏆 기록 화면 — 새 도전 기록 + 보스별 가장 빠른 기록
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1000);
  await page.evaluate(() => { ST.arenaBest = 12; ST.bloods = 2; ST.bfast = { '거미 여왕': 41 }; ST.bk = { '거미 여왕': 3, '대왕 슬라임': 1 }; });
  await page.click('#bStats'); await page.waitForTimeout(300);
  const t = await page.evaluate(() => ({ txt: document.getElementById('statList').innerText.replace(/\s+/g, ' '), h: document.querySelectorAll('#statList .stH').length }));
  console.log(t.txt.slice(-400)); check(t.h === 2 && t.txt.includes('웨이브 12') && t.txt.includes('41초') && t.txt.includes('기록 없음') && t.txt.includes('❓'), 'new rows');
  await page.evaluate(() => { const l = document.getElementById('statList'); l.scrollTop = 99999; }); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b280_stats.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
