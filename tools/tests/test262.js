// Build 346: 🏦 상인 금고 저금 — 낸 금화의 절반이 금고(영구)로, 세일이면 반값을 내고 그 절반
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const buy = price => page.evaluate(async price => { const G = SH.G; G.nextBoss = 999; G.gold = 1000; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.spawnAcc = -1e9; const bank = () => (readJSON(META_KEY) || {}).bank || 0, b0 = bank();
    G.merchant = { x: G.p.x, y: G.p.y, t: 40, k: 'bank', price, hold: 0 }; await new Promise(q => setTimeout(q, 1600)); return { paid: 1000 - G.gold, bank: bank() - b0, m: !!G.merchant, st: ST.bankDeposits }; }, price);
  const a = await buy(220), c = await buy(110); console.log(JSON.stringify(a), JSON.stringify(c));
  check(a.paid === 220 && a.bank === 110 && !a.m && c.paid === 110 && c.bank === 55 && c.st === 165, 'bank deposit');
  check(await page.evaluate(() => MERCH.length === 8 && MERCH.find(o => o.k === 'bank').price(1) === 220), 'merch list');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
