// Build 343: 🪞 오늘의 보스 특기 분신 — 체력 절반 아래로 가면 분신 2마리 (한 번만)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.stageN = 6; G.dbossDay = 0; G.p.hp = G.p.maxHp = 1e9; window.__dboss = { n: 2, mod: 7 }; startDBoss(); G.st.t = 99;
    for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); const B = G.boss; const n0 = G.enemies.filter(e => e.mirror).length;
    B.hp = B.maxHp * 0.45; await new Promise(q => setTimeout(q, 250)); const n1 = G.enemies.filter(e => e.mirror && !e.dead).length; B.hp = B.maxHp * 0.3; await new Promise(q => setTimeout(q, 250));
    const n2 = G.enemies.filter(e => e.mirror).length; const c = G.enemies.find(e => e.mirror); G.cam.x = c.x; G.cam.y = c.y; return { clone: !!B.clone, n0, n1, n2, mods: DBOSS_MOD.length }; });
  console.log(JSON.stringify(r)); check(r.clone && r.n0 === 0 && r.n1 === 2 && r.n2 <= 2 && r.mods === 8, 'dboss clones');
  await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b343_clone.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
