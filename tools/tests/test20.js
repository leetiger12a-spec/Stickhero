// 마을 영구 보존: 마을이 무너져도 건물은 부서진 채로 남음 → 다음 날(적 +15%) → 수리
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  // 키운 마을 만들기: 망루 4, 대장간, 숙소, 마을 Lv2, 농장, 광산, 스테이지 2, 동료 1
  await page.evaluate(() => { const G = SH.G;
    G.towers.slice(0, 4).forEach(t => t.lvl = 3); G.pads.forEach(q => { if (q.kind === 'tower' && q.idx < 4 || ['wall', 'smith', 'tavern'].includes(q.kind)) q.built = true; });
    G.smith = true; G.forge = 2; G.tavern = true; hallUp(); G.bld.farm = 1; G.bld.mine = 2; G.stageN = 2; G.stars = [3, 2];
    G.allies.push({ type: 'archer', slot: 0, x: 0, y: 0, hp: 80, maxHp: 80, cd: 0, inv: 0, face: 1, wob: 0, swing: 0, dead: false, reviveT: 0 });
    G.lvl = 12; G.weapons = { pistol: 4, sword: 3 }; G.gold = 400; G.stone = 30; G.p.logs = 9; });
  const e1 = await page.evaluate(() => makeEnemy('grunt', 500, 0).maxHp);
  await page.evaluate(() => SH.killBase()); await page.waitForTimeout(2800);
  const ov = await page.evaluate(() => ({ st: SH.state, btn: document.getElementById('bRetry').textContent, msg: document.getElementById('overRec').textContent, save: JSON.parse(localStorage.getItem('stickhero_save')) }));
  console.log('over', ov.st, ov.btn, '|', ov.msg); check(ov.st === 'over' && ov.btn.includes('2일째') && ov.save && ov.save.day === 2, 'ruin save missing');
  await page.screenshot({ path: `${OUT}/b41_over.png` });
  // 다시 세우기
  await page.click('#bRetry'); await page.waitForTimeout(500);
  const d2 = await page.evaluate(() => { const G = SH.G; return { day: G.day, vLvl: G.vLvl, towers: G.towers.map(t => t.lvl).join(''), broken: Object.keys(G.broken).filter(k => G.broken[k]).sort().join(','), lvl: G.lvl, weapons: JSON.stringify(G.weapons), gold: G.gold, stone: G.stone, stageN: G.stageN, allies: G.allies.length, base: G.base.hp, max: G.base.maxHp, bld: JSON.stringify(G.bld), forge: G.forge }; });
  console.log('day2', JSON.stringify(d2));
  check(d2.day === 2 && d2.vLvl === 2 && d2.towers === '333300' && d2.broken === 'farm,hall,mine,smith,t0,t1,t2,t3,tavern' && d2.lvl === 1 && d2.weapons === '{"pistol":1}' && d2.gold === 200 && d2.stone === 30 && d2.stageN === 2 && d2.allies === 1 && d2.base === 600 && d2.forge === 2, 'day2 state wrong');
  const e2 = await page.evaluate(() => makeEnemy('grunt', 500, 0).maxHp); console.log('enemy hp', e1, e2); check(Math.abs(e2 / e1 - 1.25) < 0.02, 'day multiplier wrong');
  await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/b41_ruin.png` });
  // 부서진 망루는 안 쏨
  const shots = await page.evaluate(() => { const G = SH.G; G.enemies.push(makeEnemy('grunt', 90, 120)); G.bullets.length = 0; return 0; });
  await page.waitForTimeout(600);
  check(await page.evaluate(() => !SH.G.bullets.some(b => b.tower)), 'broken tower shot');
  // 회관 수리
  const stand = async (pred) => { for (let i = 0; i < 80; i++) { const done = await page.evaluate(pred => { const G = SH.G, q = G.pads.find(new Function('q', 'return ' + pred)), k = brokenKey(q);
      if (!G.broken[k]) return true; G.p.x = q.x; G.p.y = q.y + padOY(q); G.p.logs = G.p.cap; G.gold = Math.max(G.gold, 500); return false; }, pred); if (done) return; await page.waitForTimeout(100); } errors.push('repair timeout ' + pred); };
  await stand("q.kind === 'hall'");
  check(await page.evaluate(() => SH.G.base.hp === SH.G.base.maxHp && !SH.G.broken.hall), 'hall repair failed');
  await stand("q.kind === 'tower' && q.idx === 0");
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 92; SH.G.enemies.push(makeEnemy('grunt', 150, 150)); }); await page.waitForTimeout(1500);
  check(await page.evaluate(() => SH.G.kills > 0 || SH.G.bullets.some(b => b.tower)), 'repaired tower not shooting');
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 40; SH.G.cam.y = 20; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b41_repaired.png` });
  // 저장 유지
  await page.evaluate(() => saveGame()); await page.reload(); await page.waitForTimeout(500);
  check(await page.evaluate(() => document.getElementById('bContinue').style.display !== 'none'), 'continue missing');
  await page.click('#bContinue'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.day === 2 && !SH.G.broken.hall && !SH.G.broken.t0 && SH.G.broken.t1), 'broken state not saved');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
