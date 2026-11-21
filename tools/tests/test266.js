// Build 350: 업적 3개(🗺 지도 5 · 💚 치유 정예 10 · 👑 황금 현상금 1) + 기록실 4칸
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => { const ids = ['tmap5', 'healel10', 'gbounty1']; checkAch(); const e = ids.map(i => !!((readJSON('stickhero_meta') || {}).ach || {})[i]);
    ST.tmaps = 5; ST.healElites = 10; ST.goldBounties = 1; ST.bankDeposits = 1234; checkAch(); const m = readJSON('stickhero_meta') || {}; return { n: ACH.length, e, got: ids.map(i => !!(m.ach || {})[i]) }; });
  console.log(JSON.stringify(r)); check(r.n === 83 && r.e.every(x => !x) && r.got.every(x => x), 'achievements');
  await page.click('#bStats'); await page.waitForTimeout(300);
  const t = await page.evaluate(() => [...document.querySelectorAll('.st')].map(e => e.textContent)); const has = (a, b) => t.some(x => x.includes(a) && x.includes(b));
  console.log(t.length); check(t.length === 65 && has('보물 지도', '5번') && has('치유 정예', '10마리') && has('황금 현상금', '1마리') && has('금고 저금', '1,234'), 'stat rows');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
