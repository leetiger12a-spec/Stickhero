// 게임오버 판 요약 (Build 116): 최고 콤보·치명타·유령 상자·아이템·무지개 구슬·버틴 밤 + 무기 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; Object.assign(G, { bestCombo: 77, crits: 12, ghostCaught: 2, itemsUsed: 3, rainbows: 1, nights: 4 }); G.weapons = { pistol: 6, star: 2 }; SH.killBase(); });
  await page.waitForTimeout(3000);
  const t = await page.evaluate(() => [SH.state, $('overStats').textContent, document.querySelectorAll('#overStats .runW img').length]); console.log(JSON.stringify(t));
  check(t[0] === 'over', 'not game over'); check(['77', '12', '유령 상자 2', '아이템 3', '구슬 1', '밤 4'].every(k => t[1].includes(k)), 'summary values missing'); check(t[2] === 2, 'weapon icons missing');
  await page.screenshot({ path: `${OUT}/b116_over.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
