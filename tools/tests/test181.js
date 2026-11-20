// Build 251: 새 머리띠 4개 (주황 32·민트 40·은빛 52·다이아 66별) — 별이 모자라면 잠김, 모이면 골라서 영웅 색이 바뀜
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bestStars: 45 })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900);
  const r = await page.evaluate(() => { openWard(); const bs = [...document.querySelectorAll('#wardGrid .sw')].slice(0, HEADBANDS.length); return { n: HEADBANDS.length, lock: bs.map(b => b.classList.contains('lock')) }; });
  console.log(JSON.stringify(r));
  check(r.n === 12, 'twelve bands'); check(!r.lock[8] && !r.lock[9] && r.lock[10] && r.lock[11], 'locks by stars (45)');
  await page.screenshot({ path: `${OUT}/b251_bands.png` });
  const ok = await page.evaluate(() => { const bs = [...document.querySelectorAll('#wardGrid .sw')]; bs[9].click(); return bandSel === 9; });
  check(ok, 'select mint');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
