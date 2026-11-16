// Build 222: 게임 오버 때 가방 속 상자는 다음 날로 가져감 (화면에 안내 + 저장에 남음)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  const r = await page.evaluate(() => { const G = SH.G; G.bag = [{ small: true }, { small: false }, { jack: true }]; gameOver();
    const d = JSON.parse(localStorage.getItem('stickhero_save')); return { txt: document.getElementById('bestOver').textContent, saved: (d.bag || []).length }; });
  console.log(JSON.stringify(r)); check(r.txt.includes('가방 속 상자 3개'), 'over text'); check(r.saved === 3, 'bag kept in save');
  await page.screenshot({ path: `${OUT}/b222_over.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
