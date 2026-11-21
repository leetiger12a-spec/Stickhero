// Build 356: 🏪 상인 단골 레벨 — 400/800/1500, 상인이 더 자주(간격 ×0.55 at Lv3), Lv3이면 60초 머무름, 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__msale = false; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.gold = 3000; SH.openMap(); $('bSpend').onclick(); });
  for (let i = 0; i < 3; i++) { await page.click('#bSp_merchlv'); await page.waitForTimeout(60); }
  const r = await page.evaluate(async () => { const G = SH.G; const out = { gold: G.gold, lv: G.merchLv, btn: !!$('bSp_merchlv') }; showOv(null); state = 'play'; G.nextBoss = 999; G.merchant = null; G.merchT = 0.01; G.banner = null;
    await new Promise(q => setTimeout(q, 300)); out.t = G.merchant && G.merchant.t; G.merchant = null; out.next = G.merchT; saveGame(); out.saved = JSON.parse(localStorage.getItem(SAVE_KEY)).merchLv; return out; });
  console.log(JSON.stringify(r)); check(r.gold === 300 && r.lv === 3 && !r.btn && r.t > 55 && r.next < 210 * 0.55 + 1 && r.saved === 3, 'merchant level');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
