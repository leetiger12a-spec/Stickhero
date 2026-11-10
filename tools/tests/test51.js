// 보스 연습 (Build 89): 일시정지 → 몬스터 도감 → 만난 보스 "⚔ 다시 싸우기" → 그 보스만 싸움, 기록·업적·상자 없음, 이기면 금화 조금 + 마을 포털, 져도 마을로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true;
    const m = { st: { bossT: ['바위 골렘 왕', '왕관 괴물 대왕'], bk: { '바위 골렘 왕': 1, '왕관 괴물 대왕': 1 } } }; localStorage.setItem('stickhero_meta', JSON.stringify(m)); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  // 시작 화면 도감에서는 버튼 없음
  await page.evaluate(() => { $('bAchT').click(); $('bDexA').click(); }); await page.waitForTimeout(200);   // 시작 화면 → 업적 → 몬스터 도감
  check(await page.evaluate(() => document.querySelectorAll('.dexFight').length === 0), 'fight button on title dex');
  await page.evaluate(() => { $('bDexOk').click(); $('bAchOk').click(); }); await page.waitForTimeout(200);
  await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { SH.G.nextBoss = 999; SH.G.nextWave = 999; togglePause(); }); await page.waitForTimeout(150);
  await page.evaluate(() => $('bDexP').click()); await page.waitForTimeout(200);
  const btns = await page.evaluate(() => [...document.querySelectorAll('.dexFight')].map(b => b.dataset.k)); console.log('fight buttons', btns.join());
  check(btns.join() === 'boss6,boss_final', 'fight buttons only for met bosses');
  const bb = await page.locator('.dexFight[data-k="boss6"]').boundingBox(); check(bb && bb.height >= 44, 'fight button too small');
  await page.locator('.dexFight[data-k="boss6"]').scrollIntoViewIfNeeded(); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b89_dex.png` });
  const k0 = await page.evaluate(() => ({ bk: ST.bk['바위 골렘 왕'] || 0, bosses: ST.bosses || 0, gold: SH.G.gold }));
  await page.locator('.dexFight[data-k="boss6"]').click(); await page.waitForTimeout(2300);
  const s1 = await page.evaluate(() => ({ state: SH.state, mode: SH.G.mode, pr: SH.G.st && SH.G.st.practice, boss: SH.G.boss && SH.G.boss.name, golden: !!(SH.G.boss && SH.G.boss.golden) }));
  console.log('practice', JSON.stringify(s1)); check(s1.state === 'play' && s1.mode === 'stage' && s1.pr === 6 && s1.boss === '바위 골렘 왕' && !s1.golden, 'practice did not start rock golem king');
  await page.screenshot({ path: `${OUT}/b89_fight.png` });
  const w = await page.evaluate(async () => { const G = SH.G, e = G.boss; G.p.hp = G.p.maxHp = 1e6; hurtEnemy(e, 1e9, 0, 1, 0); await new Promise(r => setTimeout(r, 400)); return { clear: G.st.clear, portal: !!G.st.portal, portal2: !!G.st.portal2, chests: (G.chests || []).length, coins: G.coins.length }; });
  console.log('win', JSON.stringify(w)); check(w.clear && w.portal && !w.portal2 && w.chests === 0 && w.coins > 0, 'practice win wrong');
  // Build 90: 연습 최고 기록
  const pb = await page.evaluate(() => ({ rec: (JSON.parse(localStorage.getItem('stickhero_meta')).pbest || {})['바위 골렘 왕'], banner: SH.G.banner && SH.G.banner.t }));
  console.log('practice best', JSON.stringify(pb)); check(pb.rec >= 1, 'practice best time not saved');
  const k1 = await page.evaluate(() => ({ bk: ST.bk['바위 골렘 왕'] || 0, bosses: ST.bosses || 0 }));
  check(k1.bk === k0.bk && k1.bosses === k0.bosses, 'practice changed records');
  await page.evaluate(() => returnBase(true)); await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({ mode: SH.G.mode, stageN: SH.G.stageN, banner: SH.G.banner && SH.G.banner.t }));
  console.log('home', JSON.stringify(r)); check(r.mode === 'base' && r.stageN === 0, 'practice return wrong');
  // 도감 카드에 기록 표시
  await page.evaluate(() => { togglePause(); $('bDexP').click(); }); await page.waitForTimeout(200);
  check(await page.evaluate(() => [...document.querySelectorAll('#dexList .dex.boss')].some(el => el.textContent.includes('바위 골렘 왕') && /연습 최고 \d+초/.test(el.textContent))), 'best time not shown in dex');
  // Build 91: 일반 연습을 이기면 🔥 도전 버튼 → 체력 2배·공격 1.5배, 기록 따로
  const hb = await page.evaluate(() => [...document.querySelectorAll('.dexFight.hard')].map(b => b.dataset.k)); console.log('hard buttons', hb.join()); check(hb.join() === 'boss6', 'hard button only after normal win');
  await page.evaluate(() => document.querySelector('.dexFight.hard[data-k="boss6"]').click()); await page.waitForTimeout(2300);
  const hd = await page.evaluate(() => { const e = SH.G.boss; return { hard: !!(e && e.hard), hp: e && Math.round(e.maxHp), dmg: e && Math.round(e.dmg) }; });
  console.log('hard', JSON.stringify(hd)); check(hd.hard && hd.hp === 100000 && hd.dmg >= 82, 'hard practice stats wrong');
  await page.evaluate(async () => { SH.skipIntro(); hurtEnemy(SH.G.boss, 1e9, 0, 1, 0); await new Promise(r => setTimeout(r, 300)); returnBase(true); }); await page.waitForTimeout(200);
  const pb2 = await page.evaluate(() => JSON.parse(localStorage.getItem('stickhero_meta')).pbest); console.log('pbest', JSON.stringify(pb2));
  check(pb2['바위 골렘 왕'] >= 1 && pb2['바위 골렘 왕 🔥'] >= 1, 'hard record not separate');
  await page.evaluate(() => { togglePause(); $('bDexP').click(); }); await page.waitForTimeout(200);
  await page.locator('.dexFight.hard[data-k="boss6"]').scrollIntoViewIfNeeded(); await page.screenshot({ path: `${OUT}/b91_dex.png` });
  await page.evaluate(() => { $('bDexOk').click(); togglePause(); }); await page.waitForTimeout(150);
  // 마지막 보스 연습: 변신까지, 지면 마을로
  await page.evaluate(() => { togglePause(); $('bDexP').click(); }); await page.waitForTimeout(200);
  await page.evaluate(() => startPractice('boss_final')); await page.waitForTimeout(2200);
  const f = await page.evaluate(() => ({ name: SH.G.boss && SH.G.boss.name, final: !!(SH.G.boss && SH.G.boss.final) }));
  console.log('final practice', JSON.stringify(f)); check(f.name === '왕관 괴물 대왕' && f.final, 'final practice wrong');
  await page.evaluate(() => { SH.skipIntro(); SH.G.p.inv = 0; SH.G.p.hp = 1; SH.kill(); }); await page.waitForTimeout(4800);   // 등장 장면 중엔 게임이 멈춤
  const dd = await page.evaluate(() => ({ mode: SH.G.mode, st: !!SH.G.st, dead: SH.G.p.dead, rt: SH.G.respawnT, state: SH.state, intro: !!SH.G.intro, deadT: SH.G.deadT }));
  console.log('after death', JSON.stringify(dd)); check(dd.mode === 'base' && !dd.st, 'practice death did not return home');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
