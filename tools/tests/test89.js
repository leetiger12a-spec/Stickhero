// 비밀 보물 동굴 (Build 131): ⭐3 칸 5개면 지도에 🌟 동굴 버튼, 들어가면 40초 버티기·모두 황금 몬스터, 끝나면 포털 → 마을, 하루 1번
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.ach = Object.fromEntries(ACH.map(A => [A.id, true])); localStorage.setItem('stickhero_meta', JSON.stringify(m)); });   /* 업적 알림이 귀환 알림을 덮지 않게 */
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.need = 1e9; G.pads.find(q => q.order === 0).built = true; G.stageN = 6; G.stars = [3, 3, 3, 3, 2, 1]; openMap(); });
  check(await page.evaluate(() => $('bCave').style.display === 'none'), 'cave shown with 4 stars3');
  await page.evaluate(() => { SH.G.stars[4] = 3; $('bMapClose').click(); openMap(); }); await page.waitForTimeout(150);
  check(await page.evaluate(() => $('bCave').style.display === ''), 'cave hidden with 5');
  await page.click('#bCave'); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b131_card.png` });
  await page.click('#bGoCave'); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ mode: SH.G.mode, cave: SH.G.st.cave, goal: SH.G.st.def.goal, timer: SH.G.st.timer, n: SH.G.enemies.length, gold: SH.G.enemies.length > 0 && SH.G.enemies.every(e => e.golden) }));
  console.log(JSON.stringify(r)); check(r.mode === 'stage' && r.cave && r.goal === 'survive' && r.timer > 30 && r.n > 0 && r.gold, 'cave stage wrong');
  await page.screenshot({ path: `${OUT}/b131_cave.png` });
  // 끝: 시간 다 되면 포털
  await page.evaluate(() => { SH.G.st.timer = 0.05; }); await page.waitForTimeout(400);
  check(await page.evaluate(() => SH.G.st.clear && !!SH.G.st.portal), 'no portal');
  await page.evaluate(() => returnBase(true)); await page.waitForTimeout(200);
  const back = await page.evaluate(() => ({ mode: SH.G.mode, ban: SH.G.banner && SH.G.banner.text, stageN: SH.G.stageN })); console.log(JSON.stringify(back));
  check(back.mode === 'base' && back.ban.includes('동굴') && back.stageN === 6, 'return wrong');
  // 같은 날은 다시 못 감
  await page.evaluate(() => openMap()); await page.click('#bCave'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !document.getElementById('bGoCave') && $('mapCard').textContent.includes('이미')), 'cave twice same day');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
