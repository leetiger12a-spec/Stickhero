// Build 307: 📅 오늘의 보스 특기 2개 더 — ❄ 얼음 몸(닿으면 느려짐) · 👥 부하 거느림(졸개 6마리)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const go = mod => page.evaluate(async mod => { const G = SH.G; if (G.mode === 'stage') SH.returnBase(true); G.stageN = 6; G.dbossDay = 0; G.p.hp = G.p.maxHp = 1e9; window.__dboss = { n: 2, mod }; startDBoss(); G.st.t = 99; for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); return { boss: !!G.boss, ice: !!G.boss.dice, n: G.enemies.filter(e => !e.boss).length }; }, mod);
  const a = await go(4), c = await go(5); console.log(JSON.stringify(a), JSON.stringify(c));
  check(a.ice && c.n >= 6 && await page.evaluate(() => DBOSS_MOD.length === 8), 'new mods');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
