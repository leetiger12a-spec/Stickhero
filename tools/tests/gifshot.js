// 동작을 일정 간격으로 멈춰 찍어 GIF 프레임으로 저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const who = process.argv[2] || 'hero';
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.trees = []; G.banner = null; G.p.x = 0; G.p.y = 300; G.p.face = 1; G.cam.x = 0; G.cam.y = 288; state = 'paused'; showOv(null); G.hint = null; G.pads.forEach(q => q.built = true); });
  const N = 16, cycle = 0.32 + 0.3;  // 베기 + 잠깐 쉼
  for (let i = 0; i < N; i++) {
    await page.evaluate(([t]) => { const p = SH.G.p; if (t < ACTS.slash) { p.act = 'slash'; p.actT = t; } else { p.act = null; } }, [i / N * cycle]);
    await page.waitForTimeout(60);
    await page.screenshot({ path: `${process.env.OUT||'.'}/gif_${i}.png`, clip: { x: 115, y: 330, width: 160, height: 150 } });
  }
  await b.close(); console.log('errors', errs.length, errs.join('|'));
})();
