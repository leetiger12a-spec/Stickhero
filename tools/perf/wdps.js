// 무기 세기 재기: 무기 하나만 들고 가만히 선 적 무리(가까이~멀리 고리 4개)에게 N초 동안 준 피해 → 초당 피해(DPS)
// 적은 밀쳐내도 제자리로 돌려놓음 (밀치기 무기가 손해 보지 않게)
// 사용: node tools/perf/wdps.js [초=8] [적 수=24]   (http://localhost:8765 필요, 숲 스테이지에서 잼, 능력·영구 강화 없음)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SEC = +process.argv[2] || 8, NF = +process.argv[3] || 24;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const ids = await page.evaluate(() => Object.keys(WEAP)), out = [];
  for (const id of ids) for (const lv of [5, 6]) {
    const r = await page.evaluate(async ([id, lv, SEC, NF]) => {
      const G = SH.G; enterStage(0); G.intro = null; G.st.groups.forEach(g => g.done = true);
      G.weapons = { [id]: lv }; G.timers = {}; G.passives = {}; recalcStats(); G.p.hp = G.p.maxHp = 1e9; G.p.inv = 0; G.p.y = -G.st.L * 0.4; G.p.x = 0; G.allies = [];
      G.enemies = []; G.bullets = []; G.booms = []; G.pflames = [];
      const ring = [100, 160, 220, 300];
      for (let k = 0; k < NF; k++) { const R = ring[k % 4], a = k / NF * Math.PI * 2 + (k % 4) * 0.4;
        const e = makeEnemy('tank', G.p.x + Math.cos(a) * R, G.p.y + Math.sin(a) * R); e.hp = e.maxHp = 1e9; e.spd = 0; e.dmg = 0; e.hx0 = e.x; e.hy0 = e.y; G.enemies.push(e); }
      const pin = setInterval(() => { for (const e of G.enemies) { e.x = e.hx0; e.y = e.hy0; e.kx = e.ky = 0; } }, 8);   // 밀려나도 제자리 (계속 몰려오는 상황)
      const t0 = G.t; await new Promise(r => setTimeout(r, SEC * 1000)); clearInterval(pin);
      const dt = G.t - t0, dmg = G.enemies.reduce((s, e) => s + (e.maxHp - e.hp), 0), hit = G.enemies.filter(e => e.hp < e.maxHp).length;
      return { dps: Math.round(dmg / dt), hit };
    }, [id, lv, SEC, NF]);
    out.push({ id, lv, ...r }); console.log(id.padEnd(10), 'Lv' + lv, String(r.dps).padStart(6), 'dps  맞은 적', r.hit + '/' + NF);
  }
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close();
})();
