// 하루 퀘스트: 날마다 3개, 진행·완료 보상·하루 완료 보너스, 접기, 저장, 다음 날 새 퀘스트
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(400);
  const q0 = await page.evaluate(() => SH.G.quests.map(q => q.id));
  console.log('day1 quests', q0.join()); check(q0.length === 3 && new Set(q0).size === 3 && !q0.includes('stage') && !q0.includes('ally') && !q0.includes('repair') && !q0.includes('tower'), 'day1 quest pool wrong');
  check(await page.isVisible('#questBox'), 'quest box hidden');
  await page.screenshot({ path: `${OUT}/b45_quests.png` });
  // 정해진 퀘스트로 진행 확인
  await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'wood', goal: 3, prog: 0, done: false }, { id: 'kill', goal: 2, prog: 0, done: false }, { id: 'special', goal: 1, prog: 0, done: false }]; G.questBonus = false; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; });
  const g0 = await page.evaluate(() => SH.G.gold);
  // 통나무 3개
  await page.evaluate(() => { const G = SH.G, t = G.trees.find(t => t.logs > 0); G.p.x = t.x + 20; G.p.y = t.y; });
  for (let i = 0; i < 30 && !(await page.evaluate(() => SH.G.quests[0].done)); i++) await page.waitForTimeout(100);
  check(await page.evaluate(() => SH.G.quests[0].done), 'wood quest not done');
  // 적 2마리 (특수 적 1마리 포함)
  await page.evaluate(() => { const G = SH.G; G.p.x = 0; G.p.y = 92; for (const t of ['grunt', 'e_slime']) { const e = makeEnemy(t, 500, 500); G.enemies.push(e); hurtEnemy(e, 1e6, 0, 1, 0); } });
  const st = await page.evaluate(() => ({ q: SH.G.quests.map(q => q.done), bonus: SH.G.questBonus, gold: SH.G.gold }));
  console.log('after', JSON.stringify(st), 'gold before', g0); check(st.q.every(Boolean) && st.bonus && st.gold >= g0 + 3 * 60 + 150, 'quest rewards/bonus wrong');
  await page.waitForTimeout(1800); await page.screenshot({ path: `${OUT}/b45_done.png` });
  check(await page.evaluate(() => (JSON.parse(localStorage.getItem('stickhero_meta')).questDays || 0) >= 1), 'questDays not counted');
  // 접기
  await page.click('#questBox'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('questBox').textContent.includes('▸')), 'fold failed');
  await page.click('#questBox');
  // 저장 → 이어하기 유지
  await page.evaluate(() => { SH.G.quests[1].done = false; SH.G.quests[1].prog = 1; saveGame(); });
  await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.quests[0].id === 'wood' && SH.G.quests[1].prog === 1 && SH.G.questBonus), 'quests not saved');
  // 다음 날: 새 퀘스트 (부서진 건물 많으면 고치기 퀘스트 가능)
  await page.evaluate(() => { const G = SH.G; G.towers.slice(0, 4).forEach(t => t.lvl = 2); G.pads.forEach(q => { if (q.kind === 'tower' && q.idx < 4) q.built = true; }); SH.killBase(); });
  await page.waitForTimeout(2800); await page.click('#bRetry'); await page.waitForTimeout(400);
  const d2 = await page.evaluate(() => ({ day: SH.G.day, ids: SH.G.quests.map(q => q.id), bonus: SH.G.questBonus, prog: SH.G.quests.map(q => q.prog) }));
  console.log('day2', JSON.stringify(d2)); check(d2.day === 2 && d2.ids.length === 3 && !d2.bonus && d2.prog.every(p => p === 0), 'day2 quests not new');
  // 고치기 이벤트
  const rep = await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'repair', goal: 1, prog: 0, done: false }]; const q = G.pads.find(q => q.kind === 'tower' && q.idx === 0); G.broken.t0 = true; padDone(q); return G.quests[0].done; });
  check(rep, 'repair quest event missing');
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b45_day2.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
