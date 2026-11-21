// Build 299: ✨ 황금 주간(황금 5배) · ❤ 하트 주간(적 공격 1.2배)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G, cnt = w => { G.weekly = w; let n = 0; for (let i = 0; i < 30000; i++) if (makeEnemy('grunt', 0, 0).golden) n++; return n; }; const a = cnt(null), g = cnt('goldw'); G.weekly = null; const d0 = makeEnemy('grunt', 0, 0).dmg; G.weekly = 'heartw'; const d1 = makeEnemy('grunt', 0, 0).dmg; G.weekly = null; return { a, g, k: d1 / d0 }; });
  console.log(JSON.stringify(r)); check(r.g > r.a * 3 && Math.abs(r.k - 1.2) < 0.01, 'gold/heart weeks');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
