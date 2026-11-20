// Build 242: 새 업적 6개 — 조건을 채우면 달성, 모자라면 아님, 동료 교대가 횟수에 쌓임
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const ids = ['skull5', 'bossAll', 'fast30', 'bstar3', 'goldB3', 'swap10'];
  const got = () => page.evaluate(ids => { checkAch(); const m = JSON.parse(localStorage.getItem('stickhero_meta')) || {}; return ids.map(i => !!(m.ach || {})[i]); }, ids);
  check((await got()).every(x => !x), 'too early ' + await got());
  // 교대: 동료 3명 고용 → 쉬는 동료를 10번 출동
  const sw = await page.evaluate(() => { const G = SH.G; for (const t of ['sword', 'archer', 'bomber']) hireAlly(t); for (let i = 0; i < 10; i++) swapAlly(false, 0); return ST.swaps; });
  check(sw === 10, 'swaps ' + sw);
  await page.evaluate(() => { for (const n of SKULLS) ST.bossT.push(n); for (const d of DEX.filter(d => d.boss)) ST.bk[d.boss] = 1; ST.bk[BOSSES[0].name] = 20; ST.bfast = { [BOSSES[0].name]: 25 }; ST.goldB.push('a', 'b', 'c'); });
  const r = await got(); console.log(JSON.stringify(r)); check(r.every(Boolean), 'not all achieved ' + r);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
