// 얼음 바닥 그림 (Build 136): tex_ice 불러오기, 얼음 나라 스테이지(11칸~)에서 바닥 그림으로 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => !!TEX.ice && TEX.ice.width === 1024), 'ice texture not loaded');
  const idx = await page.evaluate(() => STAGES.findIndex(s => THEMES[s.th].tex === 'ice')); console.log('first ice stage', idx); check(idx >= 10, 'no ice stage');
  await page.evaluate(i => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; enterStage(i); G.intro = null; G.enemies = []; G.st.groups.forEach(g => g.done = true); }, idx); await page.waitForTimeout(600);
  // 바닥 색이 단색(#dfeefa) 하나만이 아니라 무늬가 있는지: 화면 아래쪽 픽셀 여러 개의 색 수
  const shot = await page.screenshot({ path: `${OUT}/b136_ice.png` });
  const kinds = await page.evaluate(() => { const c = document.querySelector('canvas'), x = c.getContext('2d'), d = x.getImageData(c.width * 0.2, c.height * 0.38, c.width * 0.3, 40).data, s = new Set(); for (let i = 0; i < d.length; i += 16) s.add((d[i] >> 3) + ',' + (d[i + 1] >> 3) + ',' + (d[i + 2] >> 3)); return s.size; });
  console.log('ground colours', kinds); check(kinds > 12, 'ground looks flat');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
