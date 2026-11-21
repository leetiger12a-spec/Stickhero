// Build 357: 퀘스트 3종 — 🪙 금화 쓰기 N · 🗿 동상 1단계 · 🐱 동료 특훈
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.gold = 5000; G.allies.push(makeAlly('sword', 1, 0)); G.quests = [{ id: 'spend', goal: 600, prog: 0, done: false }, { id: 'statue', goal: 1, prog: 0, done: false }, { id: 'train', goal: 1, prog: 0, done: false }]; SH.openMap(); $('bSpend').onclick(); });
  await page.click('#bSp_statue'); await page.waitForTimeout(60);
  const mid = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.prog + ':' + x.done).join(' '));
  await page.click('#bSp_train'); await page.waitForTimeout(60);
  const q = await page.evaluate(() => SH.G.quests.map(x => x.id + ':' + x.done)); console.log(mid, '|', q.join(' '));
  check(mid.startsWith('spend:500:false') && q.every(x => x.endsWith(':true')), 'spend quests');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
