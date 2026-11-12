// 처음 보는 기능 안내 (Build 145): 아이템·콤보·카드·동굴 안내 카드가 처음 한 번만, 저장, 누르기를 막지 않음(pointer-events:none)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const tip = () => page.evaluate(() => ({ on: $('tipCard').classList.contains('show'), id: $('tipCard').dataset.id, pe: getComputedStyle($('tipCard')).pointerEvents }));
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.need = 1e9; G.p.hp = G.p.maxHp = 1e9; dropItem('magnet', 600, 600); });
  let t = await tip(); console.log(JSON.stringify(t)); check(t.on && t.id === 'item' && t.pe === 'none', 'item tip');
  await page.screenshot({ path: `${OUT}/b145_tip.png` });
  await page.evaluate(() => { $('tipCard').classList.remove('show'); dropItem('bomb', 600, 600); }); t = await tip(); check(!t.on, 'item tip twice');
  await page.evaluate(() => { const G = SH.G; for (let i = 0; i < 10; i++) { const e = makeEnemy('grunt', 600, 600); G.enemies.push(e); killEnemy(e); } G.gems = []; G.coins = []; }); t = await tip(); check(t.on && t.id === 'combo', 'combo tip');
  await page.evaluate(() => { SH.G.lvl = 5; SH.G.pending = 1; openLevelUp(); }); t = await tip(); check(t.on && t.id === 'cards', 'cards tip'); await page.evaluate(() => SH.choose(0));
  // 저장: 새로고침 뒤에도 다시 안 나옴
  await page.reload(); await page.waitForTimeout(700); await page.click('#bStart'); await page.waitForTimeout(300);
  const again = await page.evaluate(() => [showTip('item'), showTip('combo'), showTip('cards'), showTip('cave')]); console.log('again', again.join()); check(again.join() === 'false,false,false,true', 'tips not saved');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
