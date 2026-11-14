// 🏆 탑 기록판 + 업적 4개 (Build 172): 특별 층·탑 보물·정예·버스트·환생 기록, 영웅 필살기는 동료 필살기와 따로 셈
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e6; const u0 = ST.ults || 0;
    window.__towerRule = 'wind'; SH.tower(12); G.enemies.length = 0; stageClear(G.p.x, G.p.y);
    SH.tower(20); G.enemies.length = 0; G.boss = null; stageClear(G.p.x, G.p.y);
    G.ult = 100; castUlt();
    return { rule: ST.ruleClears, jack: ST.towerJacks, hero: ST.heroUlts, allyU: (ST.ults || 0) - u0 }; });
  console.log(JSON.stringify(r)); check(r.rule === 1 && r.jack === 1 && r.hero === 1 && r.allyU === 0, 'counters');
  const a = await page.evaluate(() => { ST.ruleClears = 10; ST.elites = 50; const m = JSON.parse(localStorage.getItem('stickhero_meta')) || {}; m.bestFloor = 50; m.reborn = 1; localStorage.setItem('stickhero_meta', JSON.stringify(m)); checkAch();
    const n = JSON.parse(localStorage.getItem('stickhero_meta')).ach; return ['rule10', 'floor50', 'elite50', 'reborn1'].map(k => !!n[k]); });
  check(a.every(Boolean), 'new ach ' + a);
  await page.evaluate(() => { showOv(null); state = 'title'; openStats(); }); await page.waitForTimeout(300);
  const rows = await page.evaluate(() => [...document.querySelectorAll('#statList .st')].map(e => e.textContent));
  check(rows.length === 27 && rows.some(t => t.includes('특별 층') && t.includes('10번')) && rows.some(t => t.includes('환생') && t.includes('1번')), 'stats rows');
  await page.evaluate(() => { const l = document.getElementById('statList'); l.scrollTop = l.scrollHeight; }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b172_stats.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
