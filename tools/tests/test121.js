// ⚔ 정예 몬스터 (Build 168): 체력 4배·이름표, 방패(막음)·분열(3마리)·순간이동, 잡으면 작은 상자, 처음엔 안 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const r0 = await page.evaluate(() => { window.__eliteP = 1; const e = makeEnemy('grunt', 0, 0); return !!e.elite; });
  check(!r0, 'no elite at tier 0');
  const r = await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.bt = 9999; G.p.hp = G.p.maxHp = 1e6;
    const base = (() => { window.__eliteP = 0; return makeEnemy('grunt', 0, 0); })(); window.__eliteP = 1; const e = makeEnemy('grunt', 0, 0);
    return { el: e.elite, hp: e.hp / base.hp, sc: e.scale }; });
  check(r.el && Math.abs(r.hp - 4) < 0.01 && r.sc === 1.25, 'elite stats ' + JSON.stringify(r));
  // 방패: 맞아도 안 다침
  const sh = await page.evaluate(() => { window.__eliteP = 0; const e = makeEnemy('tank', 0, -200); makeElite(e, 'shield'); SH.G.enemies.push(e); e.shieldT = 1; const hp = e.hp; hurtEnemy(e, 50, 0, 0, 0); return e.hp === hp; });
  check(sh, 'shield blocks');
  // 순간이동
  const bl = await page.evaluate(async () => { const G = SH.G; G.weapons = {}; G.p.x = 900; G.p.y = 900; const e = makeEnemy('grunt', G.p.x + 250, G.p.y - 250); makeElite(e, 'blink'); e.eT = 0.05; G.enemies.push(e); let m = 1e9; for (let i = 0; i < 20; i++) { await new Promise(r => setTimeout(r, 16)); m = Math.min(m, Math.hypot(e.x - G.p.x, e.y - G.p.y)); } return m; });   // 순간이동 직후 가장 가까운 거리
  check(bl < 130, 'blink near hero ' + bl);
  await page.evaluate(() => { const G = SH.G; for (const k of ['shield', 'split', 'blink']) { const e = makeEnemy(k === 'split' ? 'tank' : 'grunt', G.p.x + rand(-120, 120), G.p.y - 120); makeElite(e, k); G.enemies.push(e); } }); await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/b168_elite.png` });
  // 분열 + 상자
  const sp = await page.evaluate(() => { const G = SH.G; G.chests = []; G.enemies.length = 0; const e = makeEnemy('tank', 0, -150); makeElite(e, 'split'); G.enemies.push(e); const n0 = ST.elites || 0; hurtEnemy(e, 1e9, 0, 0, 0);
    return { kids: G.enemies.filter(x => !x.dead && x.type === 'tank').length, kidsElite: G.enemies.some(x => !x.dead && x.elite), chest: G.chests.length, small: G.chests[0] && G.chests[0].small, st: (ST.elites || 0) - n0 }; });
  check(sp.kids === 3 && !sp.kidsElite && sp.chest === 1 && sp.small && sp.st === 1, 'split/chest ' + JSON.stringify(sp));
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
