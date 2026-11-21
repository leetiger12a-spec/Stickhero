// Build 311: 🔥 오늘의 보스 연속 승리 보너스 (+100/일, 최대 +500)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const win = d => page.evaluate(async d => { const G = SH.G; if (G.mode === 'stage') SH.returnBase(true); G.day = d; G.stageN = 6; G.p.hp = G.p.maxHp = 1e9; const b0 = bankGold(); startDBoss(); G.st.t = 99; for (let k = 0; k < 30 && !G.boss; k++) await new Promise(q => setTimeout(q, 100)); if (G.intro) endIntro(); hurtEnemy(G.boss, 1e12, 0, 1, 0); await new Promise(q => setTimeout(q, 200)); return [bankGold() - b0, ST.dbStreak]; }, d);
  const r = [await win(1), await win(2), await win(3), await win(5)]; console.log(JSON.stringify(r));
  check(r[0][0] === 400 && r[1][0] === 500 && r[2][0] === 600 && r[3][0] === 400 && r[3][1] === 1, 'streak bonus');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
