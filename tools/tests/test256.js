// Build 340: 기록실 새 칸 3개 — ⛲ 소원 분수 · 💰 현상금 몬스터 · 👻 유령 정예 (유령 상자와 따로)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.evaluate(() => { ST.fountains = 4; ST.bounties = 7; ST.ghostElites = 2; ST.ghosts = 9; }); await page.click('#bStats'); await page.waitForTimeout(300);
  const t = await page.evaluate(() => [...document.querySelectorAll('.st')].map(e => e.textContent));
  const has = (a, b) => t.some(x => x.includes(a) && x.includes(b)); console.log(t.length);
  check(has('소원 분수', '4번') && has('현상금 몬스터', '7마리') && has('유령 정예', '2마리') && has('유령 상자', '9'), 'new stat rows');
  await page.screenshot({ path: `${OUT}/b340_stats.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
