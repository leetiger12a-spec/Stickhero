// 영웅 모자 (Build 97): 모자 8개 그림, 별 수로 잠금, 꾸미기에서 고르면 저장, 서기·걷기·베기 때 머리 위에 그려짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const ic = await page.evaluate(() => HATS.filter(h => h.id && WICON['hat_' + h.id]).length); console.log('hat icons', ic); check(ic === 8, 'hat icons not 8');
  // 별 0개: 모자 버튼 9개, '없음'만 열림
  await page.click('#bWard'); await page.waitForTimeout(300);
  let st = await page.evaluate(() => [...document.querySelectorAll('#hatGrid .sw')].map(x => x.classList.contains('lock'))); console.log('locks', st.join());
  check(st.length === 9 && !st[0] && st.slice(1).every(x => x), 'lock state wrong at 0 stars');
  await page.click('#hatGrid .sw[data-i="3"]'); check(await page.evaluate(() => hatSel === 0), 'locked hat chosen');
  // 별 많이 → 모두 열림, 왕관 고르기
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.bestStars = 45; localStorage.setItem('stickhero_meta', JSON.stringify(m)); renderWard(); });
  st = await page.evaluate(() => [...document.querySelectorAll('#hatGrid .sw')].filter(x => x.classList.contains('lock')).length); check(st === 0, 'still locked');
  await page.click('#hatGrid .sw[data-i="1"]'); await page.waitForTimeout(150);
  check(await page.evaluate(() => hatSel === 1 && localStorage.getItem('stickhero_hat') === '1'), 'hat not saved');
  await page.screenshot({ path: `${OUT}/b97_ward.png` });
  await page.click('#bWardOk'); await page.reload(); await page.waitForTimeout(800);
  check(await page.evaluate(() => hatSel === 1), 'hat not kept after reload');
  await page.click('#bStart'); await page.waitForTimeout(500);
  // drawHat 부름 세기
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; window.__hc = 0; const r = window.drawHat; window.drawHat = (...a) => { __hc++; return r(...a); }; });
  await page.waitForTimeout(300); const hc = await page.evaluate(() => __hc); console.log('drawHat calls', hc); check(hc > 3, 'hat not drawn in game');
  // 모자마다 사진: 서기 / 걷기 / 베기
  const zoom = async nm => { const bb = await page.evaluate(() => { const G = SH.G, c = document.querySelector('canvas'), r = c.getBoundingClientRect(); return { x: r.width / 2 - 60, y: r.height / 2 - 100, width: 120, height: 130 }; }); await page.screenshot({ path: `${OUT}/${nm}.png`, clip: bb }); };
  for (let i = 1; i < 9; i++) {
    await page.evaluate(i => { hatSel = i; const p = SH.G.p; p.act = null; p.moving = false; }, i); await page.waitForTimeout(120); await zoom(`b97_hat${i}_stand`);
    await page.evaluate(() => { const p = SH.G.p; p.act = 'slash'; p.actT = ACTS.slash * 0.6; }); await page.waitForTimeout(30); await zoom(`b97_hat${i}_slash`);
  }
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
