// Build 319: 🔥 떠돌이 상인 반값 세일
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__msale = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.nextBoss = 999; G.merchT = 0.01; G.banner = null; await new Promise(q => setTimeout(q, 300)); const m = G.merchant, o = MERCH.find(x => x.k === m.k); return { sale: m.sale, p: m.price, full: o.price(G.lvl || 1), ban: G.banner && G.banner.text }; });
  console.log(JSON.stringify(r)); check(r.sale && r.p === Math.round(r.full * 0.5) && /반값/.test(r.ban), 'half price');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
