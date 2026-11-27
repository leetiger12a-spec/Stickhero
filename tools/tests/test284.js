// Build 383: 👑 최종 보스 점프 공격 시트 — 점프일 때만 칸이 바뀌고, 2번·12번 칸(홀 사라짐·✦)은 안 씀 · 펀치일 때는 원래 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__bossN = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200); await page.click('#bStart'); await page.waitForTimeout(400);
  const run = rv => page.evaluate(async rv => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; G.spawnAcc = -1e9; window.__bossN = 1; SH.spawnBoss(); endIntro(); const B = G.boss; B.final = true; B.spr = 'boss_final'; B.x = G.p.x + 160; B.y = G.p.y - 40;
    const A = SPR.boss_final_atk, seen = {}, d = CanvasRenderingContext2D.prototype.drawImage; let cur = 'x';
    CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === A && arguments.length > 5) (seen[cur] = seen[cur] || new Set()).add(Math.round(sx / (A.width / 12))); return d.apply(this, arguments); };
    const R = Math.random; Math.random = () => rv; startSpecial(B, 0, 0, 1); Math.random = R; const fk = B.fk, t0 = performance.now();
    while (performance.now() - t0 < 4000) { cur = B.mode === 'jumpWind' ? 'wind' : B.mode === 'jump' ? 'jump' : 'land'; await new Promise(q => setTimeout(q, 16)); if (fk !== 'jump' && performance.now() - t0 > 1500) break; if (B.mode === 'walk' && B.landT && G.t - B.landT > 0.7) break; }
    CanvasRenderingContext2D.prototype.drawImage = d; const all = new Set(Object.values(seen).flatMap(s => [...s]));
    return { fk, loaded: !!A, wind: [...(seen.wind || [])], jump: [...(seen.jump || [])], land: [...(seen.land || [])], all: [...all] }; }, rv);
  const j = await run(0), p = await run(0.2); console.log(JSON.stringify(j), JSON.stringify(p));
  check(j.fk === 'jump' && j.loaded && j.wind.some(f => f <= 2) && j.jump.some(f => f >= 3 && f <= 6) && j.land.some(f => f >= 7), 'final jump uses attack sheet');
  check(!j.all.includes(1) && !j.all.includes(11), 'final skips frames 2 and 12');
  check(p.fk === 'punch' && p.all.length === 0, 'final punch keeps old picture');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
