// Build 341: 🗺 보물 지도 — 나타남(하루 3번), ❌ 자리 3초 서 있으면 큰 상자, 떨어지면 진행이 줄어듦, 2분 지나면 사라짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bountyT = 999; window.__tmapT = 0.01; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const a = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.nextBoss = 999; G.spawnAcc = -1e9; G.enemies = []; G.t = 50; G.tmapT = 0.01; G.bountyT = 999;
    await new Promise(q => setTimeout(q, 200)); return { has: !!G.tmap, n: tmapUsed() }; });
  console.log(JSON.stringify(a)); check(a.has && a.n === 1, 'tmap appears');
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b341_far.png` });
  const r = await page.evaluate(async () => { const G = SH.G, m = G.tmap; window.__tmapT = 999; G.tmapT = 999; G.p.x = m.x; G.p.y = m.y; G.chests = []; const b0 = (G.bag || []).length; await new Promise(q => setTimeout(q, 1500)); const mid = G.tmap && G.tmap.dig;
    G.p.x = m.x + 300; await new Promise(q => setTimeout(q, 400)); const drop = G.tmap && G.tmap.dig;
    G.p.x = m.x; await new Promise(q => setTimeout(q, 3600)); return { mid, drop, gone: !G.tmap, chest: G.chests.filter(c => !c.small).length + (G.bag || []).length - b0, st: ST.tmaps }; });
  console.log(JSON.stringify(r)); check(r.mid > 1 && r.drop < r.mid && r.gone && r.chest >= 1 && r.st >= 1, 'tmap dig');
  const c = await page.evaluate(async () => { const G = SH.G, w = () => new Promise(q => setTimeout(q, 200)); G.tmapT = 0.01; await w(); const second = !!G.tmap; G.tmap.t = 999; await w(); const faded = !G.tmap;
    G.tmapT = 0.01; await w(); const third = !!G.tmap; G.tmap = null; G.tmapT = 0.01; await w(); return { second, faded, third, fourth: !!G.tmap, n: tmapUsed() }; });
  console.log(JSON.stringify(c)); check(c.second && c.faded && c.third && !c.fourth && c.n === 3, 'tmap limit');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
