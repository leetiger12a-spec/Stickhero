// 디자인 확인용 화면 사진: 시작·게임 화면·레벨업·일시정지·업적·강화·지도·게임오버 (OUT 폴더, 이름 앞에 라벨)
// 사용: node tools/perf/uishots.js 라벨   (http://localhost:8765 필요)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const L = process.argv[2] || 'ui', OUT = process.env.OUT || 'shots';
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1500);
  const shot = async n => { await page.waitForTimeout(350); await page.screenshot({ path: `${OUT}/${L}_${n}.png` }); };
  await shot('1title');
  await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.weapons = { sword: 3, pistol: 6 }; G.gold = 230; });
  await page.waitForTimeout(1500); await shot('2hud');
  await page.evaluate(() => openLevelUp()); await shot('3level');
  await page.click('#cards .card >> nth=0'); await page.waitForTimeout(300);
  await page.click('#bPause'); await shot('4pause');
  await page.click('#bAchP'); await shot('5ach');
  await page.click('#bAchOk'); await page.click('#bShopP'); await shot('6shop');
  await page.click('#bShopOk'); await page.click('#bResume'); await page.waitForTimeout(200);
  await page.evaluate(() => SH.killBase()); await page.waitForTimeout(3000); await shot('7over');
  await b.close(); console.log('errors', errors.length, errors.join(' | '));
})();
