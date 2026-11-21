// Build 277: 주간 도전 2개 — ⚔ 정예 주간(정예 4배·금화 2배) · 👑 보스 주간(보스 1.6배 자주·금화 2배)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const cnt = id => page.evaluate(id => { const G = SH.G; G.weekly = id; G.lvl = 1; G.tierT = 9; window.tierNow = () => 2; let n = 0; for (let i = 0; i < 4000; i++) if (makeEnemy('grunt', 0, 0).elite) n++; return n; }, id);
  const n0 = await cnt(null), n1 = await cnt('elite'); console.log(n0, n1); check(n1 > n0 * 2.5 && n1 > 300, 'elite week 4x elites');
  const t = await page.evaluate(async () => { const G = SH.G; G.enemies = []; G.weekly = 'bossw'; G.nextBoss = 100; await new Promise(q => setTimeout(q, 1000)); const a = 100 - G.nextBoss; G.weekly = null; G.nextBoss = 100; await new Promise(q => setTimeout(q, 1000)); return [a, 100 - G.nextBoss]; });
  console.log(t); check(t[0] > t[1] * 1.3, 'boss week timer faster');
  check(await page.evaluate(() => WEEKLY.length === 16 && !!WEEKLY.find(w => w.id === 'bossw')), 'weeklies');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
