// Build 345: 👑 현상금 3연속 → 황금 현상금(보상 3배 + 큰 상자), 도망가면 연속 끊김
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__eliteChestP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G, w = () => new Promise(q => setTimeout(q, 200)); G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.t = 100; G.bt = 99999;
    const spawn = async () => { G.bountyT = 0.01; await w(); const e = G.enemies.find(x => x.bounty > 0 && !x.dead); e.phaseT = 0; e.eT = 99; e.shieldT = 0; return e; };
    const kill = e => { const g0 = G.gold; hurtEnemy(e, 1e13, 0, 1, 0); return G.gold - g0; };
    const out = { streaks: [] }; for (let i = 0; i < 3; i++) { const e = await spawn(); out.plain = kill(e); out.streaks.push(G.bountyStreak); }
    const gb = await spawn(); out.gold = !!gb.gbounty; const c0 = G.chests.filter(c => !c.small).length + (G.bag || []).length; out.gGot = kill(gb); out.chest = G.chests.filter(c => !c.small).length + (G.bag || []).length - c0; out.after = G.bountyStreak;
    const e1 = await spawn(); kill(e1); const e2 = await spawn(); e2.bounty = 0.05; await w(); out.broken = G.bountyStreak; out.st = ST.goldBounties; return out; });
  console.log(JSON.stringify(r)); check(r.streaks.join() === '1,2,3' && r.gold && r.gGot >= r.plain * 3 && r.chest >= 1 && r.after === 0 && r.broken === 0 && r.st >= 1, 'gold bounty streak');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
