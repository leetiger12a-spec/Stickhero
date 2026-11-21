// Build 246: 이번 주 도전 새 2종 — 🗡 유리 대포(공격 1.5배·체력 절반) · 🎁 보물(정예 상자 2배·보스 작은 상자 하나 더)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ weeklyOn: true })); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const out = {};
    for (const w of ['giant', 'glass', 'treasure']) { WEEKLY_FORCE = w; startGame(); const G = SH.G; recalcStats(); out[w] = { wk: G.weekly, hp: G.p.maxHp, dmg: +G.p.dmgMul.toFixed(3) }; }
    // 보물 주간: 보스를 잡으면 상자 2개 (큰 것 + 작은 것)
    const G = SH.G; G.chests = []; G.enemies = []; SH.spawnBoss(); G.intro = null; killEnemy(G.boss); out.chests = G.chests.length;
    WEEKLY_FORCE = 'giant'; startGame(); const G2 = SH.G; G2.chests = []; G2.enemies = []; SH.spawnBoss(); G2.intro = null; killEnemy(G2.boss); out.chests0 = G2.chests.length;
    return out;
  });
  console.log(JSON.stringify(r));
  check(r.glass.wk === 'glass' && r.glass.hp === Math.round(r.giant.hp / 2) && Math.abs(r.glass.dmg / r.giant.dmg - 1.5) < 0.01, 'glass cannon');
  check(r.treasure.wk === 'treasure' && r.chests === r.chests0 + 1, 'treasure boss chest');
  check(await page.evaluate(() => WEEKLY.length === 8), 'eight weeklies');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
