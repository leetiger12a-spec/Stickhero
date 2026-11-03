// 몬스터 도감·황금 몬스터: 처음엔 18종 모두 그림자, 잡으면 그림·이름·별, 황금 몬스터(확률·체력 3배·금빛·도감 황금 칸·업적), 새로고침 뒤 유지
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const sub = () => page.evaluate(() => document.getElementById('dexSub').textContent);
  // 시작 화면 → 업적 → 몬스터 도감
  await page.click('#bAchT'); await page.waitForTimeout(150); await page.click('#bDexA'); await page.waitForTimeout(300);
  console.log(await sub()); check((await sub()).includes('0/18'), 'dex not 0/18');
  check(await page.evaluate(() => document.querySelectorAll('#dexList .dex:not(.ally)').length === 18 && document.querySelectorAll('#dexList .dex.off:not(.ally)').length === 18 && document.querySelectorAll('#dexList .dex.ally').length === 4), 'not 18 shadows');
  await page.click('#bDexOk'); await page.waitForTimeout(100);
  check(await page.evaluate(() => state === 'ach'), 'not back to ach'); await page.click('#bAchOk');
  // 확률: makeEnemy 30,000번 → 황금 약 20번
  await page.click('#bStart'); await page.waitForTimeout(300);
  const ng = await page.evaluate(() => { let n = 0; for (let i = 0; i < 30000; i++) if (makeEnemy('grunt', 0, 0).golden) n++; return n; });
  console.log('golden in 30000', ng); check(ng >= 6 && ng <= 45, 'golden rate off');
  // 졸개 12마리 → 별 1개, 황금 날쌘이, 보스 1마리
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.hp = G.p.maxHp = 1e9;
    for (let i = 0; i < 12; i++) { const e = makeEnemy('grunt', 300, 300); e.golden = false; G.enemies.push(e); hurtEnemy(e, 1e9, 0, 1, 0); }
    SH.spawnBoss(); endIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); });
  await page.waitForTimeout(300); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); if (SH.state === 'chest') { document.getElementById('ovChest').onclick({ target: {} }); } });
  await page.waitForTimeout(200); await page.evaluate(() => { if (SH.state === 'chest') SH.closeChest(); while (SH.state === 'levelup') SH.choose(0); SH.G.chests = []; });
  // 황금 몬스터: 체력 3배, 금빛으로 그려짐
  const gold = await page.evaluate(() => { const G = SH.G, e = makeEnemy('runner', G.p.x + 70, G.p.y - 40), hp = e.hp; makeGolden(e); e.spd = 0; G.enemies.push(e); return { x3: Math.round(e.hp / hp), banner: !!G.banner }; });
  console.log('golden', JSON.stringify(gold)); check(gold.x3 === 3, 'golden hp not x3');
  check(await page.evaluate(() => !!SPR_GOLD.runner), 'no gold sprite');
  await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/b64_golden.png`, clip: { x: 95, y: 280, width: 260, height: 220 } });
  await page.evaluate(() => { const e = SH.G.enemies.find(e => e.golden && !e.dead); if (e) hurtEnemy(e, 1e9, 0, 1, 0); });   // 시작 무기가 먼저 잡았을 수도 있음
  await page.waitForTimeout(1300); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  const st = await page.evaluate(() => ({ g: ST.goldT.join(), kc: ST.kc.grunt, bk: Object.values(ST.bk).reduce((a, b) => a + b, 0), ach: !!(JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}).gold1 }));
  console.log('st', JSON.stringify(st)); check(st.g === 'runner' && st.kc >= 12 && st.bk >= 1 && st.ach, 'records wrong');
  // 일시정지 → 몬스터 도감
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bDexP'); await page.waitForTimeout(250);
  console.log(await sub()); check((await sub()).includes('3/18'), 'dex not 3/18');
  const cards = await page.evaluate(() => [...document.querySelectorAll('#dexList .dex:not(.off):not(.ally)')].map(d => d.querySelector('b').textContent + '|' + (d.querySelector('.stars').firstChild && d.querySelector('.stars').firstChild.nodeType === 3 ? d.querySelector('.stars').firstChild.textContent.length : 0) + '|' + (d.querySelector('.gold.on') ? 'G' : '')));
  console.log(cards.join(' ; ')); check(cards.some(c => c.startsWith('빨간 졸개|1|')), 'grunt card not 1 star (12 kills)'); check(cards.some(c => c.startsWith('대왕 슬라임|1|')), 'boss card not 1 star'); check(cards.some(c => c.startsWith('분홍 날쌘이') && c.endsWith('G')), 'golden badge missing');
  await page.screenshot({ path: `${OUT}/b64_dex.png` });
  await page.click('#bDexOk'); await page.waitForTimeout(100); check(await page.evaluate(() => state === 'paused'), 'not back to pause');
  // 새로고침 뒤 유지
  await page.reload(); await page.waitForTimeout(700);
  check(await page.evaluate(() => ST.goldT.includes('runner') && ST.kc.grunt >= 12), 'records lost after reload');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
