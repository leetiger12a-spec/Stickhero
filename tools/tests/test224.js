// Build 297: 📅 오늘의 보스 알림 — 마을에서 6초 뒤 1번 알림, 지도 무한 탑 버튼에 빨간 점 (도전하면 사라짐)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.stageN = 6; G.banner = null; G.t = 7; G.nextBoss = 999; await new Promise(q => setTimeout(q, 300)); const t = G.banner && G.banner.text; SH.openMap(); return { t, dot: document.getElementById('bTower').classList.contains('new') }; });
  console.log(JSON.stringify(r)); check(r.t && r.t.includes('오늘의 보스') && r.dot, 'banner + dot');
  const r2 = await page.evaluate(() => { SH.G.dbossDay = SH.G.day; SH.openMap(); return document.getElementById('bTower').classList.contains('new'); }); check(!r2, 'dot gone after try');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
