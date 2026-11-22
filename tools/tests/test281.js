// Build 367: 강철 거인·불꽃 대마왕·얼음 용 — 걷기 시트 칸이 바뀌고, 공격 땐 준비(wind) 칸 → 쏜 뒤(hit) 칸이 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1400); await page.click('#bStart'); await page.waitForTimeout(400);
  for (const n of [1, 2, 3, 4, 5]) {
    const r = await page.evaluate(async n => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; G.spawnAcc = -1e9; window.__bossN = n; SH.spawnBoss(); endIntro(); const B = G.boss; B.x = G.p.x + 170; B.y = G.p.y - 40;
      const k = 'boss' + n, W = SPR[k + '_walk'], A = SPR[k + '_atk'], walk = new Set(), wind = new Set(), hit = new Set(); let phase = 'walk';
      const d = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (arguments.length > 5) { if (img === W) walk.add(Math.round(sx / (W.width / 12))); if (img === A) (phase === 'wind' ? wind : hit).add(Math.round(sx / (A.width / 12))); } return d.apply(this, arguments); };
      B.mode = 'walk'; B.st = 9; await new Promise(q => setTimeout(q, 1200));
      phase = 'wind'; startSpecial(B, G.p.x - B.x, G.p.y - B.y, Math.hypot(G.p.x - B.x, G.p.y - B.y)); const m0 = B.mode;
      const t0 = performance.now(); while (B.mode === m0 && performance.now() - t0 < 4000) await new Promise(q => setTimeout(q, 16));
      phase = 'hit'; await new Promise(q => setTimeout(q, 700)); CanvasRenderingContext2D.prototype.drawImage = d;
      return { n, loaded: !!W && !!A, walk: walk.size, wind: [...wind].sort((a, b) => a - b), hit: [...hit].sort((a, b) => a - b) }; }, n);
    console.log(JSON.stringify(r));
    check(r.loaded && r.walk >= 8 && r.wind.length >= 3 && r.hit.some(f => f >= 6) || n === 5 && r.hit.some(f => f >= 9), 'boss' + n + ' anim');
    if (n === 5) check(!r.wind.includes(2) && !r.wind.includes(3) && !r.wind.includes(7) && !r.hit.includes(2) && !r.hit.includes(3) && !r.hit.includes(7), 'boss5 skips frames 3-4-8');
    if (n === 2) check(!r.wind.includes(3) && !r.wind.includes(4) && !r.hit.includes(3) && !r.hit.includes(4), 'boss2 skips frames 4-5');
  }
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
