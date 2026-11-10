// 화면 흔들림 켜기/끄기 (Build 122): 일시정지 🎚 버튼, 끄면 큰 폭발에도 화면이 안 흔들림, 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  // 세계 그리기 setTransform(DPR*SCALE, ...)의 이동값 e를 모아 흔들림 폭 재기
  const spread = () => page.evaluate(async () => { const xs = [], r = CanvasRenderingContext2D.prototype.setTransform; CanvasRenderingContext2D.prototype.setTransform = function (a, b, c, d, e, f) { if (arguments.length === 6 && Math.abs(a - DPR * SCALE) < 1e-6 && a !== DPR) xs.push(e); return r.apply(this, arguments); };
    for (let i = 0; i < 10; i++) { SH.G.shake = 20; await new Promise(q => requestAnimationFrame(q)); } CanvasRenderingContext2D.prototype.setTransform = r; return xs.length ? Math.max(...xs) - Math.min(...xs) : -1; });
  const on = await spread(); console.log('on spread', on.toFixed(1)); check(on > 5, 'no shake when on');
  await page.evaluate(() => togglePause()); await page.click('#bShakeP'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !shakeOn && localStorage.getItem('stickhero_shake') === '0' && $('bShakeP').textContent.includes('끔')), 'toggle not saved');
  await page.click('#bResume'); const off = await spread(); console.log('off spread', off.toFixed(1)); check(off >= 0 && off < 0.5, 'shakes when off');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
