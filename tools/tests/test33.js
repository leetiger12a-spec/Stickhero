// 땅 무늬(풀밭·흙 마당·숲 지붕): 그림 불러오기, 마을·숲 스테이지에서 패턴으로 칠하기, 화면 크기가 바뀌면 다시 만들기
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1000);
  check(await page.evaluate(() => !!TEX.grass && !!TEX.dirt && !!TEX.forest), 'ground textures not loaded');
  await page.click('#bStart'); await page.waitForTimeout(600);
  const k1 = await page.evaluate(() => TEX_PAT.grass && TEX_PAT.grass.key); console.log('pattern', k1); check(!!k1, 'pattern not built');
  check(await page.evaluate(() => !!(TEX_PAT.dirt && TEX_PAT.dirt.key)), 'yard pattern not built');
  await page.screenshot({ path: `${OUT}/b56_village.png` });
  await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = WORLD_R - 120; }); await page.waitForTimeout(600);   // 맵 끝: 바깥 숲
  check(await page.evaluate(() => !!(TEX_PAT.forest && TEX_PAT.forest.key)), 'forest pattern not built');
  await page.screenshot({ path: `${OUT}/b58_edge.png` });
  await page.setViewportSize({ width: 820, height: 1180 }); await page.waitForTimeout(500);
  const k2 = await page.evaluate(() => TEX_PAT.grass.key); console.log('after resize', k2); check(k1 !== k2, 'pattern not rebuilt on resize');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => enterStage(0)); await page.waitForTimeout(1200);
  check(await page.evaluate(() => SH.G.mode === 'stage' && SH.G.st.def && THEMES[SH.G.st.def.th].tex === 'grass'), 'forest stage has no texture');
  await page.screenshot({ path: `${OUT}/b56_stage.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
