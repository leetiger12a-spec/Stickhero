// 치트 없는 자동 플레이 봇: 키보드 입력(keys)만 조작, 레벨업 카드는 무작위 선택
// 사용: node tools/bot.js [판 수] [분] — 결과·사건 기록 출력 (음악까지 쓰려면 http로 열 것)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const RUNS = +process.argv[2] || 4, MINUTES = +process.argv[3] || 15, STYLE = process.argv[4] || 'normal';
(async () => {
  const browser = await chromium.launch();
  { const _nc = browser.newContext.bind(browser); browser.newContext = async o => { const c = await _nc(o); await c.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} }); return c; }; } const results = []; const errors = [];
  for (let run = 0; run < RUNS; run++) {
    const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    page.on('pageerror', e => errors.push(`run${run}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`run${run}: ${m.text()}`); });
    await page.goto('file:///home/user/Stickhero/index.html');
    await page.click('#bStart');
    const r = await page.evaluate(([MINUTES, STYLE]) => {
      const log = [], ev = (t) => log.push(`${Math.floor(SH.G.t / 60)}:${String(Math.floor(SH.G.t % 60)).padStart(2, '0')} ${t}`);
      const G = () => SH.G; const st = { firstTower: null, stages: 0, retreats: 0, deaths: 0, raidsWon: 0, minBase: 1e9, bossKills: 0, lastStage: 0, lastRaidCount: 0 };
      const setDir = (dx, dy) => { for (const k of ['w', 'a', 's', 'd']) keys[k] = false; const l = Math.hypot(dx, dy); if (l < 6) return; const a = Math.atan2(dy, dx);
        if (Math.cos(a) > 0.38) keys.d = true; if (Math.cos(a) < -0.38) keys.a = true; if (Math.sin(a) > 0.38) keys.s = true; if (Math.sin(a) < -0.38) keys.w = true; };
      const near = (arr, x, y) => { let b = null, bd = 1e12; for (const o of arr) { const d = (o.x - x) ** 2 + (o.y - y) ** 2; if (d < bd) { bd = d; b = o; } } return b; };
      let prevDead = false, prevMode = 'base', prevBossK = 0, prevRaid = false, steps = MINUTES * 60 * 30;
      for (let i = 0; i < steps; i++) {
        if (SH.state === 'levelup') SH.choose(Math.floor(Math.random() * 3));
        if (SH.state === 'result') SH.ok(); if (SH.state === 'map') document.getElementById('bGo').click();
        if (SH.state === 'allypick') SH.chooseAlly(Math.floor(Math.random() * 2));
        if (SH.state === 'over') { ev('게임오버 (' + (G().baseDead ? '마을 붕괴' : '?') + ')'); break; }
        const g = G(), p = g.p;
        if (i % 3 === 0 && !p.dead) {
          const foe = near(g.enemies, p.x, p.y), fd = foe ? Math.hypot(foe.x - p.x, foe.y - p.y) : 1e9;
          let tx = p.x, ty = p.y;
          const lowHp = p.hp < p.maxHp * 0.35;
          if (g.mode === 'stage') {
            const cg = g.st && g.st.cages.find(c => !c.freed);
            if (g.st && g.st.portal) { tx = g.st.portal.x; ty = g.st.portal.y; }
            else if (cg && p.y < cg.y + 600) { tx = cg.x; ty = cg.y + 8; }
            else if (g.st && g.st.def.goal === 'survive') { tx = 0; ty = p.y; }
            else { tx = 0; ty = p.y - 120; }
            if (foe && fd < (foe.boss ? 150 : 55) && !(cg && Math.hypot(cg.x - p.x, cg.y - p.y) < 40)) { tx = p.x - (foe.x - p.x); ty = p.y - (foe.y - p.y); }   // 너무 가까우면 피하기
          } else {
            const threat = g.enemies.filter(e => Math.hypot(e.x, e.y) < 330);
            const pads = g.pads.map(q => ({ q, c: padCost(q) })).filter(o => o.c && p.logs >= Math.min(o.c.w - o.q.pw, p.logs) && (o.c.w - o.q.pw <= p.logs || p.logs >= p.cap) && (o.c.g - o.q.pg <= g.gold || o.c.g === 0) && (o.c.w > 0 || o.c.g > 0) && !(o.c.w - o.q.pw > 0 && p.logs === 0));
            if (threat.length && !lowHp) { const t = near(threat, p.x, p.y); tx = t.x; ty = t.y; if (Math.hypot(t.x - p.x, t.y - p.y) < 60) { tx = p.x - (t.x - p.x); ty = p.y - (t.y - p.y); } }
            else if (lowHp) { tx = 0; ty = 60; }
            else if (pads.length) { const o = pads[0]; tx = o.q.x; ty = o.q.y + padOY(o.q); }
            else if (p.logs < p.cap && STYLE !== 'fighter') { const t = near(g.trees.filter(t => t.logs > 0), p.x, p.y); if (t) { tx = t.x - 20; ty = t.y; } }
            else if (g.gateOpen && !g.boss && !g.raid && !(g.raidIn > 0) && g.base.hp > g.base.maxHp * 0.5) { tx = GATE.x; ty = GATE.y; }
            else { tx = 0; ty = 60; }
            if (foe && fd < 40 && !threat.length) { tx = p.x - (foe.x - p.x); ty = p.y - (foe.y - p.y); }
          }
          setDir(tx - p.x, ty - p.y);
        }
        update(1 / 30);
        // 기록
        const g2 = G(), p2 = g2.p;
        if (st.firstTower === null && g2.towers[0].lvl) { st.firstTower = Math.round(g2.t); ev('첫 망루 완성'); }
        if (p2.dead && !prevDead) { st.deaths++; ev('영웅 쓰러짐' + (g2.mode === 'stage' ? ' (스테이지 ' + (g2.stageN + 1) + ')' : ' (마을)')); }
        prevDead = p2.dead;
        if (g2.mode !== prevMode) { ev(g2.mode === 'stage' ? `출격 → 스테이지 ${g2.stageN + 1}` : '귀환'); prevMode = g2.mode; }
        if (g2.stageN > st.lastStage) { st.stages = g2.stageN; st.lastStage = g2.stageN; ev(`스테이지 ${g2.stageN} 클리어`); }
        if (!!g2.raid !== prevRaid) { ev(g2.raid ? '대습격 시작' : '대습격 끝(방어 성공)'); if (!g2.raid) st.raidsWon++; prevRaid = !!g2.raid; }
        if ((g2.bossKills || 0) > prevBossK) { prevBossK = g2.bossKills; ev('보스 처치'); }
        if (g2.mode === 'base') st.minBase = Math.min(st.minBase, g2.base.hp);
        if (i % 900 === 0 && g2.mode === 'base') { const inside = g2.enemies.filter(e => Math.hypot(e.x, e.y) < WALL_R).length, broken = g2.walls.filter(w => w.hp <= 0).length;
          ev(`[상태] 마을 ${Math.round(g2.base.hp)} · 적 ${g2.enemies.length}(안 ${inside}) · 부서진 울타리 ${broken}/16 · 망루 ${g2.towers.map(t => t.lvl).join('')} · 🪵${p2.logs} 🪙${g2.gold} · 영웅Lv ${g2.lvl}`); }
      }
      const g = G();
      return { log, t: Math.round(g.t), state: SH.state, lvl: g.lvl, kills: g.kills, gold: g.gold, base: Math.round(g.base.hp), minBase: Math.round(st.minBase), firstTower: st.firstTower, stages: st.stages, deaths: st.deaths, raidsWon: st.raidsWon, bosses: g.bossKills || 0, towers: g.towers.map(t => t.lvl).join(''), wall: g.wallLvl, forge: g.forge, smith: g.smith, weapons: JSON.stringify(g.weapons) };
    }, [MINUTES, STYLE]);
    results.push(r);
    await page.close();
  }
  await browser.close();
  results.forEach((r, i) => { console.log(`\n=== RUN ${i + 1} ===`); console.log(JSON.stringify({ ...r, log: undefined })); console.log(r.log.join('\n')); });
  console.log('\nERRORS:', errors.length); errors.slice(0, 10).forEach(e => console.log(e));
})();
