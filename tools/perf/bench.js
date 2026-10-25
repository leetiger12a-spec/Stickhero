// 성능 측정: 적 N마리(일반+특수 섞어서) + 보스 + 적 진지, 휴대폰 화면(390×844, 2배)에서 4초 동안 프레임·update·render 시간
// 사용: node tools/perf/bench.js [라벨]   (http://localhost:8765 필요)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const label = process.argv[2] || '';
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: +(process.env.DSF || 2) });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  // update·render 시간 재기
  await page.evaluate(() => {
    window.__t = { u: 0, r: 0, n: 0 };
    const U = update, R = render;
    window.update = function (dt) { const t = performance.now(); U(dt); __t.u += performance.now() - t; };
    window.render = function () { const t = performance.now(); R(); __t.r += performance.now() - t; __t.n++; };
  });
  const out = [];
  for (const N of [100, 200, 300]) {
    await page.evaluate(N => {
      const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.base.hp = G.base.maxHp = 1e9;
      G.enemies = G.enemies.filter(e => e.camp); G.weapons = { pistol: 5, sword: 5, shotgun: 3, boomerang: 3 }; G.towers.slice(0, 4).forEach(t => t.lvl = 5);
      const types = ['grunt', 'runner', 'tank', 'e_archer', 'e_bomber', 'e_bat', 'e_slime', 'e_shaman', 'e_charger'];
      for (let i = 0; i < N; i++) { const a = Math.random() * 7, r = 180 + Math.random() * 260; const e = makeEnemy(types[i % types.length], Math.cos(a) * r, Math.sin(a) * r); e.hp = e.maxHp = 1e7; G.enemies.push(e); }
      if (!G.boss) { G.bossCount = 4; spawnBoss(250, 250); endIntro(); G.boss.hp = G.boss.maxHp = 1e9; }
      G.p.x = 0; G.p.y = 200;
    }, N);
    await page.waitForTimeout(500);
    await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); SH.G.pending = 0; SH.G.xp = 0; });
    const r = await page.evaluate(() => new Promise(res => { __t = { u: 0, r: 0, n: 0 }; let f = 0; const t0 = performance.now();
      const tick = () => { f++; if (performance.now() - t0 < 4000) requestAnimationFrame(tick); else res({ fps: f / ((performance.now() - t0) / 1000), u: __t.u / __t.n, r: __t.r / __t.n, en: SH.G.enemies.length, parts: SH.G.parts.length, bul: SH.G.bullets.length + SH.G.ebullets.length, st: SH.state, dpr: DPR }); };
      requestAnimationFrame(tick); }));
    out.push({ N, fps: +r.fps.toFixed(1), updateMs: +r.u.toFixed(2), renderMs: +r.r.toFixed(2), enemies: r.en, parts: r.parts, bullets: r.bul, state: r.st, dpr: r.dpr });
  }
  console.log(label, JSON.stringify(out, null, 0)); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e));
  await b.close();
})();
