const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2];
const URL = 'file:///home/user/Stickhero/index.html';
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const check = (c, m) => { if (!c) errors.push(m); };
  async function run(name, opts, fn) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${name}] pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${name}] console: ${m.text()}`); });
    await page.goto(URL);
    await fn(page);
    await ctx.close();
  }
  await run('mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, async page => {
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_01_title.png` });
    await page.tap('#bStart');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_02_start.png` });
    // 조이스틱 이동
    await page.mouse.move(200, 600); await page.mouse.down(); await page.mouse.move(200, 650, { steps: 5 });
    await page.waitForTimeout(1200); await page.mouse.up();
    const py = await page.evaluate(() => SH.G.p.y);
    console.log('joystick y', py); check(py > 150, 'joystick move failed');
    // 나무 옆으로 → 자동 벌목
    await page.evaluate(() => { const t = SH.G.trees[0]; SH.G.p.x = t.x - 22; SH.G.p.y = t.y + 4; });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_02_chop.png` });
    const logs = await page.evaluate(() => SH.G.p.logs);
    console.log('logs after chop', logs); check(logs >= 3, 'chopping failed');
    // 통나무 들고 첫 망루 자리 → 건설
    await page.evaluate(() => { SH.G.p.logs = 12; const pd = SH.G.pads[0]; SH.G.p.x = pd.x; SH.G.p.y = pd.y; });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_03_paying.png` });
    await page.waitForTimeout(1500);
    const tl = await page.evaluate(() => SH.G.towers[0].lvl);
    console.log('tower lvl', tl); check(tl >= 1, 'tower not built');
    // 울타리 자리 열림 → 강화
    await page.evaluate(() => { SH.gold(50); SH.G.p.logs = 12; const pd = SH.G.pads[4]; SH.G.p.x = pd.x; SH.G.p.y = pd.y; });
    await page.waitForTimeout(2000);
    const wl = await page.evaluate(() => SH.G.wallLvl);
    console.log('wall lvl', wl); check(wl >= 2, 'wall not upgraded');
    // 시간을 진행시켜 적이 울타리를 공격하게
    await page.evaluate(() => { SH.G.p.x = 0; SH.G.p.y = 70; SH.G.t = 80; SH.G.p.hp = SH.G.p.maxHp = 5000; SH.G.towers.forEach(t => t.lvl = Math.max(t.lvl, 1)); SH.spawnWave(); });
    await page.waitForTimeout(9000);
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
    const st = await page.evaluate(() => ({ dmgWalls: SH.G.walls.filter(w => w.hp < w.maxHp).length, kills: SH.G.kills, gold: SH.G.gold, coins: SH.G.coins.length }));
    console.log('after wave', JSON.stringify(st));
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_04_wave.png` });
    // 영웅 쓰러짐 → 부활
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } SH.kill(); });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_05_dead.png` });
    await page.evaluate(() => { SH.G.respawnT = 0.2; });
    await page.waitForTimeout(600);
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
    check(await page.evaluate(() => !SH.G.p.dead), 'respawn failed');
    // 보스
    await page.evaluate(() => { SH.G.nextBoss = 0.01; SH.G.p.hp = SH.G.p.maxHp = 9999; });
    await page.waitForTimeout(1200);
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } const b = SH.G.boss; b.x = 0; b.y = -230; });
    await page.waitForTimeout(3500);
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_06_boss.png` });
    // 마을 파괴 → 게임오버
    await page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } SH.killBase(); });
    await page.waitForTimeout(3500);
    const s2 = await page.evaluate(() => SH.state);
    check(s2 === 'over', 'game over not reached: ' + s2);
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_07_over.png` });
    await page.tap('#bRetry'); await page.waitForTimeout(300);
    check(await page.evaluate(() => SH.state === 'play' && SH.G.gold === 0 && SH.G.p.logs === 0), 'retry failed');
  });
  await run('desktop', { viewport: { width: 1280, height: 800 } }, async page => {
    await page.click('#bStart');
    await page.keyboard.down('d'); await page.waitForTimeout(1000); await page.keyboard.up('d');
    check(await page.evaluate(() => SH.G.p.x) > 80, 'keyboard move failed');
    // 10분 가속 시뮬레이션 (영웅은 마을 근처에서 대기, 금화 자동 투자)
    const r = await page.evaluate(() => {
      const G = SH.G; let maxE = 0, pi = 0;
      for (let i = 0; i < 600 * 30; i++) {
        if (SH.state === 'levelup') SH.choose(Math.floor(Math.random() * 3));
        if (SH.state === 'allypick') SH.chooseAlly(Math.floor(Math.random() * 2));
        if (SH.state === 'over') break;
        if (i % 90 === 0 && !G.p.dead) { G.p.logs = G.p.cap; const pd = G.pads[pi++ % G.pads.length]; G.p.x = pd.x; G.p.y = pd.y + (pd.kind === "tower" && G.towers[pd.idx].lvl ? 40 : 0); }
        update(1 / 30);
        maxE = Math.max(maxE, G.enemies.length);
      }
      return { state: SH.state, t: Math.round(G.t), lvl: G.lvl, kills: G.kills, base: Math.round(G.base.hp), wallLvl: G.wallLvl, towers: G.towers.map(t => t.lvl), maxE, bosses: G.bossCount };
    });
    console.log('sim:', JSON.stringify(r));
    await page.screenshot({ path: `${process.env.OUT||OUT||'.'}/b3_08_desktop.png` });
  });
  await browser.close();
  console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e));
  process.exit(errors.length ? 1 : 0);
})();
