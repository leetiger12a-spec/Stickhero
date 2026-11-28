// Build 403: 🎴 영웅 카드 등급 보상 — 처음 오른 등급까지 금고 보너스 합산(카드를 열 때 C 200 → 그다음 B 400 · S까지 오르면 A 800+S 1500), 같은 등급 다시는 없음, 업적 2개
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, acceptDownloads: true });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bestFloor: 23, maxStage: 12, ach: { boss1: 1 }, title: 'boss1' })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1500);
  await page.click('#bStats'); await page.waitForTimeout(300); await page.click('#bHeroCard'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const bank = () => (readJSON(META_KEY) || {}).bank || 0; const b0 = bank();
    window.heroGrade = () => ['B', '#6bd6ff']; const a1 = checkGrade(), b1 = bank(); const a2 = checkGrade();
    window.heroGrade = () => ['S', '#ffd23f']; const a3 = checkGrade(); const A = ACH.find(x => x.id === 'gradeS').p(), B = ACH.find(x => x.id === 'gradeA').p();
    return { a1, d1: b1 - b0, a2, a3, A, B, best: readJSON(META_KEY).hcBest }; });
  console.log(JSON.stringify(r)); check(r.a1 === 400 && r.d1 === 400 && r.a2 === 0 && r.a3 === 2300 && r.best === 4 && r.A[0] === 1 && r.B[0] === 1, 'grade bonus');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
