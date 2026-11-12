// 별 받기 연출 (Build 144): 클리어 화면 별은 도장처럼 쾅 (애니메이션), 별마다 이유 ✔/✖, 모은 별 수 (+늘어난 수), 새 펫이 열리면 "🐾 새 펫!"
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 4 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  // 별 4개 → 이번 판에 스테이지 별 2개 더 (6개 = 강아지 열림)
  await page.evaluate(() => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.stars = [3, 1]; G.stageN = 2; enterStage(2); G.intro = null; G.st.stars = 2; G.st.clear = true; returnBase(true); });
  await page.waitForTimeout(1300);
  const r = await page.evaluate(() => ({ st: SH.state, why: $('clrWhy').textContent, on: document.querySelectorAll('#clrStars span:not(.off)').length, anim: getComputedStyle(document.querySelector('#clrStars span:not(.off)')).animationName, info: $('clrInfo').textContent }));
  console.log(JSON.stringify(r));
  check(r.st === 'result' && r.on === 2 && r.anim === 'stamp', 'stars stamp'); check(r.why.includes('✔ ⭐1') && r.why.includes('✔ ⭐2') && r.why.includes('✖ ⭐3') && r.why.includes('모은 별 6') && r.why.includes('+2'), 'why line wrong');
  check(r.info.includes('새 펫') && r.info.includes('강아지'), 'new pet message');
  await page.screenshot({ path: `${OUT}/b144_clear.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
