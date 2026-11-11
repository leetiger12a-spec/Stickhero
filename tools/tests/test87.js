// 동료 Lv5 필살기 (Build 129): Lv5 동료는 근처에 적이 있으면 12초마다 필살기, Lv4는 없음, 5종 각각 효과
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9;
    G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; for (const t of ['sword', 'archer', 'bomber', 'shield', 'golem']) hireAlly(t); });
  const types = ['sword', 'archer', 'bomber', 'shield', 'golem'];
  // 직접 필살기: 종류마다 효과 확인
  const r = await page.evaluate(types => { const G = SH.G, out = {};
    for (const t of types) { const a = G.allies.find(x => x.type === t); G.enemies = []; G.bombs = []; for (let i = 0; i < 4; i++) { const e = makeEnemy('tank', a.x + 40 + i * 10, a.y); e.hp = e.maxHp = 1e6; e.spd = 0; G.enemies.push(e); }
      const inv0 = G.p.inv; const ok = allyUlt(a, 1); out[t] = { ok, hurt: G.enemies.filter(e => e.hp < e.maxHp).length, bombs: G.bombs.length, inv: G.p.inv > inv0 + 1, q: (a.queue || []).length }; }
    return out; }, types);
  console.log(JSON.stringify(r));
  check(r.sword.ok && r.sword.hurt >= 3, 'sword ult'); check(r.archer.ok && r.archer.q >= 8, 'archer ult'); check(r.bomber.ok && r.bomber.bombs === 1, 'bomber ult');
  check(r.shield.ok && r.shield.inv, 'shield ult'); check(r.golem.ok && r.golem.hurt >= 3, 'golem ult');
  // 적이 없으면 안 씀
  check(await page.evaluate(() => { SH.G.enemies = []; return allyUlt(SH.G.allies[0], 1) === false; }), 'ult with no enemies');
  // 게임 속: Lv4는 안 쓰고 Lv5는 씀
  const live = await page.evaluate(async () => { const G = SH.G; G.allies.forEach((a, i) => { a.lvl = i === 0 ? 5 : 4; a.ultT = 0.05; a.ults = 0; a.hp = a.maxHp = 1e6; });
    G.enemies = []; for (let i = 0; i < 6; i++) { const e = makeEnemy('tank', G.allies[0].x + 60, G.allies[0].y + i * 10); e.hp = e.maxHp = 1e6; e.spd = 0; G.enemies.push(e); }
    await new Promise(q => setTimeout(q, 400)); return G.allies.map(a => a.ults || 0); });
  console.log('ults by lvl', live.join()); check(live[0] === 1 && live.slice(1).every(v => v === 0), 'lv5 only');
  await page.evaluate(() => { const G = SH.G, a = G.allies[0]; G.cam.x = a.x; G.cam.y = a.y; a.ultT = 0; }); await page.waitForTimeout(120); await page.screenshot({ path: `${OUT}/b129_ult.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
