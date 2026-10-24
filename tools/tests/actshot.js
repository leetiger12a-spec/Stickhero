// 동작 프레임 캡처: 각 캐릭터의 동작을 시간별로 멈춰서 찍음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.trees = []; G.tavern = true; ['sword', 'archer', 'bomber', 'shield'].forEach(t => hireAlly(t)); G.banner = null;
    G.p.x = -150; G.p.y = 260; G.allies.forEach((a, i) => { a.x = -75 + i * 75; a.y = 260; a.face = 1; a.moving = false; }); G.p.face = 1; G.cam.x = 0; G.cam.y = 240;
    state = 'paused'; showOv(null); });
  const acts = ['slash', 'shoot', 'toss', 'bash'], frames = [0.1, 0.3, 0.45, 0.6, 0.8];
  for (let f = 0; f < frames.length; f++) {
    await page.evaluate(([acts, k]) => { const G = SH.G; G.p.act = 'slash'; G.p.actT = ACTS.slash * k; G.allies.forEach((a, i) => { a.act = acts[i]; a.actT = ACTS[acts[i]] * k; }); }, [acts, frames[f]]);
    await page.waitForTimeout(80);
    await page.screenshot({ path: `${process.env.OUT||'.'}/act_${f}.png`, clip: { x: 0, y: 330, width: 390, height: 190 } });
  }
  await b.close(); console.log('errors', errs.length, errs.join(' | '));
})();
