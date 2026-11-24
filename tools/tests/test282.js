// Build 374: 💰 황금 골렘은 황금 보스여도 걷기·공격 시트, 다른 보스는 황금이면 원래 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1400); await page.click('#bStart'); await page.waitForTimeout(400);
  const run = n => page.evaluate(async n => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.enemies = []; G.boss = null; G.spawnAcc = -1e9; window.__bossN = n; SH.spawnBoss(); endIntro(); const B = G.boss; B.golden = true; B.x = G.p.x + 170; B.y = G.p.y - 40; B.mode = 'walk'; B.st = 9;
    const W = SPR['boss' + n + '_walk']; let seen = 0; const d = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (img) { if (img === W && arguments.length > 5) seen++; return d.apply(this, arguments); };
    await new Promise(q => setTimeout(q, 500)); CanvasRenderingContext2D.prototype.drawImage = d; return seen; }, n);
  const g10 = await run(10), g1 = await run(1); console.log('golden boss10 walk draws', g10, '| golden boss1 walk draws', g1);
  check(g10 > 5 && g1 === 0, 'golden golem uses sheets, other golden bosses do not');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
