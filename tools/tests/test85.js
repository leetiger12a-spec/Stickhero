// 칭호 색 등급 (Build 126): 업적 보상 크기로 동·은·보라·무지개, 업적 화면 칭호 버튼과 영웅 머리 위 칭호 색이 다름
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  check(await page.evaluate(() => [titleTier(50), titleTier(150), titleTier(400), titleTier(800)].join() === '0,1,2,3'), 'tier thresholds');
  // 업적 4개 달성 처리 (동·은·보라·무지개)
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.ach = { tower1: true, evo1: true, ghost10: true, ice15: true }; localStorage.setItem('stickhero_meta', JSON.stringify(m)); openAch(); });
  await page.waitForTimeout(150);
  const cls = await page.evaluate(() => [...document.querySelectorAll('#achList .arow button')].map(b => b.className.trim())); console.log(cls.join(' | '));
  check(['tier0', 'tier1', 'tier2', 'tier3'].every(t => cls.some(c => c.includes(t))), 'tier classes missing');
  await page.screenshot({ path: `${OUT}/b126_ach.png` });
  // 무지개 칭호 달기 → 게임 속 테두리 색이 바뀜
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta')); m.title = 'ice15'; localStorage.setItem('stickhero_meta', JSON.stringify(m)); $('bAchOk').click(); });
  await page.click('#bStart'); await page.waitForTimeout(600);
  const st = await page.evaluate(async () => { const seen = new Set(); const d = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle'); Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', { set(v) { if (String(v).startsWith('hsl')) seen.add(v); d.set.call(this, v); }, get() { return d.get.call(this); }, configurable: true });
    for (let i = 0; i < 6; i++) await new Promise(q => requestAnimationFrame(q)); Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', d); return [...seen].length; });
  console.log('rainbow stroke colors', st); check(st >= 2, 'rainbow title not animated');
  const w = await page.evaluate(() => { const G = SH.G; return [G.p.x, G.p.y]; }); await page.screenshot({ path: `${OUT}/b126_title.png`, clip: { x: 120, y: 300, width: 150, height: 160 } });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
