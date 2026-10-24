const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  { const _nc = browser.newContext.bind(browser); browser.newContext = async o => { const c = await _nc(o); await c.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} }); return c; }; }
  const errors = [];
  const check = (c, m) => { if (!c) errors.push(m); };
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
  const stand = async (i, ms) => { for (let k = 0; k < ms / 200; k++) { await pick(); await page.evaluate(i => { const G = SH.G, pd = G.pads[i]; G.p.logs = G.p.cap; G.gold = Math.max(G.gold, 200); G.p.x = pd.x; G.p.y = pd.y + (pd.kind === 'tower' && G.towers[pd.idx].lvl ? 40 : pd.kind === 'smith' && G.smith ? 30 : 0); }, i); await page.waitForTimeout(200); } };
  await page.goto('file:///home/user/Stickhero/index.html');
  await page.tap('#bStart');
  await stand(0, 1200);  // 망루
  await stand(4, 1600);  // 울타리
  await stand(5, 2000);  // 대장간
  const sm = await page.evaluate(() => ({ smith: SH.G.smith, forge: SH.G.forge, dmg: SH.G.p.dmgMul }));
  console.log('smith', JSON.stringify(sm));
  check(sm.smith && sm.forge >= 1, 'smith/forge failed');
  await page.evaluate(() => { SH.G.p.x = -60; SH.G.p.y = 30; SH.G.gold = 0; });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b5_01_smith.png` });
  // 스테이지 2번 클리어 → 대습격 예고
  await page.evaluate(() => { SH.enterStage(); SH.returnBase(true); SH.enterStage(); SH.returnBase(true); });
  await pick();
  const ri = await page.evaluate(() => SH.G.raidIn);
  console.log('raidIn', ri); check(ri > 0, 'raid not scheduled');
  await page.evaluate(() => { SH.G.raidIn = 0.1; SH.G.p.hp = SH.G.p.maxHp = 99999; SH.give('sword', 5); SH.give('pistol', 5); });
  for (let k = 0; k < 40; k++) { await pick(); await page.waitForTimeout(250); }
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b5_02_raid.png` });
  // 가속해서 습격 종료까지
  const r = await page.evaluate(() => {
    const G = SH.G; G.base.maxHp = G.base.hp = 1e6;
    for (let i = 0; i < 30 * 200 && G.raid; i++) {
      if (SH.state === 'levelup') SH.choose(0);
      for (const e of G.enemies) if (e.raid && G.raid.t > G.raid.dur) e.hp = 0, e.dead = true, G.kills++;
      if (G.boss && G.raid && G.raid.t > G.raid.dur) G.boss.hp = 1;
      update(1 / 30);
    }
    return { raid: !!G.raid, gold: G.gold, raidCount: G.raidCount, t: Math.round(G.t) };
  });
  console.log('raid end', JSON.stringify(r)); check(!r.raid && r.gold >= 60, 'raid did not finish');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b5_03_raid_win.png` });
  await browser.close();
  console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e));
  process.exit(errors.length ? 1 : 0);
})();
