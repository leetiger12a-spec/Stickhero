// 레벨업 카드 다시 뽑기 (Build 113): 한 판에 2번, 누르면 카드가 새로 나옴, 0이면 못 누름, 동료 고용 화면엔 없음, 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const names = () => page.evaluate(() => [...document.querySelectorAll('#cards .card .nm')].map(e => e.textContent).join('|'));
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.pending = 1; openLevelUp(); });
  check(await page.evaluate(() => $('bReroll').textContent.includes('(2)') && !$('bReroll').disabled), 'reroll button wrong');
  await page.screenshot({ path: `${OUT}/b113_reroll.png` });
  const seen = new Set([await names()]); await page.click('#bReroll'); await page.waitForTimeout(150); seen.add(await names());
  check(await page.evaluate(() => SH.G.rerolls === 1 && SH.state === 'levelup' && $('bReroll').textContent.includes('(1)')), 'count not 1');
  await page.click('#bReroll'); await page.waitForTimeout(150); seen.add(await names()); console.log('different sets', seen.size);
  check(seen.size >= 2, 'cards did not change'); check(await page.evaluate(() => SH.G.rerolls === 0 && $('bReroll').disabled), 'not disabled at 0');
  await page.evaluate(() => $('bReroll').onclick()); check(await page.evaluate(() => SH.G.rerolls === 0), 'went below 0');
  await page.evaluate(() => SH.choose(0)); await page.waitForTimeout(150); check(await page.evaluate(() => SH.state === 'play'), 'choose broken');
  // 저장
  check(await page.evaluate(() => { saveGame(); return JSON.parse(localStorage.getItem('stickhero_save')).rerolls === 0; }), 'rerolls not saved');
  // 동료 고용 화면엔 안 보임
  const ally = await page.evaluate(() => { const G = SH.G; G.tavern = true; const pd = G.pads.find(q => q.kind === 'tavern'); if (pd) pd.built = true; try { openAllyPick(); } catch (e) { return 'err ' + e.message; } return $('cardTools').style.display; });
  console.log('ally tools display', ally); check(ally === 'none' || ally.startsWith('err'), 'tools shown in ally pick');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
