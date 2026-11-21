// Build 321: 🚀 질주 주간(영웅 1.25배 빠름·적 체력 1.15) · 💎 구슬 주간(구슬 1.5배·적 공격 1.15)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const G = SH.G, s0 = G.p.speed, h0 = makeEnemy('grunt', 0, 0).maxHp, d0 = makeEnemy('grunt', 0, 0).dmg; G.weekly = 'dashw'; recalcStats(); const s1 = G.p.speed, h1 = makeEnemy('grunt', 0, 0).maxHp; G.weekly = 'gemw'; recalcStats(); const d1 = makeEnemy('grunt', 0, 0).dmg; return { s: s1 / s0, h: h1 / h0, d: d1 / d0 }; });
  console.log(JSON.stringify(r)); check(Math.abs(r.s - 1.25) < 0.01 && Math.abs(r.h - 1.15) < 0.01 && Math.abs(r.d - 1.15) < 0.01, 'weeklies');
  const x = await page.evaluate(async () => { const G = SH.G; G.weekly = 'gemw'; G.xp = 0; G.need = 1000; G.gems.push({ x: G.p.x, y: G.p.y, v: 10, bob: 0 }); await new Promise(q => setTimeout(q, 300)); return G.xp; }); console.log('xp', x); check(x === 15, 'gem 1.5x');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
