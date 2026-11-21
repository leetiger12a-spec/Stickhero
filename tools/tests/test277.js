// Build 362: 👑 대왕 슬라임 공격 시트 — 웅크리기·점프·착지 때 시트 칸이 바뀜(1~3 / 4~7 / 8~12), 평소엔 걷기 시트
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bossN = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.spawnAcc = -1e9; SH.spawnBoss(); endIntro(); const B = G.boss; B.x = G.p.x + 160; B.y = G.p.y - 40;
    const seen = {}, d = CanvasRenderingContext2D.prototype.drawImage; let cur = 'x';
    CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === SPR.boss0_atk && arguments.length > 5) { (seen[cur] = seen[cur] || new Set()).add(Math.round(sx / (SPR.boss0_atk.width / 12))); } return d.apply(this, arguments); };
    startSpecial(B, 0, 0, 1); const t0 = performance.now();
    while (performance.now() - t0 < 4000) { cur = B.mode === 'jumpWind' ? 'wind' : B.mode === 'jump' ? 'jump' : 'land'; await new Promise(q => setTimeout(q, 16)); if (B.mode === 'walk' && B.st > 0.5 && B.landT && G.t - B.landT > 0.7) break; }
    CanvasRenderingContext2D.prototype.drawImage = d; return { loaded: !!SPR.boss0_atk, wind: [...(seen.wind || [])], jump: [...(seen.jump || [])], land: [...(seen.land || [])] }; }).catch(e => ({ err: e.message }));
  console.log(JSON.stringify(r));
  check(r.loaded && r.wind && r.wind.some(f => f <= 2) && r.jump.some(f => f >= 3 && f <= 6) && r.land.some(f => f >= 7), 'boss attack frames');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
