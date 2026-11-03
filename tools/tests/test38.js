// Build 66: 진지 작은 상자(1개·진화 없음·작은 상자 그림), 황금 보스(금빛·체력 2배·상자 최소 2개·기록), 동료 도감, 새 업적(상자 10개)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const settle = async () => { for (let i = 0; i < 15; i++) { await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); if (SH.state === 'chest') { document.getElementById('ovChest').onclick({ target: {} }); SH.closeChest(); } }); await page.waitForTimeout(120); if (await page.evaluate(() => SH.state === 'play' && SH.G.pending === 0)) return; } };
  // 진지 부수기 → 작은 상자
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.p.magnet = 0;
    G.weapons = { sword: 5 }; G.passives = { power: 1 }; ST.chests = 9;
    const c = G.camps[0]; if (!c.e) makeCamp(c, 1); hurtEnemy(c.e, 1e12, 0, 1, 0); });
  await page.waitForTimeout(300); await settle();
  const sc = await page.evaluate(() => SH.G.chests.filter(c => c.small).length); console.log('small chests', sc); check(sc === 1, 'camp did not drop small chest');
  await page.evaluate(() => { const G = SH.G, c = G.chests.find(c => c.small); c.t = 1; G.p.x = c.x; G.p.y = c.y + 10; });
  await page.waitForTimeout(250);
  check(await page.evaluate(() => SH.state === 'chest' && document.getElementById('chestTitle').textContent.includes('작은 상자') && /chest_small/.test(document.getElementById('chestImg').src)), 'small chest screen wrong');
  await page.waitForTimeout(1700);
  const r = await page.evaluate(() => ({ n: document.querySelectorAll('#chestItems .ci').length, evo: document.querySelectorAll('#chestItems .ci.evo').length, sword: SH.G.weapons.sword, open: /chest_small_open/.test(document.getElementById('chestImg').src) }));
  console.log('small open', JSON.stringify(r)); check(r.n === 1 && r.evo === 0 && r.sword === 5, 'small chest gave evo or not 1'); check(r.open, 'small open image missing');
  await page.screenshot({ path: `${OUT}/b66_small.png` });
  await page.click('#bChestOk'); await settle();
  check(await page.evaluate(() => !!(JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}).chest10 || (checkAch(), !!(JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}).chest10)), 'chest10 achievement missing');
  // 황금 보스
  await page.evaluate(() => { const G = SH.G; G.chests = []; SH.spawnBoss(); endIntro(); const e = G.boss; e.golden = true; e.x = G.p.x; e.y = G.p.y - 160; e.spd = 0; });
  check(await page.evaluate(() => !!SPR_GOLD[SH.G.boss.spr]), 'no gold boss sprite');
  await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/b66_goldboss.png`, clip: { x: 45, y: 120, width: 300, height: 340 } });
  await page.evaluate(() => hurtEnemy(SH.G.boss, 1e13, 0, 1, 0)); await page.waitForTimeout(300); await settle();
  const gb = await page.evaluate(() => ({ rec: ST.goldB.length, chest: SH.G.chests.filter(c => c.gold).length })); console.log('gold boss', JSON.stringify(gb)); check(gb.rec === 1 && gb.chest === 1, 'gold boss not recorded / no gold chest');
  await page.evaluate(() => { const G = SH.G, c = G.chests.find(c => c.gold); c.t = 1; G.p.x = c.x; G.p.y = c.y + 10; });
  for (let i = 0; i < 20 && await page.evaluate(() => SH.state !== 'chest'); i++) { await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); }); await page.waitForTimeout(100); }   // 레벨업이 먼저 뜰 수 있음
  check(await page.evaluate(() => document.getElementById('chestTitle').textContent.includes('황금')), 'gold chest title');
  await page.evaluate(() => document.getElementById('ovChest').onclick({ target: {} })); await page.waitForTimeout(100);
  const gn = await page.evaluate(() => document.querySelectorAll('#chestItems .ci').length); console.log('gold chest items', gn); check(gn >= 2, 'gold chest gave < 2');
  await page.evaluate(() => SH.closeChest()); await settle();
  // 동료 도감
  await page.evaluate(() => { SH.G.gems = []; SH.G.xp = 0; }); await settle(); await page.evaluate(() => { hireAlly('sword'); });   // 남은 구슬로 레벨업이 일시정지를 막지 않게
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bDexP'); await page.waitForTimeout(250);
  const al = await page.evaluate(() => [...document.querySelectorAll('#dexList .dex.ally')].map(d => (d.classList.contains('off') ? '-' : '+') + d.querySelector('b').textContent).join(','));
  console.log('allies', al); check(al.startsWith('+고양이 검사'), 'ally dex not updated');
  await page.evaluate(() => document.getElementById('dexList').scrollTop = 9999); await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/b66_dex_allies.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
