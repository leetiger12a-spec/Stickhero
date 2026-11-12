// 소원 별똥별 (Build 155): 마을의 밤에만 9~14초마다 화면 위쪽을 가로지르는 별, 손가락으로 누르면 소원 보상(금화·경험치·체력) + 말풍선, 누른 곳이 멀면 그냥 조이스틱
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.need = 1e9; G.ghostDone = true; });
  await page.evaluate(() => { SH.G.wishT = 0.05; }); await page.waitForTimeout(200); check(await page.evaluate(() => !SH.G.wish), 'wish in day');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 5; SH.G.wishT = 0.05; SH.G.ghostDone = true; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => !!SH.G.wish), 'no wish at night');
  // 먼 곳 누르기: 소원 아님
  await page.mouse.click(195, 700); await page.waitForTimeout(100); check(await page.evaluate(() => !!SH.G.wish && !(SH.G.wishes > 0)), 'far tap took wish');
  await page.screenshot({ path: `${OUT}/b155_wish.png` });
  // 별 위치 누르기
  const pos = await page.evaluate(() => { const [x, y] = wishPos(), r = cv.getBoundingClientRect(); return [x + r.left, y + r.top]; });
  await page.mouse.click(pos[0], pos[1]); await page.waitForTimeout(150);
  const r = await page.evaluate(() => ({ n: SH.G.wishes, gone: !SH.G.wish, txt: SH.G.texts.some(t => t.text.startsWith('🌠')), say: SH.G.say && SH.G.say.kind, st: ST.wishes })); console.log(JSON.stringify(r));
  check(r.n === 1 && r.gone && r.txt && r.say === 'wish' && r.st >= 1, 'wish tap failed');
  // 아침이면 사라짐
  await page.evaluate(() => { SH.G.wishT = 0.05; }); await page.waitForTimeout(200); await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_LEN + 0.2; }); await page.waitForTimeout(200); check(await page.evaluate(() => !SH.G.wish), 'wish in morning');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
