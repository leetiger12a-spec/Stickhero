// 일시정지 능력치 (Build 115): 일시정지하면 공격력·공격 빠르기·이동 속도·최대 체력·자석·통나무 + 무기 목록, 능력을 올리면 숫자가 바뀜
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const read = () => page.evaluate(() => [...document.querySelectorAll('#pauseStats .ps')].map(e => e.textContent));
  await page.evaluate(() => togglePause()); await page.waitForTimeout(150); let r = await read(); console.log(r.join(' / '));
  check(r.length === 7 && r[0].includes('+0%') && r[3].includes('100'), 'base stats wrong');
  await page.evaluate(() => togglePause()); await page.evaluate(() => { const G = SH.G; G.passives = { power: 2, haste: 2, hp: 1 }; G.weapons = { pistol: 3, ice: 6 }; recalcStats(); togglePause(); }); await page.waitForTimeout(150);
  r = await read(); console.log(r.join(' / ')); check(r[0].includes('+30%') && r[1].includes('+25%') && r[3].includes('125') && r[6].includes('Lv3') && r[6].includes('진화'), 'stats not updated');
  await page.screenshot({ path: `${OUT}/b115_pause.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
