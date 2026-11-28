// Build 401: 🎴 내 영웅 카드 — 기록실 버튼 → 카드 그리기(등급·칭호·기록 8칸), 저장 버튼(다운로드), 닫기, 오류 0
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, acceptDownloads: true });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bestFloor: 23, maxStage: 12, ach: { boss1: 1 }, title: 'boss1' })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1500);
  await page.click('#bStats'); await page.waitForTimeout(300); await page.click('#bHeroCard'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => { const c = $('hcCv').getContext('2d').getImageData(360, 300, 1, 1).data; return { show: $('heroCard').classList.contains('show'), g: heroGrade()[0], px: c[3], cards: ST.heroCards }; });
  console.log(JSON.stringify(r)); check(r.show && r.px === 255 && 'SABCD'.includes(r.g) && r.cards >= 1, 'card drawn');
  await page.screenshot({ path: `${OUT}/b401_herocard.png` });
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('#bHcSave')]);
  check(dl && dl.suggestedFilename() === 'legend_hero_card.png', 'save download');
  await page.click('#bHcOk'); await page.waitForTimeout(200); check(!(await page.evaluate(() => $('heroCard').classList.contains('show'))), 'closed');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
