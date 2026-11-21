// Build 338: 주간 도전 2개 — 💰 현상금 주간(현상금 1.5배·자주, 적 체력 1.1배) · ⛲ 행운 주간(분수 반값·시간 2배, 적 공격 1.15배)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => { const out = {}; for (const w of [null, 'bountyw', 'luckw']) { WEEKLY_FORCE = w; const m = readJSON(META_KEY) || {}; m.weeklyOn = !!w; writeJSON(META_KEY, m); startGame(); const G = SH.G, e = makeEnemy('grunt', 0, 0);
      out[w || 'none'] = { wk: G.weekly, hp: e.maxHp, dmg: e.dmg, prize: bountyPrize(), cost: fntCost(), dur: fntDur() }; } return { out, n: WEEKLY.length }; });
  console.log(JSON.stringify(r)); const o = r.out;
  check(r.n === 14 && o.bountyw.wk === 'bountyw' && Math.abs(o.bountyw.hp / o.none.hp - 1.1) < 0.01 && o.bountyw.prize === Math.round(o.none.prize * 1.5), 'bounty week');
  check(o.luckw.wk === 'luckw' && Math.abs(o.luckw.dmg / o.none.dmg - 1.15) < 0.01 && o.luckw.cost === 75 && o.luckw.dur === 240 && o.none.cost === 150, 'luck week');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
