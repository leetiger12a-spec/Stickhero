// 펫 레벨업 (Build 138): 펫과 함께 적을 잡으면 펫 경험치, 100·300·700·1500마리에 Lv2~5, 알림, 저장, 레벨마다 도와주기가 세짐, 꾸미기에 Lv 표시
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; localStorage.setItem('stickhero_pet', '4'); localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 45 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; G.p.x = 0; G.p.y = 120; });
  await page.waitForTimeout(300);
  const kill = n => page.evaluate(n => { const G = SH.G; for (let i = 0; i < n; i++) { const e = makeEnemy('grunt', 600, 600); G.enemies.push(e); killEnemy(e); } G.gems = []; G.coins = []; G.enemies = []; G.items = []; G.texts = G.texts.filter(t => t.text.includes('Lv')); return [petLv('dragon'), ST.petXp.dragon, G.texts.some(t => t.text.includes('Lv 2'))]; }, n);
  const a = await kill(99); const b2 = await kill(1); console.log(a.join(), '|', b2.join()); check(a[0] === 1 && b2[0] === 2 && b2[2], 'lv2 at 100');
  const c = await kill(1400); console.log(c.join()); check(c[0] === 5, 'lv5 at 1500');
  // 세기: Lv5 아기 용 불꽃이 Lv1보다 셈
  const dmg = await page.evaluate(async () => { const G = SH.G, shoot = async () => { G.bullets = []; G.pet.cd = 0; const e = makeEnemy('tank', G.pet.x + 120, G.pet.y); e.spd = 0; e.hp = e.maxHp = 1e9; G.enemies = [e]; await new Promise(q => setTimeout(q, 120)); const bl = G.bullets.find(b => b.pet); return bl ? bl.dmg : 0; };
    const d5 = await shoot(); const keep = ST.petXp.dragon; ST.petXp.dragon = 0; const d1 = await shoot(); ST.petXp.dragon = keep; return [d1, d5]; });
  console.log('dragon dmg lv1/lv5', dmg.join()); check(dmg[1] >= dmg[0] * 1.9, 'lv5 not stronger');
  check(await page.evaluate(() => { checkAch(); return (JSON.parse(localStorage.getItem('stickhero_meta')).st || {}).petXp.dragon >= 1500; }), 'pet xp not saved');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.p.x; G.cam.y = G.p.y; G.enemies = []; }); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b138_pet.png`, clip: { x: 120, y: 340, width: 150, height: 130 } });
  await page.evaluate(() => { toTitle(); }); await page.click('#bWard'); await page.waitForTimeout(150);
  check(await page.evaluate(() => $('petGrid').textContent.includes('Lv5')), 'ward shows no Lv');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
