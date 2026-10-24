// 해금(번개 지팡이·강아지 방패병·불꽃 망치) · 엔딩
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html'); await page.tap('#bStart'); await page.waitForTimeout(300);
  // 처음엔 잠김
  const locked = await page.evaluate(() => ({ bolt: isUnlocked('w', 'bolt'), shield: isUnlocked('a', 'shield'), hammer: isUnlocked('w', 'hammer') }));
  check(!locked.bolt && !locked.shield && !locked.hammer, 'should be locked at start');
  const pool0 = await page.evaluate(() => { const seen = new Set(); for (let k = 0; k < 40; k++) { SH.G.pending = 1; openLevelUp(); choices.forEach(c => seen.add(c.id)); } state = 'play'; showOv(null); SH.G.pending = 0; return [...seen]; });
  check(!pool0.includes('bolt') && !pool0.includes('hammer'), 'locked weapon offered');
  // 스테이지 3 첫 클리어 → 번개 해금 안내
  await page.evaluate(() => { SH.G.stageN = 2; enterStage(2); SH.G.st.stars = 3; returnBase(true); });
  await page.waitForTimeout(1300);
  check(await page.evaluate(() => document.getElementById('clrInfo').textContent.includes('번개 지팡이')), 'unlock message missing');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b25_unlock.png` });
  await page.evaluate(() => SH.ok());
  check(await page.evaluate(() => isUnlocked('w', 'bolt') && !isUnlocked('a', 'shield')), 'bolt unlock state wrong');
  // 게임오버 뒤에도 해금 유지
  await page.evaluate(() => { SH.killBase(); }); await page.waitForTimeout(2600);
  await page.tap('#bRetry'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.stageN === 0 && isUnlocked('w', 'bolt')), 'unlock not kept after game over');
  // 무기 둘 다 써 보기
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e6; G.weapons = { bolt: 3, hammer: 3 }; G.timers = {}; G.p.x = 0; G.p.y = 300;
    for (let i = 0; i < 14; i++) G.enemies.push(makeEnemy('grunt', rand(-60, 60), 300 + rand(-60, 60))); });
  let shot = false; const k0 = await page.evaluate(() => SH.G.kills);
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(100); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
    if (!shot && await page.evaluate(() => SH.G.zaps.length > 0 && SH.G.rings.length > 0)) { await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b25_weapons.png` }); shot = true; } }
  const k1 = await page.evaluate(() => SH.G.kills);
  console.log('bolt+hammer kills', k1 - k0); check(k1 - k0 >= 5, 'new weapons weak');
  // 강아지 방패병: 5칸 해금 후 고용 카드에 나옴
  await page.evaluate(() => { writeJSON(META_KEY, Object.assign(readJSON(META_KEY) || {}, { maxStage: 5 })); SH.G.tavern = true; SH.G.enemies = []; openAllyPick(); });
  await page.waitForTimeout(400);
  const cards = await page.evaluate(() => [...document.querySelectorAll('#cards .card .nm')].map(e => e.textContent));
  console.log('ally cards', cards.join(' | ')); check(cards.some(c => c.includes('강아지')), 'shield ally not offered');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b25_allypick.png` });
  await page.tap('.card >> nth=3'); await page.waitForTimeout(200);
  check(await page.evaluate(() => SH.G.allies.some(a => a.type === 'shield')), 'shield not hired');
  // 엔딩
  await page.evaluate(() => { SH.G.stageN = 9; enterStage(9); SH.G.st.stars = 3; returnBase(true); });
  await page.waitForTimeout(800);
  check(await page.evaluate(() => document.getElementById('bClrOk').textContent.startsWith('엔딩')), 'ending button missing');
  await page.tap('#bClrOk'); await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.state === 'story'), 'ending not shown');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b25_ending.png` });
  for (let i = 0; i < 3; i++) { await page.tap('#storyCap'); await page.waitForTimeout(250); }
  check(await page.evaluate(() => SH.state === 'play'), 'ending did not finish');
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
