// 펫 친구 (Build 135): 그림 4개, 별로 잠금, 꾸미기에서 고르면 저장, 게임에서 영웅을 따라다님, 펫마다 도와주기 (강아지 금화·고양이 구슬·병아리 회복·아기 용 불꽃)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  check(await page.evaluate(() => PETS.filter(p => p.id && WICON['pet_' + p.id]).length) === 4, 'pet icons not 4');
  await page.click('#bWard'); await page.waitForTimeout(200);
  check(await page.evaluate(() => { const l = [...document.querySelectorAll('#petGrid .sw')].map(x => x.classList.contains('lock')); return l.length === 5 && !l[0] && l.slice(1).every(Boolean); }), 'lock at 0 stars');
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.bestStars = 45; localStorage.setItem('stickhero_meta', JSON.stringify(m)); renderWard(); });
  await page.click('#petGrid .sw[data-i="1"]'); await page.waitForTimeout(100); check(await page.evaluate(() => petSel === 1 && localStorage.getItem('stickhero_pet') === '1'), 'pet not saved');
  await page.screenshot({ path: `${OUT}/b135_ward.png` });
  await page.click('#bWardOk'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; G.p.magnet = 1; });
  // 따라다님
  const f = await page.evaluate(async () => { const G = SH.G; G.p.x = 300; G.p.y = 300; await new Promise(q => setTimeout(q, 3500)); return Math.hypot(G.pet.x - G.p.x, G.pet.y - G.p.y); }); console.log('pet dist', f.toFixed(0)); check(f < 60, 'pet not following');
  // 강아지: 금화
  const pup = await page.evaluate(async () => { const G = SH.G; G.coins = []; for (let i = 0; i < 4; i++) dropCoin(G.p.x + 200, G.p.y + i * 10); G.coins.forEach(c => { c.z = 0; c.vz = 0; }); G.pet.cd = 0; await new Promise(q => setTimeout(q, 150)); return G.coins.filter(c => c.pull).length; });
  check(pup >= 3, 'puppy did not fetch coins: ' + pup);
  // 고양이: 구슬, 병아리: 회복, 아기 용: 불꽃
  const r = await page.evaluate(async () => { const G = SH.G, out = {};
    petSel = 2; G.pet.cd = 0; G.gems = []; for (let i = 0; i < 4; i++) dropGem(G.p.x + 200, G.p.y + i * 10, 1); await new Promise(q => setTimeout(q, 150)); out.kit = G.gems.filter(g => g.pull).length;
    petSel = 3; G.p.hp = G.p.maxHp - 50; G.pet.cd = 0; const h0 = G.p.hp; await new Promise(q => setTimeout(q, 150)); out.chick = G.p.hp - h0;
    petSel = 4; G.pet.cd = 0; G.bullets = []; const e = makeEnemy('tank', G.p.x + 150, G.p.y); e.spd = 0; e.hp = e.maxHp = 1e6; G.enemies = [e]; await new Promise(q => setTimeout(q, 150)); out.drag = G.bullets.filter(b => b.pet).length;
    G.cam.x = G.p.x; G.cam.y = G.p.y; return out; });
  console.log(JSON.stringify(r)); check(r.kit >= 3 && r.chick === 2 && r.drag === 1, 'pet skills wrong');
  await page.waitForTimeout(200); await page.screenshot({ path: `${OUT}/b135_pet.png`, clip: { x: 95, y: 280, width: 200, height: 220 } });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
