// Build 336: 💰 현상금 몬스터 — 나타남(정예+현상금), 잡으면 금화, 시간 지나면 도망 / ⭐ 별똥별 소원(updWish)이 분수와 이름이 겹치지 않음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; window.__bountyT = 999; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.t = 100; G.bt = 99999; G.bountyT = 0.01;
    await new Promise(q => setTimeout(q, 300)); const e = G.enemies.find(x => x.bounty > 0); if (!e) return { spawned: false };
    e.x = G.p.x + 100; e.y = G.p.y - 30; G.cam.x = G.p.x; G.cam.y = G.p.y; await new Promise(q => setTimeout(q, 250)); return { spawned: true, elite: !!e.elite, t: e.bounty }; });
  console.log(JSON.stringify(r)); check(r.spawned && r.elite && r.t < 45, 'bounty spawned');
  await page.screenshot({ path: `${OUT}/b336_bounty.png` });
  const k = await page.evaluate(() => { const G = SH.G, e = G.enemies.find(x => x.bounty > 0), g0 = G.gold, p = bountyPrize(); hurtEnemy(e, 1e12, 0, 1, 0); return { got: G.gold - g0, p, st: ST.bounties }; });
  console.log(JSON.stringify(k)); check(k.got >= k.p && k.st >= 1, 'bounty paid');
  const esc = await page.evaluate(async () => { const G = SH.G; G.bountyT = 0.01; await new Promise(q => setTimeout(q, 300)); const e = G.enemies.find(x => x.bounty > 0); if (!e) return { ok: false }; const g0 = G.gold; e.bounty = 0.05; await new Promise(q => setTimeout(q, 300)); return { ok: true, gone: !G.enemies.includes(e) || e.dead, gold: G.gold - g0 }; });
  console.log(JSON.stringify(esc)); check(esc.ok && esc.gone && esc.gold < 50, 'bounty escapes');
  const w = await page.evaluate(async () => { const G = SH.G; G.fntK = 'atk'; G.fntT = 30; updWish(0.1, true); return { star: typeof G.wishT, fnt: G.fntT === 30, fn: typeof updFnt }; });
  console.log(JSON.stringify(w)); check(w.fnt && w.fn === 'function', 'wish names separate');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
