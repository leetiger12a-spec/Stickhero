// 펫 2마리 (Build 151): 별 40개면 두 번째 펫 칸, 첫 펫과 같은 펫은 못 고름, 둘 다 따라다니고(양쪽), 둘 다 도와주고 경험치를 받음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const setStars = n => page.evaluate(n => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.bestStars = n; localStorage.setItem('stickhero_meta', JSON.stringify(m)); }, n);
  await setStars(30); await page.click('#bWard'); await page.waitForTimeout(150);
  check(await page.evaluate(() => [...document.querySelectorAll('#pet2Grid .sw')].every(x => x.classList.contains('lock')) && $('pet2H').textContent.includes('40')), 'pet2 open too early');
  await setStars(45); await page.evaluate(() => renderWard()); await page.click('#petGrid .sw[data-i="4"]'); await page.waitForTimeout(80);
  await page.click('#pet2Grid .sw[data-i="4"]'); check(await page.evaluate(() => pet2Sel === 0), 'same pet twice');
  await page.click('#pet2Grid .sw[data-i="3"]'); await page.waitForTimeout(80); check(await page.evaluate(() => pet2Sel === 3 && localStorage.getItem('stickhero_pet2') === '3'), 'pet2 not saved');
  await page.screenshot({ path: `${OUT}/b151_ward.png` });
  await page.click('#bWardOk'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; G.p.x = 0; G.p.y = 120; G.p.face = 1; });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(async () => { const G = SH.G, p = G.p; const sides = [Math.sign(G.pet.x - p.x), Math.sign(G.pet2.x - p.x)];
    p.hp = p.maxHp - 100; G.pet2.cd = 0; const h0 = p.hp; await new Promise(q => setTimeout(q, 150)); const heal = p.hp - h0;
    const x0 = [(ST.petXp || {}).dragon || 0, (ST.petXp || {}).chick || 0]; const e = makeEnemy('grunt', 600, 600); G.enemies.push(e); killEnemy(e); G.gems = []; G.coins = [];
    return { sides, heal, xp: [(ST.petXp.dragon || 0) - x0[0], (ST.petXp.chick || 0) - x0[1]] }; });
  console.log(JSON.stringify(r)); check(r.sides[0] !== r.sides[1], 'pets on same side'); check(r.heal >= 2, 'pet2 (chick) did not heal'); check(r.xp.join() === '1,1', 'both pets xp');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.p.x; G.cam.y = G.p.y; }); await page.waitForTimeout(100); await page.screenshot({ path: `${OUT}/b151_pets.png`, clip: { x: 105, y: 350, width: 180, height: 120 } });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
