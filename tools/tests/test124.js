// 🌀 환생 (Build 171): Lv 100이면 일시정지에 버튼, 환생하면 Lv1·무기 처음, 금화·마을 그대로, 공격·체력 +10%, 머리 위 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; });
  await page.click('#bPause'); await page.waitForTimeout(200);
  check(await page.evaluate(() => $('bReborn').style.display === 'none'), 'no reborn before 100');
  await page.click('#bResume'); await page.waitForTimeout(200);
  const before = await page.evaluate(() => { const G = SH.G; G.lvl = 100; G.weapons = { pistol: 8, sword: 5 }; G.passives = { power: 3 }; G.gold = 777; recalcStats(); return { dmg: G.p.dmgMul, hp: G.p.maxHp }; });
  await page.click('#bPause'); await page.waitForTimeout(200);
  check(await page.evaluate(() => $('bReborn').style.display === ''), 'reborn button shown');
  await page.screenshot({ path: `${OUT}/b171_pause.png` });
  await page.click('#bReborn'); await page.waitForTimeout(500);
  const r = await page.evaluate(() => { const G = SH.G; return { lvl: G.lvl, w: Object.keys(G.weapons).join(), pas: Object.keys(G.passives).length, gold: G.gold, dmg: G.p.dmgMul, hp: G.p.maxHp, hpNow: G.p.hp, st: SH.state, n: JSON.parse(localStorage.getItem('stickhero_meta')).reborn, ult: G.ult }; });
  console.log(JSON.stringify(r));
  check(r.lvl === 1 && r.w === 'pistol' && r.pas === 0 && r.gold === 777 && r.st === 'play' && r.n === 1 && r.ult === 100, 'reset ok');
  check(Math.abs(r.dmg - 1.1) < 0.001 && r.hp === 110 && r.hpNow === 110, 'bonus +10%');
  // 적 세기: 환생 1번 = 레벨 +10 (Lv 25 + 10 = 35 → 5 넘음)
  const k = await page.evaluate(() => { SH.G.lvl = 25; return lvlScale().hp; });
  check(Math.abs(k - 1.125) < 0.001, 'enemy scale with reborn ' + k);
  await page.evaluate(() => { SH.G.lvl = 1; }); await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/b171_hero.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
