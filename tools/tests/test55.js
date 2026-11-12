// 얼음 나라 2단계 (Build 95): 얼음판에서 미끄러짐(손을 떼도 주르륵), 눈보라(영웅 0.75배·적 0.8배, 화면 눈발), 다른 테마엔 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const setup = await page.evaluate(() => { const G = SH.G; G.stageN = 15; enterStage(11);   /* Build 158 */ G.intro = null; G.st.groups.forEach(g => g.done = true); G.enemies = []; G.p.hp = G.p.maxHp = 1e6; G.st.blizT = 999;
    const c = G.st.ice[0]; G.st.ice = [{ x: 0, y: -600, r: 400 }]; G.p.x = -100; G.p.y = -600; return { patches: c ? 1 : 0 }; });
  check(setup.patches === 1, 'no ice patches in ice stage');
  // 얼음판: 오른쪽으로 0.6초 → 손 떼고 0.5초 동안 더 미끄러짐
  const slide = async () => { await page.keyboard.down('d'); await page.waitForTimeout(600); await page.keyboard.up('d'); const x0 = await page.evaluate(() => SH.G.p.x); await page.waitForTimeout(500); return await page.evaluate(() => SH.G.p.x) - x0; };
  const sIce = await slide();
  await page.evaluate(() => { const G = SH.G; G.st.ice = [{ x: 0, y: 9999, r: 1 }]; G.p.x = -100; G.p.y = -600; G.p.ivx = G.p.ivy = 0; });
  const sDry = await slide();
  console.log('slide after release: ice', sIce.toFixed(1), 'normal', sDry.toFixed(1)); check(sIce > 15 && Math.abs(sDry) < 3, 'ice sliding wrong');
  // 눈보라
  const bz = await page.evaluate(async () => { const G = SH.G, B = window.banner, seen = []; window.banner = function (t) { seen.push(t); return B.apply(this, arguments); }; G.st.blizT = 0.01;
    await new Promise(r => setTimeout(r, 200)); window.banner = B; return { on: G.st.blizOn, seen }; });
  console.log('blizzard', JSON.stringify(bz)); check(bz.on > 5 && bz.seen.some(t => t.includes('눈보라')), 'blizzard did not start');
  const sp = await page.evaluate(async () => { const G = SH.G; G.p.x = -150; const x0 = G.p.x; keys.d = true; await new Promise(r => setTimeout(r, 500)); keys.d = false; return (G.p.x - x0) / 0.5 / G.p.speed; });
  console.log('speed ratio in blizzard', sp.toFixed(2)); check(sp > 0.6 && sp < 0.85, 'blizzard slow wrong');
  await page.screenshot({ path: `${OUT}/b95_blizzard.png` });
  await page.waitForTimeout(6000); check(await page.evaluate(() => SH.G.st.blizOn <= 0), 'blizzard did not stop');
  // 다른 테마(숲 1칸)에는 없음
  check(await page.evaluate(() => { returnBase(false); enterStage(0); return !SH.G.st.ice && SH.G.st.blizT === undefined; }), 'ice in forest stage');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
