// 걷기(영웅) + 동료 3종 동작을 한 화면에서 GIF 프레임으로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.trees = []; G.tavern = true; ['archer', 'bomber', 'shield'].forEach(t => hireAlly(t)); G.banner = null; G.hint = null; G.pads.forEach(q => q.built = true);
    G.p.x = -120; G.p.y = 300; G.p.face = 1; G.allies.forEach((a, i) => { a.x = -40 + i * 70; a.y = 300; a.face = 1; a.moving = false; a.act = null; }); G.cam.x = 0; G.cam.y = 288; state = 'paused'; showOv(null); });
  const N = 24, cycle = 1.2;
  for (let i = 0; i < N; i++) {
    const t = i / N * cycle;
    await page.evaluate(([t]) => { const G = SH.G, p = G.p; p.moving = true; p.walk = t * 12; G.hint = null;
      const acts = ['shoot', 'toss', 'bash']; G.allies.forEach((a, j) => { const tt = (t - j * 0.15 + 3) % 1.2; if (tt < ACTS[acts[j]]) { a.act = acts[j]; a.actT = tt; } else a.act = null; }); }, [t]);
    await page.waitForTimeout(50);
    await page.screenshot({ path: `${process.env.OUT||'.'}/g2_${i}.png`, clip: { x: 40, y: 330, width: 330, height: 140 } });
  }
  await b.close(); console.log('errors', errs.length, errs.join('|'));
})();
