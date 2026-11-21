// Build 364: 🗺 모험 지도 땅 무늬 그림 — 테마마다 무늬(pattern) 6개가 쓰이고 그림이 불러와짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { SH.G.stageN = 24; SH.openMap(); }); await page.waitForTimeout(800);
  const r = await page.evaluate(() => ({ pats: document.querySelectorAll('#mapInner pattern').length, used: new Set([...document.querySelectorAll('#mapInner rect')].map(x => x.getAttribute('fill')).filter(f => f && f.startsWith('url(#mT'))).size }));
  console.log(JSON.stringify(r)); check(r.pats === 6 && r.used >= 6, 'map textures');
  await page.screenshot({ path: `${OUT}/b364_map.png` });
  await page.evaluate(() => { document.querySelector('#mapScroll').scrollTop = 0; }); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b364_map_top.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
