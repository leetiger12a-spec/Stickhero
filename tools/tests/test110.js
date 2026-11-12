// 새 버전 선물 (Build 154): 처음 하는 사람은 선물 없음(버전만 기록), 예전 버전 기록이 있으면 📬 버튼 → 금고 +100, 한 번만
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const st = () => page.evaluate(() => ({ show: $('bMail').style.display !== 'none', m: JSON.parse(localStorage.getItem('stickhero_meta')) || {} }));
  let s = await st(); check(!s.show && s.m.lastBuild === await page.evaluate(() => BUILD), 'first player got mail');
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.lastBuild = 150; m.bank = 10; localStorage.setItem('stickhero_meta', JSON.stringify(m)); }); await page.reload(); await page.waitForTimeout(700);
  s = await st(); check(s.show && (await page.evaluate(() => $('bMail').textContent)).includes('150'), 'mail not shown for old build');
  await page.screenshot({ path: `${OUT}/b154_mail.png` });
  await page.click('#bMail', { force: true });   /* 통통 튀는 버튼이라 force */ await page.waitForTimeout(100); s = await st(); console.log('bank', s.m.bank, 'lastBuild', s.m.lastBuild); check(s.m.bank === 110, 'gift not given');
  await page.reload(); await page.waitForTimeout(700); s = await st(); check(!s.show && s.m.bank === 110, 'mail twice');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
