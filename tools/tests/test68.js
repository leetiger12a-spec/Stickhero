// 치명타 강조 (Build 109): 치명타는 노란 큰 숫자(24) + 튀어나오기 + 반짝, 보통 피해는 흰 14
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.weapons = {}; G.p.meleeCd = 99; G.texts = [];
    const e = makeEnemy('tank', 60, 60); e.hp = e.maxHp = 1e9; G.enemies.push(e); const rnd = Math.random;
    Math.random = () => 0.01; hurtEnemy(e, 10, 0, 0, 0); Math.random = () => 0.9; hurtEnemy(e, 10, 0, 0, 0); Math.random = rnd;
    return G.texts.map(t => ({ text: t.text, size: t.size, color: t.color, crit: !!t.crit, pop: t.pop > 0 })); });
  console.log(JSON.stringify(r));
  const c = r.find(t => t.crit), n = r.find(t => !t.crit && /^\d+$/.test(t.text));
  check(c && c.size === 24 && c.color === '#ffd23f' && c.pop && c.text.endsWith('!'), 'crit text wrong'); check(n && n.size === 14 && n.color === '#fff', 'normal text wrong');
  check(r.some(t => t.text === '치명타!'), 'no 치명타 label (random 0.01 < 0.35)');
  await page.evaluate(() => { const G = SH.G, e = G.enemies[0]; for (let i = 0; i < 12; i++) hurtEnemy(e, 10, 0, 0, 0); }); await page.waitForTimeout(60);
  await page.screenshot({ path: `${OUT}/b109_crit.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
