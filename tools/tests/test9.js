// 음악·효과음·SKYFANG 비행기 (http로 열어야 음악 파일을 불러옴)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('stickhero_story', '1'); } catch (e) {} });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const pick = () => page.evaluate(() => { while (SH.state === 'levelup' || SH.state === 'allypick') { if (SH.state === 'allypick') SH.chooseAlly(0); else SH.choose(0); } });
  await page.goto('http://localhost:8765/index.html');
  await page.tap('#bHelp');   // 첫 터치 → 오디오 시작
  for (let i = 0; i < 30 && !(await page.evaluate(() => bgmCur && bgmCur.key === 'title')); i++) await page.waitForTimeout(300);
  const a1 = await page.evaluate(() => ({ cur: bgmCur && bgmCur.key, n: Object.keys(AUD).length }));
  console.log('title audio', JSON.stringify(a1)); check(a1.cur === 'title', 'title bgm not playing');
  await page.tap('#bStart'); await page.waitForTimeout(600);
  for (let i = 0; i < 20 && !(await page.evaluate(() => bgmCur && bgmCur.key === 'a')); i++) await page.waitForTimeout(300);
  check(await page.evaluate(() => bgmCur && bgmCur.key === 'a'), 'village bgm not playing');
  const nS = await page.evaluate(() => SFX_FILES.filter(n => AUD[n]).length + '/' + SFX_FILES.length);
  console.log('sfx loaded', nS); check(nS.split('/')[0] === nS.split('/')[1], 'not all sfx loaded');
  check(await page.evaluate(() => ['hit', 'pop', 'bigBoom', 'bombBoom', 'build'].every(n => sampFor(n))), 'sampFor failed');
  await page.evaluate(() => { ['meow', 'stack', 'coinCombo', 'cheer', 'woosh', 'toss', 'plane'].forEach(n => { sfxLast[n] = 0; sfx(n); }); });
  // 보스 → 보스 음악
  await page.evaluate(() => { SH.G.p.hp = SH.G.p.maxHp = 1e6; SH.spawnBoss(); SH.skipIntro(); });
  for (let i = 0; i < 20 && !(await page.evaluate(() => bgmCur && bgmCur.key === 'boss')); i++) await page.waitForTimeout(300);
  check(await page.evaluate(() => bgmCur && bgmCur.key === 'boss'), 'boss bgm not playing');
  // 음악 끄기
  await page.evaluate(() => { SH.G.boss.hp = 0; killEnemy(SH.G.boss); }); await page.waitForTimeout(300); await pick();
  await page.evaluate(() => toggleMusic()); await page.waitForTimeout(300);
  check(await page.evaluate(() => !bgmCur && !musicOn), 'music off failed');
  await page.evaluate(() => toggleMusic());
  // SKYFANG 지원 폭격
  await page.evaluate(() => { const G = SH.G; G.boss = null; G.enemies = []; G.weapons = {}; G.p.x = 0; G.p.y = 260; for (let i = 0; i < 20; i++) G.enemies.push(makeEnemy('grunt', rand(-80, 80), 360 + rand(0, 60))); SH.plane(); });
  const k0 = await page.evaluate(() => SH.G.kills);
  let shot = 0;
  for (let i = 0; i < 40 && await page.evaluate(() => !!SH.G.plane); i++) {
    await pick();
    if (!shot && await page.evaluate(() => SH.G.bombs.length > 3)) { await page.evaluate(() => SH.G.banner = null); await page.screenshot({ path: (process.env.OUT||'.')+'/b23_plane.png' }); shot = 1; }
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(700); await pick();
  const k1 = await page.evaluate(() => SH.G.kills);
  console.log('plane kills', k1 - k0); check(k1 - k0 >= 5, 'plane bombing weak');
  await browser.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
