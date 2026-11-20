// Build 256: 💡 보스 팁 — 보스 등장 장면이 끝나면 아래 카드에 이기는 법, 보스마다 3번까지만
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bossN = 2; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const meet = () => page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; const el = document.getElementById('tipCard'); el.classList.remove('show'); el.textContent = '';
    SH.spawnBoss(); endIntro(); const r = { on: el.classList.contains('show'), t: el.textContent }; G.enemies = []; G.boss = null; return r; });
  const r1 = await meet(); console.log(JSON.stringify(r1));
  check(r1.on && r1.t.includes('불꽃 대마왕') && r1.t.includes('불길'), 'tip shown for fire boss');
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; SH.spawnBoss(); endIntro(); }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b256_tip.png` });
  await page.evaluate(() => { SH.G.enemies = []; SH.G.boss = null; });
  await meet(); const r4 = await meet(); check(!r4.on, 'no tip after 3 times');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
