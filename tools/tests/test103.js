// 기록실 새 칸 (Build 146): 펫 최고 레벨·최고 콤보·동굴·대박 상자·필살기·보스 러시·화난 보스·보름달 — 기록 값이 그대로 보임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.evaluate(() => { Object.assign(ST, { petXp: { kitten: 320 }, bestCombo: 88, caves: 2, jacks: 3, ults: 41, rushes: 1, rageKills: 7, moons: 2 }); });
  await page.click('#bStats'); await page.waitForTimeout(200);
  const t = await page.evaluate(() => [...document.querySelectorAll('#statList .st')].map(e => e.textContent)); console.log(t.slice(14).join(' / '));
  check(t.length === 22, 'not 22'); const s = t.join('|');
  check(['고양이 Lv3', '콤보88', '2번', '3개', '41번', '완주1번', '처치7', '밤2'].every(k => s.replace(/ /g, '').includes(k.replace(/ /g, ''))), 'values missing');
  await page.screenshot({ path: `${OUT}/b146_stats.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
