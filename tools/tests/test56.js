// 새 무기 2종 (Build 96): 독 물약(던지면 독 웅덩이) · 별 지팡이(하늘에서 별똥별) + 진화 독 늪 가마솥 · 유성우 지팡이, 9·11칸에서 열림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(400);
  const lock = await page.evaluate(() => {
    const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'), o = {}, f = () => [isUnlocked('w', 'poison'), isUnlocked('w', 'star')];
    o.a = f(); m.maxStage = 9; localStorage.setItem('stickhero_meta', JSON.stringify(m)); o.b = f(); m.maxStage = 11; localStorage.setItem('stickhero_meta', JSON.stringify(m)); o.c = f(); return o;
  });
  console.log('lock', JSON.stringify(lock)); check(lock.a.join() === 'false,false' && lock.b.join() === 'true,false' && lock.c.join() === 'true,true', 'unlock order wrong');
  const ic = await page.evaluate(() => ['poison', 'poison_evo', 'star', 'star_evo'].filter(n => WICON[n]).length); check(ic === 4, 'icons not loaded: ' + ic);
  const setup = (w, l, foes) => page.evaluate(([w, l, foes]) => {
    const G = SH.G; G.enemies = []; G.bullets = []; G.bombs = []; G.meteors = []; G.pflames = []; G.pending = 0; G.gems = []; G.slow = 0;
    G.weapons = { [w]: l }; G.timers = { [w]: 0 }; G.p.x = 0; G.p.y = 92; G.p.inv = 0; G.p.meleeCd = 99; G.p.hp = G.p.maxHp = 99999;
    G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    for (const [x, y] of foes) { const e = makeEnemy('tank', x, y); e.hp = e.maxHp = 9000; e.spd = 0; G.enemies.push(e); }
  }, [w, l, foes]);
  const hp = () => page.evaluate(() => SH.G.enemies.map(e => Math.round(e.maxHp - e.hp)));
  // 독 물약 Lv1: 던짐 → 깨짐 → 초록 독 웅덩이 → 계속 아픔
  await setup('poison', 1, [[150, 80]]); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.bombs.some(x => x.poison)), 'no flask thrown');
  await page.waitForTimeout(700);
  const pool = await page.evaluate(() => SH.G.pflames.filter(f => f.poison).length); console.log('pools', pool); check(pool >= 1, 'no poison pool');
  const h1 = (await hp())[0]; await page.evaluate(() => { SH.G.weapons = {}; }); await page.waitForTimeout(1300); const h2 = (await hp())[0];
  console.log('poison dmg', h1, '->', h2); check(h1 > 0 && h2 > h1, 'pool did not keep hurting');
  await page.screenshot({ path: `${OUT}/b96_poison.png` });
  // 진화: 독 늪 가마솥 — 3병, 큰 웅덩이
  await setup('poison', 6, [[150, 80], [-120, 40], [40, -100]]); await page.waitForTimeout(100);
  const nb = await page.evaluate(() => SH.G.bombs.filter(x => x.poison && x.big).length); console.log('cauldron flasks', nb); check(nb === 3, 'evolved not 3 flasks');
  await page.waitForTimeout(900); const big = await page.evaluate(() => Math.max(0, ...SH.G.pflames.filter(f => f.poison).map(f => f.r))); check(big >= 80, 'evolved pool small: ' + big);
  await page.screenshot({ path: `${OUT}/b96_cauldron.png` });
  // 별 지팡이 Lv3: 별똥별 2개 → 떨어지면 맞은 적 피해
  await setup('star', 3, [[120, 40], [-120, 40], [0, -150]]); await page.waitForTimeout(100);
  const nm = await page.evaluate(() => SH.G.meteors.length); console.log('meteors', nm); check(nm === 2, 'star lv3 not 2 meteors');
  await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/b96_star_fall.png` });
  await page.waitForTimeout(500); let h = await hp(); console.log('star hits', h.join()); check(h.filter(v => v > 0).length >= 2, 'meteors did not hit');
  // 진화: 유성우 지팡이 — 6개
  await setup('star', 6, [...Array(8)].map((_, k) => [-200 + k * 55, 92 - 80 - (k % 3) * 60])); await page.waitForTimeout(100);
  const nr = await page.evaluate(() => SH.G.meteors.filter(m => m.big).length); console.log('meteor rain', nr); check(nr === 6, 'evolved not 6 meteors');
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b96_rain.png` });
  // 진화 카드: 독 Lv5 + 가방, 별 Lv5 + 하트
  const cards = await page.evaluate(() => { const G = SH.G; G.weapons = { poison: 5, star: 5 }; G.passives = { bag: 1, hp: 1 }; openLevelUp(); return [...document.querySelectorAll('#cards .card.evo .nm')].map(e => e.textContent); });
  console.log('evo cards', cards.join(' | ')); check(cards.some(t => t.includes('독 늪 가마솥')) && cards.some(t => t.includes('유성우 지팡이')), 'evo cards missing');
  await page.screenshot({ path: `${OUT}/b96_cards.png` });
  await page.evaluate(() => SH.choose(0));
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
