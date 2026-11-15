// 🎁 보물 가방 (Build 201): 상자를 주우면 가방에, 🎁 버튼으로 한꺼번에 열기, 저장·불러오기, 스테이지 떠날 때 남은 상자도 가방에
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(500);
  check(await page.evaluate(() => !$('bBag').classList.contains('show')), 'no bag button at start');
  // 상자 4개 떨어뜨리고 하나씩 줍기
  await page.evaluate(() => { const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; p.hp = p.maxHp = 1e9; dropChest(p.x, p.y, false); dropChest(p.x, p.y, true); dropChest(p.x, p.y, true); G.chests.forEach(c => c.t = 1); });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ st: SH.state, bag: SH.G.bag.length, ground: SH.G.chests.length, btn: $('bBag').classList.contains('show'), n: $('bagN').textContent }));
  console.log(JSON.stringify(r)); check(r.st === 'play' && r.bag === 3 && r.ground === 0 && r.btn && r.n === '3', 'picked into bag');
  await page.screenshot({ path: `${OUT}/b201_bag.png` });
  // 저장·불러오기
  const sv = await page.evaluate(() => { saveGame(); return JSON.parse(localStorage.getItem('stickhero_save')).bag.length; });
  check(sv === 3, 'bag saved');
  // 한꺼번에 열기
  const w0 = await page.evaluate(() => JSON.stringify(SH.G.weapons) + JSON.stringify(SH.G.passives) + SH.G.gold);
  await page.click('#bBag', { force: true }); await page.waitForTimeout(300);
  const o = await page.evaluate(() => ({ st: SH.state, title: $('chestTitle').textContent, n: document.querySelectorAll('#chestItems .ci').length }));
  console.log(JSON.stringify(o)); check(o.st === 'chest' && o.title.includes('3개') && o.n >= 3, 'open all at once');
  await page.waitForTimeout(3600); await page.screenshot({ path: `${OUT}/b201_open.png` });
  await page.evaluate(() => SH.closeChest()); await page.waitForTimeout(200);
  const w1 = await page.evaluate(() => JSON.stringify(SH.G.weapons) + JSON.stringify(SH.G.passives) + SH.G.gold);
  check(await page.evaluate(() => SH.G.bag.length === 0 && !$('bBag').classList.contains('show')) && w1 !== w0, 'rewards applied, bag empty');
  // 스테이지 떠날 때 남은 상자 → 가방
  await page.evaluate(() => { const G = SH.G; dropChest(G.p.x + 300, G.p.y + 300, true); dropChest(G.p.x + 300, G.p.y + 300, true); SH.enterStage(0); });
  await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.bag.length === 2 && SH.state === 'play'), 'flush to bag');
  // PC 키 B
  await page.evaluate(() => { SH.G.banner = null; }); await page.keyboard.press('b'); await page.waitForTimeout(200);
  check(await page.evaluate(() => SH.state === 'chest'), 'key B opens');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
