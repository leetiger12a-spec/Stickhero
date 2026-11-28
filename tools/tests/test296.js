// Build 398: 🌪 바람 부채 — 회오리가 날아가 적을 끌어당기고 피해, 진화(태풍 부채)는 큰 태풍 3개, 13칸에 열림, 그림 오류 0
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.weapons = { fan: 3 }; G.timers = {};
    const locked = !isUnlocked('w', 'fan');
    const e = makeEnemy('grunt', G.p.x + 160, G.p.y - 20); e.hp = e.maxHp = 1e9; e.spd = 0; e.dmg = 0; G.enemies.push(e); const x0 = e.x;
    await new Promise(q => setTimeout(q, 1400)); const t1 = (G.tornados || []).length, hurt = e.hp < e.maxHp, moved = Math.abs(e.x - x0) > 3;
    G.weapons = { fan: 6 }; G.tornados = []; G.timers = {}; await new Promise(q => setTimeout(q, 300)); const big = G.tornados.filter(t => t.big).length;
    G.cam.x = G.p.x + 80; G.cam.y = G.p.y - 20; return { locked, t1, hurt, moved, big, evo: EVO.fan.need, icon: !!WICON.fan && !!WICON.fan_evo && !!WICON.pj_tornado };
  });
  console.log(JSON.stringify(r));
  check(r.t1 >= 1 && r.hurt && r.moved, 'tornado pulls and hurts'); check(r.big === 3 && r.evo === 'haste', 'typhoon fan evo'); check(r.locked && r.icon, 'unlock at 13 + icons');
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b398_fan.png`, clip: { x: 60, y: 260, width: 300, height: 220 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
