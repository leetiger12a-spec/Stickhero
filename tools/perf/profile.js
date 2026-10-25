// CPU 프로파일: 적 200마리 상황에서 3초 동안 함수별 자기 시간(self time) 상위 25개
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const N = +process.argv[2] || 200;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage();
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(N => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.base.hp = G.base.maxHp = 1e9; G.xp = -1e9;
    G.weapons = { pistol: 5, sword: 5, shotgun: 3, boomerang: 3 }; G.towers.slice(0, 4).forEach(t => t.lvl = 5);
    const types = ['grunt', 'runner', 'tank', 'e_archer', 'e_bomber', 'e_bat', 'e_slime', 'e_shaman', 'e_charger'];
    for (let i = 0; i < N; i++) { const a = Math.random() * 7, r = 180 + Math.random() * 260; const e = makeEnemy(types[i % types.length], Math.cos(a) * r, Math.sin(a) * r); e.hp = e.maxHp = 1e7; G.enemies.push(e); }
    G.bossCount = 4; spawnBoss(250, 250); endIntro(); G.boss.hp = G.boss.maxHp = 1e9; G.p.x = 0; G.p.y = 200;
  }, N);
  await page.waitForTimeout(500);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start');
  await page.waitForTimeout(3000);
  const { profile } = await cdp.send('Profiler.stop');
  const self = {}, dt = {}; const ids = profile.samples, td = profile.timeDeltas;
  const byId = {}; for (const n of profile.nodes) byId[n.id] = n;
  for (let i = 0; i < ids.length; i++) { const n = byId[ids[i]], k = `${n.callFrame.functionName || '(anon)'}:${n.callFrame.lineNumber + 1}`; self[k] = (self[k] || 0) + (td[i] || 0); }
  const tot = Object.values(self).reduce((a, v) => a + v, 0);
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log((v / 1000).toFixed(0).padStart(6) + 'ms ' + (v / tot * 100).toFixed(1).padStart(5) + '%  ' + k));
  await b.close();
})();
