// 꼬마 골렘 동료 (Build 92, 아들 생각): 모험 8칸에서 열림, 영웅 숙소 고용, 땅 쾅(주변 밀어냄), 덜 아픔, Lv3 도발, 그림 3종
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const lk = await page.evaluate(() => { const a = isUnlocked('a', 'golem'); const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.maxStage = 8; localStorage.setItem('stickhero_meta', JSON.stringify(m)); return [a, isUnlocked('a', 'golem')]; });
  console.log('unlock', lk.join()); check(lk.join() === 'false,true', 'golem unlock wrong');
  const img = await page.evaluate(() => ['ally_golem', 'ally_golem_walk', 'ally_golem_slam'].filter(n => SPR[n]).length); check(img === 3, 'golem pictures not loaded: ' + img);
  // 고용 카드에 골렘
  const cards = await page.evaluate(() => { openAllyPick(); const t = [...document.querySelectorAll('#cards .card .nm')].map(e => e.textContent); return t; });
  console.log('hire cards', cards.join(' | ')); check(cards.some(t => t.includes('꼬마 골렘')), 'golem not in hire cards');
  const gi = cards.findIndex(t => t.includes('꼬마 골렘'));
  await page.evaluate(i => SH.chooseAlly(i), gi); await page.waitForTimeout(300);
  const a0 = await page.evaluate(() => { const a = SH.G.allies.find(a => a.type === 'golem'); return a && { hp: a.maxHp, lvl: a.lvl }; });
  console.log('golem', JSON.stringify(a0)); check(a0 && a0.hp === 420, 'golem not hired');
  // 땅 쾅: 옆 적 여러 마리가 맞고 밀려남
  const sl = await page.evaluate(async () => { const G = SH.G, p = G.p, a = G.allies.find(a => a.type === 'golem'); G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.weapons = {}; p.meleeCd = 99; p.x = 0; p.y = 300; a.x = 30; a.y = 300; a.cd = 0;
    G.enemies = []; const es = [[70, 300], [60, 330], [60, 270]].map(([x, y]) => { const e = makeEnemy('tank', x, y); e.hp = e.maxHp = 5000; e.spd = 0; G.enemies.push(e); return e; });
    let acted = false; for (let i = 0; i < 15; i++) { await new Promise(r => setTimeout(r, 60)); if (a.act === 'slam') acted = true; }
    return { acted, hurt: es.filter(e => e.hp < e.maxHp).length }; });
  console.log('slam', JSON.stringify(sl)); check(sl.acted && sl.hurt >= 2, 'golem slam did not hit several');
  await page.screenshot({ path: `${OUT}/b92_slam.png` });
  // 덜 아픔: 같은 적에게 방패병 0.5, 골렘 0.4
  const dm = await page.evaluate(async () => { const G = SH.G, a = G.allies.find(a => a.type === 'golem'); G.enemies = []; a.inv = 0; a.hp = a.maxHp; const e = makeEnemy('grunt', a.x, a.y); e.dmg = 100; e.spd = 0; G.enemies.push(e);
    await new Promise(r => setTimeout(r, 120)); const lost = a.maxHp - a.hp; G.enemies = []; return lost; });
  console.log('golem took', dm); check(dm === 40, 'golem damage reduction wrong');
  // Lv3 도발: 골렘 근처 적은 영웅 대신 골렘 쪽으로
  const tt = await page.evaluate(async () => { const G = SH.G, p = G.p, a = G.allies.find(a => a.type === 'golem'); a.lvl = 3; a.dead = false; p.x = 0; p.y = 300;
    a.x = 300; a.y = 300; G.allies.forEach(o => o.cd = 99); const e = makeEnemy('grunt', 300, 200); e.hp = e.maxHp = 1e6; G.enemies = [e];
    const t0 = { x: e.x, y: e.y }; a.frozen = true; const hold = setInterval(() => { a.x = 300; a.y = 300; }, 5);
    await new Promise(r => setTimeout(r, 700)); clearInterval(hold);
    const toG = Math.hypot(a.x - e.x, a.y - e.y) < Math.hypot(a.x - t0.x, a.y - t0.y), toHeroX = e.x < t0.x - 20; return { toG, toHeroX, ex: Math.round(e.x), ey: Math.round(e.y) }; });
  console.log('taunt', JSON.stringify(tt)); check(tt.toG && !tt.toHeroX, 'taunt not working');
  // 도감 동료 5종
  const ad = await page.evaluate(() => { dexBack = 'paused'; renderDex(); return document.querySelectorAll('#dexList .dex.ally').length; }); check(ad === 5, 'ally dex not 5');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
