// Build 355: 💰 현상금 의뢰 — 금화를 내면 바로 현상금(4단계 전이라도), 놓치면 절반 돌려받음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.quests = []; G.gold = 1000; G.nextBoss = 999; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.spawnAcc = -1e9; SH.openMap(); $('bSpend').onclick(); });
  await page.click('#bSp_breq'); await page.waitForTimeout(80);
  const r = await page.evaluate(async () => { const G = SH.G, g1 = G.gold, again = !!$('bSp_breq'); showOv(null); state = 'play'; await new Promise(q => setTimeout(q, 900)); const e = G.enemies.find(x => x.bounty > 0 && !x.dead);
    if (!e) return { g1, again, spawned: false, tier: tierNow() }; const req = e.breq; e.bounty = 0.05; await new Promise(q => setTimeout(q, 300)); return { g1, again, spawned: true, req, tier: tierNow(), g2: G.gold, next: breqCost() }; });
  console.log(JSON.stringify(r)); check(r.g1 === 750 && !r.again && r.spawned && r.req === 250 && r.tier < 1 && r.g2 >= 875 && r.next === 300, 'bounty request');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
