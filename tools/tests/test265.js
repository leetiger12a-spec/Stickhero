// Build 349: 주간 2개 — 🗺 탐험 주간(지도 하루 5번·2배 자주, 적 공격 1.1배) · 🛒 큰손 주간(상인 30% 할인, 적 체력 1.1배)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__msale = false; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(async () => { const out = {}; for (const w of [null, 'tmapw', 'bigw']) { WEEKLY_FORCE = w; const m = readJSON(META_KEY) || {}; m.weeklyOn = !!w; writeJSON(META_KEY, m); startGame(); const G = SH.G, e = makeEnemy('grunt', 0, 0);
      G.nextBoss = 999; G.merchT = 0.01; G.banner = null; await new Promise(q => setTimeout(q, 250)); const M = G.merchant, o = M && MERCH.find(x => x.k === M.k);
      out[w || 'none'] = { wk: G.weekly, hp: e.maxHp, dmg: e.dmg, max: tmapMax(), ratio: M ? M.price / o.price(G.lvl || 1) : null }; } return { out, n: WEEKLY.length }; });
  console.log(JSON.stringify(r)); const o = r.out;
  check(r.n === 16 && o.tmapw.wk === 'tmapw' && o.tmapw.max === 5 && o.none.max === 3 && Math.abs(o.tmapw.dmg / o.none.dmg - 1.1) < 0.01, 'explore week');
  check(o.bigw.wk === 'bigw' && Math.abs(o.bigw.hp / o.none.hp - 1.1) < 0.01 && Math.abs(o.bigw.ratio - 0.7) < 0.02 && Math.abs(o.none.ratio - 1) < 0.01, 'big spender week');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
