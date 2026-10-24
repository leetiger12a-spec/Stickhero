const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.tap('#bStart'); await page.waitForTimeout(300);
  for (let n = 0; n < 3; n++) {
    await page.evaluate(n => { const G = SH.G; G.enemies = []; G.boss = null; G.bossCount = n; G.p.hp = G.p.maxHp = 1e6; SH.spawnBoss(); }, n);
    const t0 = await page.evaluate(() => SH.G.t);
    for (const [ms, tag] of [[350, 'fall'], [1000, 'stomp'], [1450, 'name']]) { await page.waitForTimeout(ms === 350 ? 350 : ms - (tag === 'stomp' ? 350 : 1000)); if (n === 0) await page.screenshot({ path: `${process.env.OUT||'.'}/b16_intro_${tag}.png` }); }
    check(await page.evaluate(t0 => SH.G.t === t0 && !!SH.G.intro, t0), 'game time moved during intro');
    if (n === 1) { await page.tap('body', { position: { x: 200, y: 400 } }); await page.waitForTimeout(100); check(await page.evaluate(() => !SH.G.intro), 'tap did not skip'); }
    else { await page.waitForTimeout(1500); check(await page.evaluate(() => !SH.G.intro), 'intro did not end'); }
    if (n === 2) await page.screenshot({ path: (process.env.OUT||'.')+'/b16_after.png' });
    await page.waitForTimeout(300);
    check(await page.evaluate(() => SH.G.t > 0), 'time not resumed');
  }
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
