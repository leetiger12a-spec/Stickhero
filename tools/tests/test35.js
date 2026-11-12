// 합성 효과음: 진화 무기 6종·보물 상자 5종이 오류 없이 소리를 만드는지, 실제 게임(진화 무기 발사·상자 열기)에서 불리는지
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1');
    window.__sfx = {}; const hook = () => { if (window.sfx && !window.sfx.__h) { const S = window.sfx; window.sfx = function (n) { __sfx[n] = (__sfx[n] || 0) + 1; return S(n); }; window.sfx.__h = 1; } }; setInterval(hook, 50); });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(600);
  await page.click('#bStart'); await page.waitForTimeout(400);   // 누르면 소리 켜짐
  const NEW = ['gatling', 'flame', 'thunder', 'volcano', 'whirl', 'shing', 'chestShake', 'chestOpen', 'tick', 'reward', 'rewardEvo'];
  const made = await page.evaluate(NEW => { if (!AC) return -1; let n = 0; const O = AC.createOscillator.bind(AC), B = AC.createBufferSource.bind(AC);
    AC.createOscillator = () => { n++; return O(); }; AC.createBufferSource = () => { n++; return B(); };
    const per = {}; for (const k of NEW) { const n0 = n; for (const g in sfxLast) delete sfxLast[g]; sfx(k); per[k] = n - n0; } return per; }, NEW);
  console.log('nodes per sound', JSON.stringify(made)); check(made !== -1, 'audio not started');
  if (made !== -1) for (const k of NEW) check(made[k] > 0, 'no sound made: ' + k);
  // 진화 무기 6종 발사 → 새 소리가 실제로 불림
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.p.hp = G.p.maxHp = 1e9; G.p.x = 0; G.p.y = 300;
    G.weapons = { sword: 6, pistol: 6, shotgun: 6, boomerang: 6, bolt: 6, hammer: 6 }; for (const id in G.weapons) G.timers[id] = 0; __sfx = {};
    for (let i = 0; i < 10; i++) { const e = makeEnemy('tank', -60 + i * 14, 300 + (i % 2 ? 40 : -40)); e.hp = e.maxHp = 1e9; e.spd = 0; G.enemies.push(e); } });
  for (let i = 0; i < 12; i++) { await page.waitForTimeout(150); await page.evaluate(() => { while (SH.state === 'levelup') SH.choose(0); }); }
  const w = await page.evaluate(() => __sfx); console.log('weapon sfx', JSON.stringify(w));
  for (const k of ['gatling', 'flame', 'thunder', 'volcano', 'whirl', 'shing']) check(w[k] > 0, 'weapon sound not played: ' + k);
  check(!w.shoot, 'gatling still plays pistol sound');
  // 보물 상자
  await page.evaluate(() => { const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.ach = Object.fromEntries(ACH.map(A => [A.id, true])); localStorage.setItem('stickhero_meta', JSON.stringify(m)); });   /* Build 147: 업적 달성 소리(unlock)가 섞이지 않게 */
  await page.evaluate(() => { const G = SH.G; G.enemies = []; G.weapons = { sword: 5 }; G.passives = { power: 1 }; __sfx = {}; dropChest(G.p.x, G.p.y - 10); G.chests[0].t = 1; G.chests[0].jack = false; });
  await page.waitForTimeout(2600);
  const c = await page.evaluate(() => __sfx); console.log('chest sfx', JSON.stringify(c));
  for (const k of ['chestShake', 'chestOpen', 'tick']) check(c[k] > 0, 'chest sound not played: ' + k);
  check((c.reward || 0) + (c.rewardEvo || 0) > 0, 'reward sound not played');
  check(!c.unlock, 'evolution sound played before the roulette stopped');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
