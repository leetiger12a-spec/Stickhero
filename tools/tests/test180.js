// Build 250: ⚔ 보스 대결 왕국 (모험 21~25칸) — 첫 보스를 잡으면 두 번째 보스, 둘 다 잡아야 클리어 · 25칸 정복 화면 · 성장은 20칸 그대로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({ n: STAGES.length, duel: STAGES.slice(20).map(d => BOSSES[d.boss].name + '+' + BOSSES[d.boss2].name), grow: GROW_STAGE }));
  console.log(JSON.stringify(info)); check(info.n === 25 && info.duel.length === 5 && info.grow === 20, 'stages');
  const r = await page.evaluate(async () => {
    const G = SH.G; G.stageN = 20; G.stars = Array(20).fill(1); enterStage(20); G.intro = null; G.p.hp = G.p.maxHp = 1e9; G.enemies = [];
    G.p.y = -G.st.L + 200; await new Promise(q => setTimeout(q, 400)); G.intro = null;
    const b1 = G.boss && G.boss.name; killEnemy(G.boss); const after1 = { clear: !!G.st.clear, state: SH.state };
    await new Promise(q => setTimeout(q, 500)); G.intro = null; const b2 = G.boss && G.boss.name;
    if (G.boss) killEnemy(G.boss); await new Promise(q => setTimeout(q, 300));
    return { b1, b2, after1, clear2: !!G.st.clear };
  });
  console.log(JSON.stringify(r));
  check(r.b1 === '바위 골렘 왕' && r.after1.clear === false, 'first boss does not clear');
  check(r.b2 === '번개 해골 왕' && r.clear2, 'second boss then clear');
  await page.evaluate(() => { returnBase(false); if (SH.state === 'result') SH.ok(); });
  const r2 = await page.evaluate(() => { const G = SH.G; G.stageN = 24; G.stars = Array(24).fill(1); enterStage(24); G.intro = null; G.st.stars = 1; G.st.clear = true; returnBase(true); return { t: $('clrTitle').textContent, n: G.stageN, ok: $('bClrOk').textContent }; });
  console.log(JSON.stringify(r2)); check(r2.t.includes('보스 대결 왕국 정복') && r2.n === 25 && !r2.ok.startsWith('성장'), 'duel conquer screen');
  check(await page.evaluate(() => { checkAch(); return !!((JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}).duel25); }), 'duel25 ach');
  await page.evaluate(() => { const n = document.querySelector('#bClrOk'); n && n.click(); }); await page.waitForTimeout(300);
  await page.evaluate(() => { SH.G.stageN = 21; openMap(); const n = document.querySelector('.mnode[data-i="22"]'); n && n.scrollIntoView({ block: 'center' }); }); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/b250_map.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
