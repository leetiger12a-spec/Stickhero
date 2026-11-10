// 마지막 보스 2단계 (Build 88): 체력 0 → 진짜 모습(체력 50%, 1.8초 동안 무적, 빨라짐) → 다시 0이면 진짜로 쓰러짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const a = await page.evaluate(() => { const G = SH.G; G.stageN = 9; enterStage(9); G.intro = null; G.st.groups.forEach(g => g.done = true); G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.p.y = -G.st.L * 0.5;
    SH.spawnBoss(0, G.p.y - 200); SH.skipIntro(); const e = G.boss, sp0 = e.spd; e.x = G.p.x; e.y = G.p.y - 170;   /* SH.spawnBoss는 위치를 무시함 → 영웅 앞으로 */ hurtEnemy(e, 1e9, 0, 1, 0);
    const r = { name: e.name, dead: !!e.dead, phase2: !!e.phase2, hpPct: Math.round(e.hp / e.maxHp * 100), trans: e.transT > 0, faster: e.spd > sp0, boss: G.boss === e };
    const hp1 = e.hp; hurtEnemy(e, 1e9, 0, 1, 0); r.immune = e.hp === hp1 && !e.dead; return r; });
  console.log('after first KO', JSON.stringify(a));
  check(a.name === '왕관 괴물 대왕' && !a.dead && a.phase2 && a.hpPct === 50 && a.trans && a.faster && a.boss && a.immune, 'final boss did not transform');
  await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/b88_transform.png` });
  await page.waitForTimeout(1600);
  const b2 = await page.evaluate(() => { const G = SH.G, e = G.boss; const moving = e.transT <= 0; hurtEnemy(e, 1e9, 0, 1, 0); return { moving, dead: !!e.dead, boss: !!G.boss, clear: !!(G.st && G.st.clear) }; });
  console.log('after second KO', JSON.stringify(b2)); check(b2.moving && b2.dead && !b2.boss && b2.clear, 'final boss did not die on phase 2');
  // 다른 보스는 변신 안 함
  const o = await page.evaluate(() => { const G = SH.G; returnBase(false); window.__bossN = 5; SH.spawnBoss(0, 150); SH.skipIntro(); delete window.__bossN; const e = G.boss; hurtEnemy(e, 1e9, 0, 1, 0); return { dead: !!e.dead, p2: !!e.phase2 }; });
  console.log('skeleton king', JSON.stringify(o)); check(o.dead && !o.p2, 'normal boss transformed');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
