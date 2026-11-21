// Build 334: 🌀 오늘의 보스 특기 순간이동 — 멀리 있으면 영웅 뒤로 휙
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.stageN = 6; G.dbossDay = 0; G.p.hp = G.p.maxHp = 1e9; window.__dboss = { n: 2, mod: 6 }; startDBoss(); G.st.t = 99;
    for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); const B = G.boss; B.mode = 'walk'; B.st = 9; B.blinkCd = 0.05; B.x = G.p.x; B.y = G.p.y - 400;
    await new Promise(q => setTimeout(q, 300)); return { blink: !!B.blink, n: G.blinks || 0, d: Math.hypot(B.x - G.p.x, B.y - G.p.y), mods: DBOSS_MOD.length, card: dbossHtml().includes('순간이동') }; });
  console.log(JSON.stringify(r)); check(r.blink && r.n >= 1 && r.d < 260 && r.mods === 7 && r.card, 'dboss blink');
  await page.screenshot({ path: `${OUT}/b334_blink.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
