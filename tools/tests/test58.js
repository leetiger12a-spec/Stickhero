// 유령 보물 상자 (Build 98): 밤 8초 뒤 등장 → 가까이 가면 도망·가끔 헥헥 쉼 → 닿으면 큰 상자 + 금화 → 아침이면 사라짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const calm = () => page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.pending = 0; });
  await calm(); check(await page.evaluate(() => !SH.G.ghost), 'ghost in day');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 8.5; }); await page.waitForTimeout(400); await calm();
  let g = await page.evaluate(() => SH.G.ghost && { x: SH.G.ghost.x, y: SH.G.ghost.y, d: Math.hypot(SH.G.ghost.x - SH.G.p.x, SH.G.ghost.y - SH.G.p.y) }); console.log('ghost', JSON.stringify(g));
  check(g && g.d > 200, 'ghost not spawned away');
  // 영웅을 상자 옆(120)에 두면 도망감
  const d = await page.evaluate(async () => { const G = SH.G, g = G.ghost; G.p.x = g.x - 120; G.p.y = g.y; g.rest = 0; g.run = 0; const d0 = Math.hypot(g.x - G.p.x, g.y - G.p.y); await new Promise(r => setTimeout(r, 600)); return [d0, Math.hypot(G.ghost.x - G.p.x, G.ghost.y - G.p.y)]; });
  console.log('flee', d.map(v => v.toFixed(0)).join('→')); check(d[1] > d[0] + 20, 'ghost did not flee');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.ghost.x; G.cam.y = G.ghost.y; }); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/b98_ghost.png` });
  // 잡기
  const r = await page.evaluate(async () => { const G = SH.G, g0 = G.gold, c0 = (G.chests || []).length; G.p.x = G.ghost.x; G.p.y = G.ghost.y; await new Promise(r => setTimeout(r, 150)); return { gone: !G.ghost, gold: G.gold - g0, chests: (G.chests || []).length - c0, caught: G.ghostCaught }; });
  console.log('catch', JSON.stringify(r)); check(r.gone && r.gold >= 100 && r.chests === 1 && r.caught === 1, 'catch reward wrong');
  // 같은 밤에는 다시 안 나옴, 다음 밤에는 다시 나오고 아침이면 사라짐
  await page.evaluate(() => { SH.G.chests = []; }); await page.waitForTimeout(300); check(await page.evaluate(() => !SH.G.ghost && SH.state === 'play'), 'ghost respawned same night');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_LEN + 1; }); await page.waitForTimeout(200);
  await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_CYCLE + 8.5; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => !!SH.G.ghost), 'ghost not back next night');
  await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_CYCLE + NIGHT_LEN + 0.5; }); await page.waitForTimeout(300);
  check(await page.evaluate(() => !SH.G.ghost), 'ghost not gone at morning');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
