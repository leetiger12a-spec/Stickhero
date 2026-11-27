// Build 382: 👑 최종 보스 걷기 시트 — 걷는 동안 칸이 바뀌고, 8번·12번 칸(홀 사라짐·✦ 표시)은 안 씀
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1400); await page.click('#bStart'); await page.waitForTimeout(400);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; G.spawnAcc = -1e9; window.__bossN = 1; SH.spawnBoss(); endIntro(); const B = G.boss;
    B.final = true; B.spr = 'boss_final'; B.x = G.p.x + 170; B.y = G.p.y - 40; B.mode = 'walk'; B.st = 9;
    const W = SPR.boss_final_walk, seen = new Set(); const d = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (img, sx) { if (img === W && arguments.length > 5) seen.add(Math.round(sx / (W.width / 12))); return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 1500)); CanvasRenderingContext2D.prototype.drawImage = d; return { loaded: !!W, f: [...seen].sort((a, b) => a - b) }; });
  console.log('final walk frames', r);
  check(r.loaded && r.f.length >= 8 && !r.f.includes(7) && !r.f.includes(11), 'final boss walk sheet');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
