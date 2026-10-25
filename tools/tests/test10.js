// 모험 지도 · 스테이지 목표(보스/구출/버티기/최종) · 별 · 보상 · 잠금
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const OUT = process.env.OUT || 'shots';
  await page.goto('file:///home/user/Stickhero/index.html'); await page.tap('#bStart'); await page.waitForTimeout(300);
  // 지도: 처음엔 1칸만 열림
  await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 1e6; SH.give('sword', 4); SH.give('shotgun', 3); SH.openMap(); });
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.querySelectorAll('.mnode.lock').length === 9), 'lock count wrong');
  await page.tap('.mnode >> nth=3'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.querySelector('#mapCard .t').textContent.startsWith('1.')), 'locked stage selectable');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_map_first.png` });
  // 진행 시뮬레이션: 각 목표 종류 한 번씩 클리어 (게임 루프 직접 실행)
  const run = async (idx) => page.evaluate(idx => {
    const G = SH.G; SH.ok(); enterStage(idx); G.p.hp = G.p.maxHp = 1e6;
    let shot = null;
    for (let i = 0; i < 30 * 200; i++) {
      while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); }
      if (SH.state !== 'play') break;
      if (G.intro) endIntro();
      G.p.hp = G.p.maxHp;   // 영웅은 죽지 않게 (Build 46부터 체력이 최대치로 맞춰짐)
      const st = G.st; if (!st) break;
      // 길을 따라 위로, 우리가 있으면 우리로, 포털이 있으면 포털로
      const cage = st.cages.find(c => !c.freed);
      if (st.portal) { G.p.x = st.portal.x; G.p.y = st.portal.y; }
      else if (cage && G.p.y < cage.y + 400) { G.p.x = cage.x; G.p.y = cage.y + 10; }
      else if (st.def.goal !== 'survive') { G.p.y -= 4; if (G.boss) G.boss.hp -= 60; }
      for (const e of G.enemies) if (!e.boss && Math.random() < 0.02) e.hp = 0;
      update(1 / 30);
    }
    return { state: SH.state, mode: G.mode, stageN: G.stageN, stars: G.stars.slice(), gold: G.gold };
  }, idx);
  for (const idx of [0, 1, 2]) {
    const r = await run(idx);
    console.log('stage', idx + 1, JSON.stringify(r));
    check(r.state === 'result' && r.mode === 'base' && r.stageN === idx + 1 && r.stars[idx] >= 1, 'stage ' + (idx + 1) + ' not cleared');
    if (idx === 1) await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_clear.png` });
  }
  // 구출 스테이지 화면
  await page.evaluate(() => { SH.ok(); enterStage(1); const c = SH.G.st.cages[0]; SH.G.p.x = c.x + 30; SH.G.p.y = c.y + 90; SH.G.banner = null; });
  await page.waitForTimeout(600); await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_rescue.png` });
  // 버티기 화면
  await page.evaluate(() => { returnBase(false); enterStage(2); SH.G.p.hp = SH.G.p.maxHp = 1e6; SH.G.banner = null; });
  await page.waitForTimeout(4000); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); });
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_survive.png` });
  await page.evaluate(() => returnBase(false));
  // 다시 하기는 보상이 적고, 별은 최고 기록 유지
  const g0 = await page.evaluate(() => SH.G.gold);
  const r = await run(0);
  check(r.gold - g0 >= 20 && r.gold - g0 < 60 + 200, 'replay reward odd: ' + (r.gold - g0));
  // 마지막 성: 모두 열고 최종 보스
  await page.evaluate(() => { SH.ok(); SH.G.stageN = 9; });
  const f = await run(9);
  console.log('final', JSON.stringify(f));
  check(f.stageN === 10 && f.state === 'result', 'final not cleared');
  check(await page.evaluate(() => document.getElementById('clrTitle').textContent.includes('모든 모험')), 'all-clear title missing');
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_final.png` });
  await page.evaluate(() => { SH.ok(); SH.openMap(); }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b24_map_full.png` });
  // 저장/불러오기에 별 포함
  let saved = null;   // 결과·지도·이야기 화면이 다 닫히고 마을로 돌아온 뒤에 저장
  for (let i = 0; i < 40; i++) { saved = await page.evaluate(() => { SH.ok(); if (SH.state === 'story') document.getElementById('bStorySkip').click(); if (SH.state !== 'play' || SH.G.mode !== 'base') return null; saveGame(); return JSON.parse(localStorage.getItem('stickhero_save')).stars; }); if (saved) break; await page.waitForTimeout(150); }
  if (!(Array.isArray(saved) && saved[9] >= 1)) console.log('DBG', JSON.stringify(saved), await page.evaluate(() => JSON.stringify({ st: SH.state, mode: SH.G.mode, stars: SH.G.stars, stageN: SH.G.stageN, dead: SH.G.p.dead, deadT: SH.G.deadT, baseDead: SH.G.baseDead })));
  check(Array.isArray(saved) && saved[9] >= 1, 'stars not saved');
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
