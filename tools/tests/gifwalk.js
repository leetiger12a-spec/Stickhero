const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => { const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.trees = []; G.tavern = true; ['sword','archer','bomber','shield'].forEach(t => hireAlly(t)); G.banner = null; G.pads.forEach(q => q.built = true);
    G.p.x = -100; G.p.y = 300; G.p.face = 1; G.allies.forEach((a, j) => { a.x = -30 + j * 55; a.y = 300; a.face = 1; }); G.cam.x = 0; G.cam.y = 288; state = 'paused'; showOv(null); });
  for (let i = 0; i < 16; i++) { await page.evaluate(i => { const G = SH.G; G.hint = null; G.p.moving = true; G.p.walk = i * 0.8; G.allies.forEach(a => { a.moving = true; a.act = null; a.wob = i * 0.8; }); }, i);
    await page.waitForTimeout(50); await page.screenshot({ path: `${process.env.OUT||'.'}/w_${i}.png`, clip: { x: 60, y: 330, width: 300, height: 140 } }); }
  await b.close(); console.log('errors', errs.length, errs.join('|')); })();
