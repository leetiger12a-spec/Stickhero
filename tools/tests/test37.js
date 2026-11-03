// Build 65: 무기 칸 위 능력 줄(+안내 글 위로), 화산 바닥 불길 밝은 테두리, 줍기 전 마을 보물 상자 저장·이어하기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.click('#bStart'); await page.waitForTimeout(300);
  // 능력 줄
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.weapons = { sword: 3, pistol: 6 }; G.passives = { hp: 2, power: 5, magnet: 1, bag: 3 }; });
  await page.waitForTimeout(500);
  check(await page.evaluate(() => ['hp', 'power', 'magnet', 'bag'].every(id => !!ICO_BAKE['hud|p_' + id + '|' + DPR])), 'passive icons not drawn');
  await page.screenshot({ path: `${OUT}/b65_passives.png`, clip: { x: 0, y: 690, width: 390, height: 154 } });
  // 마을 보물 상자 저장 → 새로고침 → 이어하기
  await page.evaluate(() => { const G = SH.G; dropChest(G.p.x + 150, G.p.y + 150); saveGame(); });
  await page.reload(); await page.waitForTimeout(800); await page.click('#bContinue'); await page.waitForTimeout(400);
  const ch = await page.evaluate(() => SH.G.chests.length); console.log('chests after reload', ch); check(ch === 1, 'village chest not saved');
  // 화산 불길
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.weapons = { hammer: 6 }; G.timers.hammer = 0; enterStage(8); });
  await page.waitForTimeout(600);
  await page.evaluate(() => { const G = SH.G; for (let k = 0; k < 5; k++) { const e = makeEnemy('tank', G.p.x - 60 + k * 30, G.p.y - 40); e.hp = e.maxHp = 1e9; e.spd = 0; G.enemies.push(e); } G.timers.hammer = 0; });
  await page.waitForTimeout(700); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  check(await page.evaluate(() => SH.G.pflames.length > 0), 'no flames in volcano');
  await page.screenshot({ path: `${OUT}/b65_volcano.png`, clip: { x: 45, y: 250, width: 300, height: 300 } });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
