// 11칸 다시 세팅 (Build 158, 아들 의견): 11칸은 '숲' — 초록 숲 땅·숲 장식, 보스 숲 골렘, 얼음 나라(얼음 땅)는 12칸부터
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ s11: STAGES[10].name, tex11: THEMES[STAGES[10].th].tex, boss11: STAGES[10].boss, tex12: THEMES[STAGES[11].th].tex, firstIce: STAGES.findIndex(s => THEMES[s.th].tex === 'ice') }));
  console.log(JSON.stringify(r)); check(r.s11 === '숲' && r.tex11 === 'grass' && r.boss11 === 9 && r.tex12 === 'ice' && r.firstIce === 11, 'stage 11 setup wrong');
  // 들어가서 보스 확인 + 사진
  const bs = await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.stageN = 15; enterStage(10); G.intro = null; G.enemies = []; G.p.y = -G.st.L * 0.4; G.cam.y = G.p.y - 12; return { ice: !!G.st.ice, name: G.st.def.name }; });
  check(!bs.ice, 'ice patches in forest'); await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/b158_forest.png` });
  const boss = await page.evaluate(() => { const G = SH.G; SH.spawnBoss(); G.intro = null; return G.boss && G.boss.name; }); console.log('boss', boss); check(boss === '숲 골렘', 'boss not 숲 골렘');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
