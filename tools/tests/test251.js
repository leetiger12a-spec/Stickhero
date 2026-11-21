// Build 335: 🛒 상인 새 물건 — 🧲 모두 끌어오기 · 🧪 행운 물약(1분 소원 효과)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__wish = 'atk'; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const buy = (k, prep) => page.evaluate(async ([k, prep]) => { const G = SH.G; G.nextBoss = 999; G.gold = 1000; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.spawnAcc = -1e9;
    if (prep) for (let i = 0; i < 8; i++) G.gems.push({ x: G.p.x + 600 + i * 10, y: G.p.y, v: 1, bob: 0, age: 0 });
    const o = MERCH.find(x => x.k === k); G.merchant = { x: G.p.x, y: G.p.y, t: 40, k, price: o.price(1), hold: 0 }; const d0 = G.p.dmgMul; await new Promise(q => setTimeout(q, 1600));
    return { gold: G.gold, pulled: G.gems.filter(g => g.pull).length, gems: G.gems.length, wish: G.wishK, t: G.wishT, dmg: G.p.dmgMul / d0, m: !!G.merchant, n: MERCH.length }; }, [k, prep]);
  const a = await buy('magnet', true); console.log(JSON.stringify(a)); check(a.gold < 1000 && !a.m && (a.pulled > 0 || a.gems < 8), 'magnet bought');
  const c = await buy('luck'); console.log(JSON.stringify(c)); check(c.gold < 1000 && c.wish === 'atk' && c.t > 55 && Math.abs(c.dmg - 1.25) < 1e-6 && c.n === 7, 'luck bought');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
