// 땅 장식 그림 (Build 74): 8개 불러오기, 마을 풀밭에 꽃·버섯·조약돌, 스테이지 테마마다 맞는 장식 (폐허 이끼 돌·던전 뼈·화산 용암 돌·성 벽돌)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(500);
  const n = await page.evaluate(() => Object.keys(DECAL_H).filter(k => WICON[k]).length); console.log('decal images', n); check(n === 12, 'decal images not 12');   // Build 94: 얼음 4개 추가
  // 그린 장식 세기: drawDecal을 감싸서 한 프레임 동안 이름별로 셈
  await page.evaluate(() => { const real = window.drawDecal; window.__dc = {}; window.drawDecal = (nm, x, y, s) => { const ok = real(nm, x, y, s); if (ok) __dc[nm] = (__dc[nm] || 0) + 1; return ok; }; });
  const count = async () => { await page.evaluate(() => { __dc = {}; }); await page.waitForTimeout(120); return page.evaluate(() => { const c = __dc; __dc = {}; return c; }); };
  // 마을: 마당 밖 풀밭으로 이동해서 봄
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.x = 0; G.p.y = 330; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; });
  await page.waitForTimeout(700);
  let c = await count(); console.log('village', JSON.stringify(c));
  check(['d_daisy', 'd_butter', 'd_pebble'].every(k => c[k] > 0), 'village flowers/pebbles not drawn');
  check(!c.d_bones && !c.d_lava && !c.d_bricks && !c.d_moss, 'stage decals in village');
  await page.screenshot({ path: `${OUT}/b74_village.png` });
  // 스테이지 테마별: 숲 0, 폐허 3, 던전 6, 화산 7, 성 9
  const want = { 0: ['d_daisy', 'd_butter', 'd_mush', 'd_pebble'], 3: ['d_moss', 'd_pebble'], 6: ['d_bones', 'd_pebble'], 7: ['d_lava'], 9: ['d_bricks'] };
  for (const idx of [0, 3, 6, 7, 9]) {
    await page.evaluate(i => { const G = SH.G; enterStage(i); G.intro = null; G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.p.y = -G.st.L * 0.4; G.cam.y = G.p.y - 12; G.st.groups.forEach(g => g.done = true); }, idx);
    await page.waitForTimeout(500);
    c = await count(); const seen = Object.keys(c); console.log('stage', idx, JSON.stringify(c));
    check(seen.length > 0 && seen.every(k => want[idx].includes(k)), `stage ${idx} wrong decals: ${seen}`);
    if (idx !== 0) check(seen.includes(want[idx][0]), `stage ${idx} missing ${want[idx][0]}`);
    await page.screenshot({ path: `${OUT}/b74_stage${idx}.png` });
    await page.evaluate(() => returnBase(false)); await page.waitForTimeout(300);
  }
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
