// SKYFANG 비행대 5명: 무작위 교대, 조종사 무전, 폭격
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.click('#bStart'); await page.waitForTimeout(400);
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  for (let k = 0; k < 5; k++) {
    await page.evaluate(k => { const G = SH.G; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.allies = []; G.enemies = []; G.p.x = 0; G.p.y = 260; G.banner = null;
      for (let i = 0; i < 20; i++) G.enemies.push(makeEnemy('grunt', rand(-80, 80), 340 + rand(0, 60))); SH.plane(k); }, k);
    const k0 = await page.evaluate(() => SH.G.kills);
    await page.waitForTimeout(1300); await pick();
    await page.screenshot({ path: `${OUT}/b29_sq${k}.png` });
    for (let i = 0; i < 30 && await page.evaluate(() => !!SH.G.plane || SH.G.bombs.length); i++) { await pick(); await page.waitForTimeout(100); }
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({ kills: SH.G.kills }));
    console.log('squad', k, 'kills', r.kills - k0); check(r.kills - k0 >= 3, 'squad ' + k + ' weak');
  }
  // 무작위 교대: 같은 비행기가 연속으로 나오지 않음
  const seq = await page.evaluate(() => { const out = []; for (let i = 0; i < 30; i++) { SH.G.enemies = [makeEnemy('grunt', 0, 300)]; callPlane(); out.push(SH.G.plane.k); SH.G.plane = null; } return out; });
  console.log('order', seq.join(''));
  check(seq.every((v, i) => i === 0 || v !== seq[i - 1]), 'same plane twice in a row');
  check(new Set(seq).size === 5, 'not all planes appear');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
