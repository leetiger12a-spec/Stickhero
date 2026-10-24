// 📻 지원 요청 버튼: 누르면 비행기 출격 → 60초 대기 → 다시 사용, 적 없으면 안 씀, 보스는 폭격 절반
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file:///home/user/Stickhero/index.html');
  check(!(await page.isVisible('#bSos')), 'sos visible on title');
  await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.isVisible('#bSos'), 'sos not visible in game');
  // 적이 없으면 안 씀
  await page.evaluate(() => { SH.G.enemies.length = 0; });
  await page.tap('#bSos', { force: true }); await page.waitForTimeout(100);
  check(await page.evaluate(() => !SH.G.plane && !(SH.G.sosCd > 0)), 'sos used with no enemies');
  // 적 소환 후 사용
  await page.evaluate(() => { SH.spawnWave(); for (const e of SH.G.enemies) { e.x *= 0.4; e.y *= 0.4; } });
  await page.screenshot({ path: `${OUT}/b37_sos_ready.png` });
  await page.tap('#bSos', { force: true }); await page.waitForTimeout(700);
  const s1 = await page.evaluate(() => ({ plane: !!SH.G.plane, cd: SH.G.sosCd, radio: !!SH.G.radio, txt: document.getElementById('sosTx').textContent }));
  console.log('after tap', JSON.stringify(s1)); check(s1.plane && s1.cd > 55 && s1.radio, 'sos did not call plane');
  await page.screenshot({ path: `${OUT}/b37_sos_call.png` });
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/b37_sos_bomb.png` });
  // 대기 중엔 다시 못 부름
  for (let i = 0; i < 30 && await page.evaluate(() => !!SH.G.plane); i++) await page.waitForTimeout(200);
  await page.tap('#bSos', { force: true }); await page.waitForTimeout(150);
  check(await page.evaluate(() => !SH.G.plane), 'sos reused during cooldown');
  const txt = await page.evaluate(() => document.getElementById('sosTx').textContent); console.log('cooldown label', txt); check(/초$/.test(txt), 'cooldown label wrong');
  await page.screenshot({ path: `${OUT}/b37_sos_cd.png` });
  // 대기 끝 → 다시 가능 (E키)
  await page.evaluate(() => { SH.G.sosCd = 0.05; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => document.getElementById('bSos').classList.contains('ready')), 'not ready after cooldown');
  await page.keyboard.press('e'); await page.waitForTimeout(200);
  check(await page.evaluate(() => !!SH.G.plane), 'E key did not call');
  // 보스 폭격 절반
  const half = await page.evaluate(() => { SH.G.bombs.length = 0; SH.spawnBoss(); SH.skipIntro(); const bo = SH.G.boss; bo.hp = bo.maxHp = 10000; bo.inv = 0;
    SH.G.bombs.push({ x0: bo.x, y0: bo.y, x1: bo.x, y1: bo.y, t: 1, dur: 0.1, dmg: 100, drop: true }); return bo.hp; });
  await page.waitForTimeout(150);
  const lost = await page.evaluate(() => 10000 - SH.G.boss.hp); console.log('boss lost', lost); check(lost > 0 && lost <= 60 * 1.3, 'boss bomb not halved');
  // 일시정지·게임오버에서 숨김
  await page.evaluate(() => SH.killBase()); await page.waitForTimeout(2800);
  check(!(await page.isVisible('#bSos')), 'sos visible on game over');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
