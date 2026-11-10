// 마을 위험 경고 (Build 119): 마을 체력 30% 아래면 알림 1번(30초에 1번) + 말풍선 + 빨간 가장자리, 30% 넘으면 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(3300);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.banner = null; G.base.hp = G.base.maxHp * 0.5; }); await page.waitForTimeout(200);
  check(await page.evaluate(() => !baseDanger() && !(SH.G.banner && SH.G.banner.text.includes('위험'))), 'warned at 50%');
  await page.evaluate(() => { SH.G.base.hp = SH.G.base.maxHp * 0.2; }); await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({ d: baseDanger(), ban: SH.G.banner && SH.G.banner.text, say: SH.G.say && SH.G.say.kind, at: SH.G.dangerAt })); console.log(JSON.stringify(r));
  check(r.d && r.ban.includes('위험') && r.say === 'danger', 'no warning');
  await page.screenshot({ path: `${OUT}/b119_danger.png` });
  await page.evaluate(() => { SH.G.banner = null; }); await page.waitForTimeout(500); check(await page.evaluate(() => !SH.G.banner), 'warned again too soon');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
