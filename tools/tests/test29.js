// 무기 그림 아이콘 12개: 불러오기, 레벨업 카드·진화 카드·진화 도감·화면 아래 무기 칸에 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const n = await page.evaluate(() => Object.keys(WICON).filter(k => k in WEAP || k.endsWith('_evo')).length); console.log('weapon icons', n); check(n === 12, 'weapon icons not 12');   // WICON에는 능력·아이템 그림도 있음 (Build 54)
  await page.click('#bStart'); await page.waitForTimeout(300);
  // 무기 칸: 6종(검·권총 진화)
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    Object.assign(G.weapons, { sword: 6, pistol: 6, shotgun: 3, boomerang: 2, bolt: 5, hammer: 1 }); G.passives.hp = 1; stSet('evoT', 'sword'); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b52_hud.png`, clip: { x: 0, y: 700, width: 390, height: 144 } });
  // 레벨업 카드: 진화 카드(번개 지팡이 Lv5 + 체력) 그림
  await page.evaluate(() => { SH.G.p.xp = SH.G.p.xpNext || 1e9; openLevelUp(); });
  await page.waitForTimeout(400);
  const cards = await page.evaluate(() => [...document.querySelectorAll('#cards .card')].map(c => (c.classList.contains('evo') ? 'E:' : '') + (c.querySelector('.ic img') ? 'img' : 'emoji')));
  console.log('cards', cards.join()); check(cards[0] === 'E:img', 'evo card has no image');
  await page.screenshot({ path: `${OUT}/b52_cards.png` });
  await page.click('#cards .card >> nth=0'); await page.waitForTimeout(300);
  // 진화 도감
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bEvoP'); await page.waitForTimeout(200);
  const imgs = await page.evaluate(() => document.querySelectorAll('#evoList .ic img').length); console.log('evo imgs', imgs); check(imgs === 2, 'evo guide images wrong');
  await page.screenshot({ path: `${OUT}/b52_evo.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
