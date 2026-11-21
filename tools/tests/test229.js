// Build 303: 🛒 상인 새 물건 — ⭐ 경험치 묶음 · 🛡 10초 무적
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const buy = k => page.evaluate(async k => { const G = SH.G; G.nextBoss = 999; G.gold = 1000; G.p.hp = G.p.maxHp = 1e9; const o = MERCH.find(x => x.k === k); G.merchant = { x: G.p.x, y: G.p.y, t: 40, k, price: o.price(1), hold: 0 }; const l0 = G.lvl, x0 = G.xp; await new Promise(q => setTimeout(q, 1600)); return { l: G.lvl - l0, x: G.xp - x0, inv: G.p.inv, gold: G.gold, m: !!G.merchant }; }, k);
  const x = await buy('xp'); console.log(JSON.stringify(x)); check((x.l > 0 || x.x > 0) && x.gold < 1000, 'xp bought');
  await page.evaluate(() => { document.querySelectorAll('.ov.show').forEach(o => o.classList.remove('show')); state = 'play'; SH.G.pending = 0; SH.G.p.inv = 0; });
  const g = await buy('guard'); console.log(JSON.stringify(g)); check(g.inv > 8 && g.gold < 1000, 'guard bought');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
