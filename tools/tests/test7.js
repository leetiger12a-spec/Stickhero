// 주의: http로 열어야 함 (python3 -m http.server 8765). file://로 새로고침하면 크롬이 가끔 저장소 전체를 비움
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  { const _nc = browser.newContext.bind(browser); browser.newContext = async o => { const c = await _nc(o); await c.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} }); return c; }; } const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  let page = await ctx.newPage();
  const hook = pg => { pg.on('pageerror', e => errors.push('pageerror: ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); }); };
  hook(page);
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick' || SH.state === 'result' || SH.state === 'map') { if (SH.state === 'result' || SH.state === 'map') { SH.ok(); continue; } if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
  await page.goto('http://localhost:8765/index.html');
  check(await page.evaluate(() => getComputedStyle(document.getElementById('bContinue')).display === 'none'), 'continue shown without save');
  await page.tap('#bStart');
  // 진행 상황 만들기 (게임 함수로 직접)
  const before = await page.evaluate(() => {
    const G = SH.G;
    const stand = (i, steps) => { for (let k = 0; k < steps; k++) { if (SH.state === 'levelup') SH.choose(0); if (SH.state === 'result' || SH.state === 'map') SH.ok(); const pd = G.pads[i]; G.p.logs = G.p.cap; G.gold = Math.max(G.gold, 2000); G.p.x = pd.x; G.p.y = pd.y + padOY(pd); update(1 / 30); } };
    stand(0, 60); stand(4, 90); stand(1, 90); stand(5, 120); const ti = G.pads.findIndex(p => p.kind === 'tavern'); stand(ti, 200);
    SH.give('sword', 3); G.stageN = 3; G.p.logs = 7; G.gold = 777; G.walls[2].hp = 5;
    if (SH.state === 'levelup') SH.choose(0); if (SH.state === 'result' || SH.state === 'map') SH.ok();
    saveGame();
    return { towers: G.towers.map(t => t.lvl).join(''), wall: G.wallLvl, smith: G.smith, forge: G.forge, tavern: G.tavern, allies: G.allies.length, stageN: G.stageN, gold: G.gold, lvl: G.lvl, sword: G.weapons.sword };
  });
  console.log('before', JSON.stringify(before));
  // 새로고침 → 제목 화면에 이어하기
  await page.waitForTimeout(1200);   // 저장이 디스크에 반영될 시간 (바로 새로고침하면 크롬이 아직 안 써서 저장이 없는 것처럼 보임)
  await page.reload();
  await page.waitForTimeout(300);
  check(await page.evaluate(() => getComputedStyle(document.getElementById('bContinue')).display !== 'none'), 'continue button missing');
  console.log('info:', await page.evaluate(() => document.getElementById('saveInfo').innerText.replace(/\n/g, ' / ')));
  await page.screenshot({ path: (process.env.OUT||'.')+'/b15_title.png' });
  // 새로 시작 한 번만 누르면 지워지지 않아야 함
  await page.tap('#bStart'); await page.waitForTimeout(200);
  check(await page.evaluate(() => SH.state === 'title' && !!localStorage.getItem('stickhero_save')), 'single tap on new start wiped save');
  await page.screenshot({ path: (process.env.OUT||'.')+'/b15_confirm.png' });
  await page.tap('#bContinue'); await page.waitForTimeout(500); await pick();
  const after = await page.evaluate(() => { const G = SH.G; return { towers: G.towers.map(t => t.lvl).join(''), wall: G.wallLvl, smith: G.smith, forge: G.forge, tavern: G.tavern, allies: G.allies.length, stageN: G.stageN, gold: G.gold, lvl: G.lvl, sword: G.weapons.sword, wall2: G.walls[2].hp, logs: G.p.logs }; });
  console.log('after ', JSON.stringify(after));
  for (const k of ['towers', 'wall', 'smith', 'forge', 'tavern', 'allies', 'stageN', 'lvl', 'sword']) check(before[k] === after[k], 'mismatch ' + k);
  check(after.gold >= 777 && after.wall2 === 5 && after.logs === 7, 'gold/wall/logs not restored');
  await page.waitForTimeout(800);
  await page.screenshot({ path: (process.env.OUT||'.')+'/b15_continued.png' });
  // 마을 붕괴 → 저장 삭제, 대장간 강화 유지
  const forge = after.forge;
  await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick' || SH.state === 'result' || SH.state === 'map') { if (SH.state === 'result' || SH.state === 'map') { SH.ok(); continue; } if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } SH.killBase(); });
  await page.waitForTimeout(3000);
  check(await page.evaluate(() => SH.state === 'over' && !localStorage.getItem('stickhero_save')), 'save not cleared on game over');
  await page.screenshot({ path: (process.env.OUT||'.')+'/b15_over.png' });
  await page.tap('#bRetry'); await page.waitForTimeout(300);
  check(await page.evaluate(f => SH.G.forge === f && SH.G.towers[0].lvl === 0, forge), 'forge not kept / village not reset');
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
