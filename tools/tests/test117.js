// 🌟 탑 10층마다 대박 상자 + 첫 돌파 금고 보너스 (Build 163)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 9, bank: 0, ach: { floor10: true } })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 6; openMap(); }); await page.click('#bTower'); await page.waitForTimeout(200);
  await page.click('.tfl[data-f="10"]', { force: true }); await page.waitForTimeout(150);
  check(await page.evaluate(() => $('mapCard').textContent.includes('대박 상자') && $('mapCard').textContent.includes('🏦100')), 'card shows chest');
  await page.screenshot({ path: `${OUT}/b163_map.png` });
  const clearFloor = async f => {
    await page.evaluate(f => { showOv(null); state = 'play'; SH.tower(f); SH.G.p.hp = SH.G.p.maxHp = 1e7; }, f); await page.waitForTimeout(500);
    await page.evaluate(() => { SH.G.boss = null; SH.G.enemies.length = 0; stageClear(SH.G.p.x, SH.G.p.y); }); await page.waitForTimeout(300);
  };
  await page.evaluate(() => { const o = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, ...a) { if (String(t).includes('undefined')) window.__u = String(t); return o.call(this, t, ...a); }; });
  await clearFloor(10);
  check(await page.evaluate(() => !window.__u), 'undefined text on screen');
  const r = await page.evaluate(() => ({ clear: SH.G.st.clear, jack: (SH.G.chests || []).filter(c => c.jack).length, bank: JSON.parse(localStorage.getItem('stickhero_meta')).bank, best: JSON.parse(localStorage.getItem('stickhero_meta')).bestFloor, sub: SH.G.banner && SH.G.banner.sub }));
  console.log(JSON.stringify(r));
  check(r.clear && r.jack >= 1 && r.bank >= 100 && r.best === 10, 'floor 10 rewards');
  await page.screenshot({ path: `${OUT}/b163_chest.png` });
  // 다시 깨면 금고 보너스 없음, 상자는 또
  const bank1 = r.bank; await page.evaluate(() => { SH.G.chests = []; });
  await clearFloor(10);
  const r2 = await page.evaluate(() => ({ jack: (SH.G.chests || []).filter(c => c.jack).length, bank: JSON.parse(localStorage.getItem('stickhero_meta')).bank }));
  check(r2.jack >= 1 && r2.bank === bank1, 'second clear: chest yes, bank no');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
