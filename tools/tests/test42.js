// 소리 크기 (Build 70): 시작 화면·일시정지에서 열기, 음악·효과음 막대가 실제 소리 크기를 바꾸고, 새로고침 뒤에도 기억
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bVolT'); await page.waitForTimeout(200);
  const g0 = await page.evaluate(() => ({ st: state, m: musicBus.gain.value, s: master.gain.value })); console.log('default', JSON.stringify(g0));
  check(g0.st === 'vol' && Math.abs(g0.s - 0.6) < 0.01 && Math.abs(g0.m - 0.32) < 0.01, 'default volumes not like before');
  await page.evaluate(() => { const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input')); }; set('volS', 20); set('volM', 0); });
  const g1 = await page.evaluate(() => ({ m: musicBus.gain.value, s: master.gain.value, txt: document.getElementById('volSv').textContent })); console.log('set', JSON.stringify(g1));
  check(Math.abs(g1.s - 0.15) < 0.01 && g1.m === 0 && g1.txt === '20%', 'sliders did not change gain');
  await page.screenshot({ path: `${OUT}/b70_vol.png` });
  await page.click('#bVolOk'); await page.waitForTimeout(150); check(await page.evaluate(() => state === 'title'), 'not back to title');
  await page.reload(); await page.waitForTimeout(700); await page.click('#bStart'); await page.waitForTimeout(300);
  const g2 = await page.evaluate(() => ({ s: master.gain.value, m: musicBus.gain.value })); console.log('after reload', JSON.stringify(g2)); check(Math.abs(g2.s - 0.15) < 0.01 && g2.m === 0, 'volume not remembered');
  await page.click('#bPause'); await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/b70_pause.png` });
  await page.click('#bVolP'); await page.waitForTimeout(150); check(await page.evaluate(() => state === 'vol' && document.getElementById('volS').value === '20'), 'pause vol screen wrong');
  await page.click('#bVolOk'); await page.waitForTimeout(150); check(await page.evaluate(() => state === 'paused'), 'not back to pause');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
