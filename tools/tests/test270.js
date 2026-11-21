// Build 354: 🐱 동료 특훈 — 금화로 동료 경험치 +절반(2번이면 레벨업), 값이 오름, 동료 없으면 버튼 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r0 = await page.evaluate(() => { const G = SH.G; G.quests = []; G.gold = 2000; SH.openMap(); $('bSpend').onclick(); const none = !$('bSp_train'); G.allies.push(makeAlly('sword', 1, 0)); $('bSpend').onclick(); return { none, btn: !!$('bSp_train') }; });
  await page.click('#bSp_train'); await page.waitForTimeout(80);
  const r1 = await page.evaluate(() => { const a = SH.G.allies[0]; return { lvl: a.lvl, xp: a.xp, gold: SH.G.gold, next: trainCost() }; });
  await page.click('#bSp_train'); await page.waitForTimeout(80);
  const r2 = await page.evaluate(() => { const a = SH.G.allies[0]; return { lvl: a.lvl, gold: SH.G.gold, st: ST.trains, card: $('mapCard').textContent }; });
  console.log(JSON.stringify(r0), JSON.stringify(r1), JSON.stringify(r2));
  check(r0.none && r0.btn && r1.lvl === 1 && r1.xp === 30 && r1.gold === 1800 && r1.next === 300 && r2.lvl === 2 && r2.gold === 1500 && r2.st === 2 && r2.card.includes('레벨업'), 'ally training');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
