// 밤과 낮 (Build 93): 마을 3분 뒤부터 4분마다 1분 밤 — 화면이 어두워짐(영웅 주변은 밝음), 적 +50%, 아침에 금화 보너스, 저장
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const px = async () => { const buf = await page.screenshot({ clip: { x: 10, y: 700, width: 40, height: 40 } }); return buf; };
  // 밝기 비교: 화면 구석 (영웅에서 먼 곳) 평균 밝기
  const lum = () => page.evaluate(() => { const c = document.querySelector('canvas'), x = c.getContext('2d'), d = x.getImageData(20 * DPR, 650 * DPR, 30, 30).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return Math.round(s / (d.length / 4) / 3); });
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.bt = 170; G.p.hp = G.p.maxHp = 1e6; const B = window.banner; window.__bn = []; window.banner = function (t) { __bn.push(t); return B.apply(this, arguments); }; });   // 알림은 겹쳐서 덮일 수 있어 모두 기록
  await page.waitForTimeout(300);
  const day = await page.evaluate(() => ({ k: nightK(), on: !!SH.G.nightOn })); const l0 = await lum();
  await page.evaluate(() => { SH.G.bt = 186; }); await page.waitForTimeout(400);
  const nt = await page.evaluate(() => ({ k: nightK(), on: !!SH.G.nightOn, banner: __bn.join(' / '), flies: (SH.G.flies || []).length }));
  await page.waitForTimeout(1500); const l1 = await lum();
  console.log('day', JSON.stringify(day), 'lum', l0, '→ night', JSON.stringify(nt), 'lum', l1);
  check(day.k === 0 && !day.on, 'night too early');
  check(nt.k > 0.9 && nt.on && /밤이 됐다/.test(nt.banner || ''), 'night did not start');
  check(l1 < l0 * 0.75, 'screen not darker at night');
  check(await page.evaluate(() => (SH.G.flies || []).length > 0), 'no fireflies');
  await page.screenshot({ path: `${OUT}/b93_night.png` });
  // 아침: 금화 보너스 + 밤 횟수 저장
  const g0 = await page.evaluate(() => SH.G.gold);
  await page.evaluate(() => { SH.G.bt = 240.5; }); await page.waitForTimeout(300);
  const mo = await page.evaluate(() => ({ on: !!SH.G.nightOn, nights: SH.G.nights, gold: SH.G.gold, banner: __bn.join(' / '), k: nightK() }));
  console.log('morning', JSON.stringify(mo), 'gold before', g0); check(!mo.on && mo.nights === 1 && mo.gold >= g0 + 60 && /아침/.test(mo.banner || '') && mo.k === 0, 'morning bonus wrong');
  await page.evaluate(() => saveGame()); await page.reload(); await page.waitForTimeout(600); await page.click('#bContinue'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.nights === 1), 'nights not saved');
  // 스테이지에서는 밤이 없음
  await page.evaluate(() => { SH.G.bt = 190; enterStage(0); }); await page.waitForTimeout(300);
  check(await page.evaluate(() => nightK() === 0), 'night in stage');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
