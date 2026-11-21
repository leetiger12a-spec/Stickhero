// Build 331: ⛲ 소원 분수 — 금화를 내면 2분 행운, 하루 3번, 값이 오름, 끝나면 원래대로
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const r0 = await page.evaluate(() => { const G = SH.G; G.quests = []; G.gold = 1000; window.__fnt = 'atk'; SH.openMap(); return { dmg: G.p.dmgMul, spd: G.p.speed }; });
  await page.click('#bFnt'); await page.click('#bGoFnt'); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b331_wish.png` });
  const r1 = await page.evaluate(() => { const G = SH.G; return { gold: G.gold, k: G.fntK, t: G.fntT, dmg: G.p.dmgMul, card: $('mapCard').textContent, cost: fntCost(), left: fntLeft() }; });
  console.log(JSON.stringify(r0), JSON.stringify(r1));
  check(r1.gold === 850 && r1.k === 'atk' && r1.t === 120 && Math.abs(r1.dmg / r0.dmg - 1.25) < 1e-6 && r1.cost === 250 && r1.left === 2 && r1.card.includes('소원 이뤄짐'), 'wish 1');
  await page.evaluate(() => { window.__fnt = 'spd'; }); await page.click('#bGoFnt'); await page.evaluate(() => { window.__fnt = 'hp'; }); await page.click('#bGoFnt');
  const r2 = await page.evaluate(() => { const G = SH.G; return { gold: G.gold, k: G.fntK, left: fntLeft(), btn: !!$('bGoFnt'), card: $('mapCard').textContent, st: ST.fountains }; });
  console.log(JSON.stringify(r2)); check(r2.gold === 850 - 250 - 350 && r2.k === 'hp' && r2.left === 0 && !r2.btn && r2.card.includes('내일'), 'wish limit');
  const r3 = await page.evaluate(async () => { const G = SH.G; showOv(null); state = 'play'; const hp0 = G.p.maxHp; G.fntT = 0.05; await new Promise(q => setTimeout(q, 300)); return { hp0, hp1: G.p.maxHp, t: G.fntT }; });
  console.log(JSON.stringify(r3)); check(r3.t === 0 && r3.hp1 < r3.hp0, 'wish end');
  await page.evaluate(() => { const G = SH.G; G.fntK = 'gold'; G.fntT = 60; const g0 = G.gold; for (let i = 0; i < 5; i++) G.coins.push({ x: G.p.x, y: G.p.y - 10, vx: 0, vy: 0, z: 0, vz: 0, pull: true, age: 0 }); window.__g0 = g0; });
  await page.waitForTimeout(300); const r4 = await page.evaluate(() => SH.G.gold - window.__g0); console.log('gold+', r4); check(r4 === 10, 'gold x2');
  await page.screenshot({ path: `${OUT}/b331_hud.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
