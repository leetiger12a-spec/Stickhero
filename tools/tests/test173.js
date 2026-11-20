// Build 243: ⏸ 화면 넓이 버튼 — 가까이/보통/멀리 바뀜 + 기억 (다시 켜도 그대로)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const s0 = await page.evaluate(() => SCALE); check(Math.abs(s0 - 412 / 620) < 0.01, 'default normal ' + s0);
  await page.click('#bPause'); await page.waitForTimeout(150);
  const seen = [];
  for (let i = 0; i < 3; i++) {
    await page.click('#bViewP'); await page.waitForTimeout(100);
    seen.push(await page.evaluate(() => [document.getElementById('bViewP').textContent, Math.round(VW)]));
    await page.click('#bResume').catch(() => page.evaluate(() => togglePause())); await page.waitForTimeout(250);
    await page.screenshot({ path: `${OUT}/b243_view${i}.png` });
    await page.click('#bPause'); await page.waitForTimeout(150);
  }
  console.log(JSON.stringify(seen));
  check(seen[0][1] === 720 && seen[1][1] === 520 && seen[2][1] === 620, 'cycle far→near→normal');
  await page.click('#bViewP'); await page.waitForTimeout(100);   // 멀리로 두고
  await page.reload(); await page.waitForTimeout(900);
  check(await page.evaluate(() => Math.round(VW) === 720), 'remembered after reload');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
