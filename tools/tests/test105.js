// 무기 숙련도 (Build 149): 무기로 쓰러뜨린 적만 무기별로 셈 (영웅 근접·망루는 안 셈), 100·500·2000·5000·10000마리에 ★1~5, 진화 도감에 표시, 저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.need = 1e9; G.p.meleeCd = 99; G.p.x = 0; G.p.y = 300; G.towers.forEach(t => t.lvl = 0); G.allies = []; });
  // 권총만 들고 약한 적 6마리 → 권총 처치 수가 오름
  const r = await page.evaluate(async () => { const G = SH.G; G.weapons = { pistol: 5 }; G.timers = { pistol: 0 }; ST.wk = {};
    for (let i = 0; i < 6; i++) { const e = makeEnemy('grunt', 120 + i * 15, 300); e.hp = e.maxHp = 1; e.spd = 0; G.enemies.push(e); }
    await new Promise(q => setTimeout(q, 2500)); const pk = (ST.wk || {}).pistol || 0;
    G.weapons = { sword: 3 }; G.timers = {}; for (let i = 0; i < 4; i++) { const e = makeEnemy('grunt', 0, 300 - 55); e.hp = e.maxHp = 1; e.spd = 0; G.enemies.push(e); } await new Promise(q => setTimeout(q, 1500));
    const sk = (ST.wk || {}).sword || 0; G.weapons = {}; const e = makeEnemy('grunt', 0, 0); G.enemies.push(e); G.hitSrc = null; hurtEnemy(e, 999, 0, 0, 0);   // 무기 아닌 피해
    return { pk, sk, total: Object.values(ST.wk).reduce((a, v) => a + v, 0) }; });
  console.log(JSON.stringify(r)); check(r.pk >= 5 && r.sk >= 3 && r.total === r.pk + r.sk, 'weapon kills not counted right');
  check(await page.evaluate(() => { ST.wk = { pistol: 2100, ice: 99 }; return wMaster('pistol') === 3 && wMaster('ice') === 0 && wMaster('xbow') === 0; }), 'mastery stars');
  await page.evaluate(() => { checkAch(); togglePause(); openEvo(); }); await page.waitForTimeout(200);
  const t = await page.evaluate(() => [...document.querySelectorAll('.master')].map(e => e.textContent)); console.log(t.slice(0, 3).join(' | '));
  check(t.length === 10 && t.some(x => x.includes('★★★☆☆') && x.includes('2,100')), 'not in evo dex');
  check(await page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')).st || {}).wk.pistol === 2100), 'not saved');
  await page.screenshot({ path: `${OUT}/b149_master.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
