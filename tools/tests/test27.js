// 무기 진화: Lv5 + 짝 능력 → 진화 카드(금빛) → 진화 무기 6종이 실제로 동작, 힌트·아이콘·저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 4).join(' | '))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.camps.forEach(c => c.spawnT = 999); G.enemies = G.enemies.filter(e => e.camp); G.p.x = 0; G.p.y = 400; });
  // 힌트: Lv4 → 5 카드에 진화 조건
  const hint = await page.evaluate(() => { const G = SH.G; G.weapons = { pistol: 4 }; G.passives = {}; for (let i = 0; i < 20; i++) { G.pending = 1; openLevelUp(); const t = document.getElementById('cards').textContent; if (t.includes('개틀링')) return t; SH.G.pending = 0; state = 'play'; } return ''; });
  check(hint.includes('번개 손'), 'evolve hint missing');
  // 진화 카드
  await page.evaluate(() => { const G = SH.G; state = 'play'; showOv(null); G.weapons = { pistol: 5 }; G.passives = { haste: 1 }; G.pending = 1; openLevelUp(); });
  const card = await page.evaluate(() => ({ first: choices[0], evoCls: document.querySelector('.card.evo') !== null }));
  console.log('card', JSON.stringify(card)); check(card.first.kind === 'evo' && card.first.id === 'pistol' && card.evoCls, 'evolve card missing');
  await page.screenshot({ path: `${OUT}/b49_card.png` });
  await page.evaluate(() => SH.choose(0));
  check(await page.evaluate(() => SH.G.weapons.pistol === 6 && wStat('pistol').cd < 0.2), 'pistol not evolved');
  // 6종 모두 진화시켜 동작 확인
  await page.evaluate(() => { const G = SH.G; G.weapons = { sword: 6, pistol: 6, shotgun: 6, boomerang: 6, bolt: 6, hammer: 6 }; G.timers = {}; G.p.hp = G.p.maxHp = 1e6;
    for (let i = 0; i < 40; i++) { const a = Math.random() * 7, r = 60 + Math.random() * 200; const e = makeEnemy('tank', G.p.x + Math.cos(a) * r, G.p.y + Math.sin(a) * r); e.hp = e.maxHp = 1e6; G.enemies.push(e); } });
  let seen = { flames: 0, big: 0, sky: 0, flameShot: 0, swords: 0 };
  for (let i = 0; i < 25; i++) { await page.waitForTimeout(100);
    const r = await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); const G = SH.G; return { flames: G.pflames.length, big: G.booms.filter(b => b.big).length, sky: G.zaps.filter(z => z.pts[0][1] < SH.G.p.y - 250).length, flameShot: G.bullets.filter(b => b.kind === 'flame').length, swords: wStat('sword').n }; });
    for (const k in seen) seen[k] = Math.max(seen[k], r[k]);
    if (i === 12) await page.screenshot({ path: `${OUT}/b49_evolved.png` }); }
  console.log('evolved', JSON.stringify(seen)); check(seen.flames > 0 && seen.big >= 3 && seen.sky > 0 && seen.flameShot > 0 && seen.swords === 8, 'evolved weapons not working');
  // 불길은 영웅을 다치게 하지 않음
  const hp = await page.evaluate(() => { const G = SH.G; G.enemies = G.enemies.filter(e => e.camp); G.p.hp = 500; G.p.maxHp = 1000; addFlame(G.p.x, G.p.y, 60, 2); return G.p.hp; });
  await page.waitForTimeout(800); check(await page.evaluate(h => SH.G.p.hp >= h, hp), 'flame hurt hero');
  // 저장 → 이어하기, 업적
  await page.evaluate(() => saveGame()); await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(1300);
  check(await page.evaluate(() => SH.G.weapons.hammer === 6 && evolved('hammer')), 'evolved not saved');
  check(await page.evaluate(() => !!JSON.parse(localStorage.getItem('stickhero_meta')).ach.evo1), 'evo achievement missing');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
