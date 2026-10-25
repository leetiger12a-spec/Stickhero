// 동료 성장: 경험치 → Lv5, Lv3 특기(회전 베기·화살 3발·두 번 펑·방패 −25%), 숙소 훈련, 마을 Lv3 동료 5명, 저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.camps.forEach(c => c.spawnT = 999); G.enemies = G.enemies.filter(e => e.camp);
    G.pads.forEach(q => { if (q.kind === 'tower' && q.idx < 4 || ['wall', 'smith'].includes(q.kind)) q.built = true; }); G.smith = true;
    G.tavern = true; ['sword', 'archer', 'bomber', 'shield'].forEach(t => G.allies.push(makeAlly(t))); G.p.hp = G.p.maxHp = 1e5; placeAllies(); });
  // 경험치 → 레벨업
  const lv = await page.evaluate(() => { const G = SH.G, a = G.allies[0]; for (let i = 0; i < 70; i++) { const e = makeEnemy('grunt', a.x + 20, a.y); G.enemies.push(e); hurtEnemy(e, 1e6, 1, 0, 0); } return G.allies.map(a => a.lvl); });
  console.log('levels after 70 kills', lv.join()); check(lv.every(l => l >= 2), 'allies did not level from xp');
  const hp = await page.evaluate(() => { const a = SH.G.allies[0]; return [a.maxHp, ALLY_TYPES.sword.hp]; }); check(hp[0] > hp[1], 'ally hp not raised');
  // Lv3 특기
  await page.evaluate(() => SH.G.allies.forEach(a => { while (a.lvl < 3) allyLevelUp(a); }));
  // 궁수 3발
  const arrows = await page.evaluate(async () => { const G = SH.G, a = G.allies[1]; G.bullets.length = 0; G.enemies.push(makeEnemy('tank', a.x + 150, a.y)); a.cd = 0; return 0; });
  let nArrow = 0;
  for (let i = 0; i < 20 && nArrow < 3; i++) { await page.waitForTimeout(80); nArrow = Math.max(nArrow, await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); return SH.G.bullets.filter(b => b.kind === 'arrow' && !b.tower).length; })); } console.log('arrows', nArrow); check(nArrow >= 3, 'archer lv3 not 3 arrows');
  // 방패 −25%
  const guard = await page.evaluate(() => { const G = SH.G, s = G.allies[3]; s.x = G.p.x; s.y = G.p.y; return shieldGuard(G.p.x, G.p.y); }); check(guard === 0.75, 'shield guard missing');
  // 폭탄 두 번
  const twice = await page.evaluate(() => { const G = SH.G; G.bombs = [{ x0: 0, y0: 0, x1: 200, y1: 200, t: 0.59, dur: 0.6, dmg: 10, twice: true }]; return 0; });
  await page.waitForTimeout(150); check(await page.evaluate(() => SH.G.bombs.length >= 1 && !SH.G.bombs[0].twice), 'bomb did not explode twice');
  // 숙소 훈련: 동료 4명 다 찼을 때 → 훈련
  const tr = await page.evaluate(() => { const q = SH.G.pads.find(q => q.kind === 'tavern'); return { lb: padLabel(q), c: padCost(q) }; });
  console.log('tavern', JSON.stringify(tr)); check(tr.lb.includes('훈련') && tr.c.g === 50 + 60 * 3, 'train pad wrong');
  await page.evaluate(() => { const G = SH.G, q = G.pads.find(q => q.kind === 'tavern'); G.gold = 1000; G.p.x = q.x; G.p.y = q.y + padOY(q); });
  for (let i = 0; i < 40 && !(await page.evaluate(() => SH.G.allies.some(a => a.lvl === 4))); i++) await page.waitForTimeout(100);
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 92; });
  const lv2 = await page.evaluate(() => SH.G.allies.map(a => a.lvl).sort().join()); console.log('after train', lv2); check(lv2.includes('4'), 'training did not level');
  // 마을 Lv3 → 5명
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = 92; hallUp(); hallUp(); });
  const tr5 = await page.evaluate(() => { const q = SH.G.pads.find(q => q.kind === 'tavern'); return padLabel(q); }); console.log(tr5); check(tr5.includes('5/5'), 'fifth ally slot missing');
  // Lv5 모습
  await page.evaluate(() => { const G = SH.G; G.allies.forEach(a => { while (a.lvl < 5) allyLevelUp(a); }); G.allies[1].lvl = 3; G.allies[1].xp = 60; G.p.x = 0; G.p.y = 300; G.cam.y = 280; placeAllies(); });
  await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/b43_allies.png` });
  // 저장/이어하기
  const s0 = await page.evaluate(() => { saveGame(); return SH.G.allies.map(a => a.type + a.lvl).join(); });
  await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(300);
  const s1 = await page.evaluate(() => SH.G.allies.map(a => a.type + a.lvl).join()); console.log(s0, '|', s1); check(s0 === s1, 'ally levels not saved');
  // 예전 저장(종류만)도 읽힘
  const old = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('stickhero_save')); d.allies = ['sword', 'archer']; loadGame(d); return SH.G.allies.map(a => a.type + a.lvl).join(); });
  check(old === 'sword1,archer1', 'old save allies not loaded');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
