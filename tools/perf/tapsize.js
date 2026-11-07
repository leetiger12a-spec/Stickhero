// 누르는 칸 크기 재기: 화면마다 보이는 버튼·카드·막대를 모아 폭×높이(px), 44px(애플 권장 최소 44pt)보다 작은 것 표시
// 사용: node tools/perf/tapsize.js   (http://localhost:8765 필요, 폰 화면 390×844)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const SEL = 'button, .card, .sbuy, .qsw, input[type=range], #bSos, #questBox, .mnode, .arow, .dex';
  const scan = name => page.evaluate(([name, SEL]) => {
    const seen = [], out = [];
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || r.bottom < 0 || r.top > innerHeight) continue;
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2, top = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, cx)), Math.min(innerHeight - 1, Math.max(0, cy)));
      if (!top || !(el === top || el.contains(top) || top.contains(el))) continue;   // 다른 화면 뒤에 가려진 것은 빼기
      if (!el.matches('.dex, .arow') && el.closest('.dex, .arow') && el !== el.closest('.dex, .arow')) continue;
      const lab = (el.id ? '#' + el.id : el.className ? '.' + String(el.className).split(' ')[0] : el.tagName) + ' ' + (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 14);
      const key = lab + Math.round(r.width) + 'x' + Math.round(r.height); if (seen.includes(key)) continue; seen.push(key);
      out.push({ name, lab, w: Math.round(r.width), h: Math.round(r.height) });
    }
    return out;
  }, [name, SEL]);
  const rows = [];
  const step = async (name, fn) => { if (fn) await page.evaluate(fn); await page.waitForTimeout(350); rows.push(...await scan(name)); };
  await step('시작 화면');
  await step('소리 크기', () => openVol());
  await step('시작 화면', () => $('bVolOk').click());
  await step('영구 강화', () => openShop()); await page.evaluate(() => $('bShopOk').click());
  await step('업적', () => openAch()); await page.evaluate(() => $('bAchOk').click());
  await page.click('#bStart'); await page.waitForTimeout(600);
  await step('게임 중 (마을)');
  await step('레벨업 카드', () => { SH.G.pending = 1; openLevelUp(); }); await page.evaluate(() => SH.choose(0));
  await step('일시정지', () => togglePause());
  await step('몬스터 도감', () => openDex()); await page.evaluate(() => $('bDexOk').click());
  await step('진화 도감', () => openEvo()); await page.evaluate(() => $('bEvoOk').click());
  await page.evaluate(() => $('bResume').click()); await page.waitForTimeout(200);
  await step('모험 지도', () => openMap());
  const small = rows.filter(r => Math.min(r.w, r.h) < 44);
  let last = '';
  for (const r of rows) { if (r.name !== last) { console.log('\n[' + r.name + ']'); last = r.name; } console.log((Math.min(r.w, r.h) < 44 ? ' ⚠ ' : '   ') + `${r.w}×${r.h}`.padEnd(9) + r.lab); }
  console.log(`\n합계 ${rows.length}개, 44px보다 작은 것 ${small.length}개`);
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close();
})();
