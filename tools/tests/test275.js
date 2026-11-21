// Build 359: 기록실 5칸 — 🪙 쓴 금화 · 🗿 동상 · 🎟 재도전권 · 💖 금화 부활 · 🥋 특훈
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; localStorage.setItem('stickhero_meta', JSON.stringify({ statue: 7, lastBuild: 9999 })); });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  await page.evaluate(() => { ST.goldSpent = 12345; ST.retries = 2; ST.goldRevives = 3; ST.trains = 4; }); await page.click('#bStats'); await page.waitForTimeout(300);
  const t = await page.evaluate(() => [...document.querySelectorAll('.st')].map(e => e.textContent)); const has = (a, b) => t.some(x => x.includes(a) && x.includes(b));
  console.log(t.length); check(t.length === 70 && has('쓴 금화', '12,345') && has('영웅 동상', 'Lv 7') && has('재도전권', '2장') && has('금화 부활', '3번') && has('동료 특훈', '4번'), 'stat rows');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
