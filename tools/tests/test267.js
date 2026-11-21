// Build 351: 🪙 금화 쓰기 창 + 🗿 영웅 동상 — 금화를 내고 단계 올림(영구), 공격·체력 +2%/단계, 마을에 동상 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bountyT = 999; window.__tmapT = 999; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r0 = await page.evaluate(() => { const G = SH.G; G.quests = []; G.gold = 2000; SH.openMap(); return { dmg: G.p.dmgMul, hp: G.p.maxHp }; });
  await page.click('#bSpend'); await page.click('#bSp_statue'); await page.waitForTimeout(100); await page.click('#bSp_statue'); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b351_spend.png` });
  const r1 = await page.evaluate(() => { const G = SH.G; return { gold: G.gold, lv: statueLv(), meta: (readJSON(META_KEY) || {}).statue, dmg: G.p.dmgMul, hp: G.p.maxHp, spent: ST.goldSpent, btn: !!$('bSp_statue'), card: $('mapCard').textContent }; });
  console.log(JSON.stringify(r0), JSON.stringify(r1));
  check(r1.gold === 2000 - 500 - 1000 && r1.lv === 2 && r1.meta === 2 && Math.abs(r1.dmg / r0.dmg - 1.04) < 1e-6 && r1.hp > r0.hp && r1.spent === 1500 && !r1.btn && r1.card.includes('모자라요'), 'statue');
  await page.evaluate(() => { const G = SH.G; showOv(null); state = 'play'; const P = statuePos(); G.p.x = P.x + 70; G.p.y = P.y + 30; G.cam.x = G.p.x; G.cam.y = G.p.y; statueC = 12; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b351_statue.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
