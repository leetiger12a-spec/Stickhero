// 보물 상자: 보스 처치 → 상자 떨어짐 → 닿으면 열기 화면(룰렛) → 보상 적용(진화 먼저) → 좋아 → 게임 계속, 못 주운 상자는 스테이지 떠날 때 자동 열기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });   // Build 107: 황금 골렘(상자 2개)이 가끔 나와서 흔들리던 것 막음
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  const settle = async () => { for (let i = 0; i < 12; i++) { await pick(); await page.waitForTimeout(120); if (await page.evaluate(() => SH.state === 'play' && SH.G.pending === 0)) return; } };   // 남은 구슬로 레벨업이 이어질 수 있음
  // 마을 보스 처치 → 상자 + 구슬 15개
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9; G.p.magnet = 0;
    G.weapons = { sword: 5, pistol: 2 }; G.passives = { power: 1 }; G.p.x = 0; G.p.y = 330;
    SH.spawnBoss(); endIntro(); const e = G.boss; e.x = 0; e.y = 120; G.gems = []; hurtEnemy(e, 1e12, 0, 1, 0); });
  await page.waitForTimeout(300); await pick();
  const d = await page.evaluate(() => ({ chests: SH.G.chests.length, gems: SH.G.gems.length })); console.log('drop', JSON.stringify(d));
  check(d.chests === 1, 'no chest dropped'); check(d.gems >= 10 && d.gems <= 20, 'boss gems not ~15');
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b61_chest_world.png` });
  // 상자 3개 나오게 하고 닿기 → 진화(성검 폭풍)가 먼저
  await page.evaluate(() => { const G = SH.G, c = G.chests[0]; c.t = 1; c.jack = false;   /* Build 147: 대박 상자(8%)면 보상이 4칸이라 끔 */ window.__roll = CHEST_ROLL.map(r => r[1]); CHEST_ROLL.forEach((r, i) => r[1] = i === 2 ? 1 : 0); G.p.x = c.x; G.p.y = c.y + 10; });   // 3개 나오게 확률을 잠깐 바꿈
  await page.waitForTimeout(250);
  check(await page.evaluate(() => SH.state === 'chest' && document.getElementById('ovChest').classList.contains('show')), 'chest screen not shown');
  await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/b61_chest_spin.png` });
  check(await page.evaluate(() => document.getElementById('chestBox').classList.contains('img') && /chest_big/.test(document.getElementById('chestImg').src)), 'chest image not used');
  await page.waitForTimeout(1700);
  const r = await page.evaluate(() => ({ n: document.querySelectorAll('#chestItems .ci.done').length, evo: document.querySelectorAll('#chestItems .ci.evo').length, sword: SH.G.weapons.sword, btn: document.getElementById('bChestOk').style.display }));
  check(await page.evaluate(() => /chest_big_open/.test(document.getElementById('chestImg').src)), 'open chest image not shown');
  console.log('open', JSON.stringify(r)); check(r.n === 3, 'not 3 rewards'); check(r.evo >= 1 && r.sword === 6, 'evolution not first'); check(r.btn === '', 'ok button hidden');
  await page.screenshot({ path: `${OUT}/b61_chest_open.png` });
  await page.evaluate(() => CHEST_ROLL.forEach((r, i) => r[1] = __roll[i]));
  await page.click('#bChestOk'); await page.waitForTimeout(200); await settle();
  check(await page.evaluate(() => SH.state === 'play' && SH.G.chests.length === 0), 'not back to play');
  // 화면을 누르면 룰렛을 건너뜀
  // 같은 프레임에 레벨업이 생겨도 상자 화면이 먼저 (레벨업은 상자를 닫은 뒤)
  await page.evaluate(() => { const G = SH.G; dropChest(G.p.x + 200, G.p.y); G.chests[0].t = 1; G.p.x += 200; G.xp = G.need + 1; });
  await page.waitForTimeout(200);
  check(await page.evaluate(() => SH.state === 'chest' && SH.G.pending > 0), 'level-up covered the chest'); await page.mouse.click(195, 700); await page.waitForTimeout(150);
  check(await page.evaluate(() => document.getElementById('bChestOk').style.display === '' && !document.querySelector('#chestItems .ci.spin')), 'tap did not skip');
  await page.keyboard.press('Enter'); await page.waitForTimeout(200); await settle();
  check(await page.evaluate(() => SH.state === 'play'), 'enter did not close');
  // 스테이지 보스 상자를 안 줍고 마을로 → 자동 열기
  const before = await page.evaluate(() => { const G = SH.G; enterStage(0); dropChest(G.p.x + 300, G.p.y - 300); return JSON.stringify([G.weapons, G.passives, G.gold]); });
  await page.evaluate(() => SH.returnBase(true)); await page.waitForTimeout(400);
  const after = await page.evaluate(() => JSON.stringify([SH.G.weapons, SH.G.passives, SH.G.gold]));
  console.log('auto', before !== after); check(before !== after, 'auto-open gave nothing'); check(await page.evaluate(() => SH.G.chests.length === 0), 'chest left after stage');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
