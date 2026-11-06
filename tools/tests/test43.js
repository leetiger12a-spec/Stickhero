// 새 무기 2종 (Build 72): 얼음 지팡이(맞으면 느려짐) · 석궁(관통) + 진화 눈보라 왕관 · 폭풍 석궁, 스테이지 4·6칸에서 열림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(400);
  // 잠금: 처음엔 둘 다 잠김, 4칸 깨면 얼음, 6칸이면 석궁
  const lock = await page.evaluate(() => {
    const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'), o = {};
    o.a = [isUnlocked('w', 'ice'), isUnlocked('w', 'xbow')];
    m.maxStage = 4; localStorage.setItem('stickhero_meta', JSON.stringify(m)); o.b = [isUnlocked('w', 'ice'), isUnlocked('w', 'xbow')];
    m.maxStage = 6; localStorage.setItem('stickhero_meta', JSON.stringify(m)); o.c = [isUnlocked('w', 'ice'), isUnlocked('w', 'xbow')];
    return o;
  });
  console.log('lock', JSON.stringify(lock));
  check(lock.a.join() === 'false,false' && lock.b.join() === 'true,false' && lock.c.join() === 'true,true', 'unlock order wrong');
  // 그림 4개
  const ic = await page.evaluate(() => ['ice', 'ice_evo', 'xbow', 'xbow_evo'].filter(n => WICON[n]).length); check(ic === 4, 'new weapon icons not loaded: ' + ic);
  const setup = async (w, l, foes) => page.evaluate(([w, l, foes]) => {
    const G = SH.G; G.enemies = []; G.bullets = []; G.weapons = { [w]: l }; G.timers = { [w]: 0 }; G.p.x = 0; G.p.y = 92; G.p.inv = 0; G.p.hp = G.p.maxHp = 99999;
    G.spawnT = 999; G.waveT = 999;
    for (const [x, y] of foes) { const e = makeEnemy('tank', x, y); e.hp = e.maxHp = 5000; e.spd = 0; G.enemies.push(e); }
  }, [w, l, foes]);
  const foes = () => page.evaluate(() => SH.G.enemies.filter(e => !e.dead).map(e => ({ hurt: e.hp < e.maxHp, slow: +(e.slowT || 0).toFixed(2) })));
  // 얼음 지팡이 Lv1: 얼음 조각 → 맞은 적 느려짐
  await setup('ice', 1, [[160, 80]]); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.bullets.some(b => b.kind === 'ice')), 'no ice shard fired');
  await page.waitForTimeout(700);
  let f = await foes(); console.log('ice', JSON.stringify(f)); check(f[0].hurt && f[0].slow > 0, 'ice did not hurt/slow');
  // 느려진 적은 절반 속도로 걸어옴 (같은 적, 같은 시간)
  const sp = await page.evaluate(async () => {
    const G = SH.G; G.weapons = {}; G.enemies = []; const mk = (x, s) => { const e = makeEnemy('grunt', x, -300); e.spd = 60; e.slowT = s; G.enemies.push(e); return e; };
    const a = mk(-40, 0), c = mk(40, 99); const y0 = [a.y, c.y]; await new Promise(r => setTimeout(r, 800));
    return [Math.hypot(a.x + 40, a.y - y0[0]), Math.hypot(c.x - 40, c.y - y0[1])];
  });
  console.log('moved normal/slowed', sp.map(v => v.toFixed(1)).join(' / ')); check(sp[1] < sp[0] * 0.65 && sp[1] > sp[0] * 0.3, 'slowed enemy not ~half speed');
  // 석궁 Lv5: 줄 선 적 3마리 이상 꿰뚫음
  await setup('xbow', 5, [[120, 92 - 12], [170, 80], [220, 80], [270, 80]]); await page.waitForTimeout(700);
  f = await foes(); console.log('xbow', JSON.stringify(f)); check(f.filter(x => x.hurt).length >= 3, 'crossbow did not pierce 3+');
  // 진화: 눈보라 왕관 — 가까운 적 모두 피해 + 느려짐, 먼 적은 아님(조각에 맞을 수 있어 느려짐만 비교 안 함)
  await setup('ice', 6, [[80, 92], [-90, 92], [0, 190], [0, -260]]); await page.waitForTimeout(120);
  f = await foes(); console.log('blizzard', JSON.stringify(f)); check(f.slice(0, 3).every(x => x.hurt && x.slow > 0), 'blizzard missed close enemies');
  check(!f[3].hurt || f[3].slow > 0, 'far enemy state odd');
  // 진화: 폭풍 석궁 — 한 번에 5발
  await setup('xbow', 6, [[0, -200]]); await page.waitForTimeout(80);
  const nb = await page.evaluate(() => SH.G.bullets.filter(b => b.kind === 'xbow' && b.big).length); console.log('storm arrows', nb); check(nb === 5, 'storm crossbow not 5 arrows');
  // 레벨업: 얼음 Lv5 + 자석 → 진화 카드 '눈보라 왕관', 석궁 Lv5 + 신발 → '폭풍 석궁'
  const cards = await page.evaluate(() => { const G = SH.G; G.weapons = { ice: 5, xbow: 5 }; G.passives = { magnet: 1, speed: 1 }; openLevelUp(); return [...document.querySelectorAll('#cards .card.evo .nm')].map(e => e.textContent); });
  console.log('evo cards', cards.join(' | ')); check(cards.some(t => t.includes('눈보라 왕관')) && cards.some(t => t.includes('폭풍 석궁')), 'evo cards missing');
  await page.screenshot({ path: '' + (process.env.OUT || '.') + '/b72_cards.png' });
  await page.evaluate(() => SH.choose(0)); await page.waitForTimeout(200);
  // 그림: 눈보라 + 폭풍 석궁 + 느려진 적 발밑 얼음
  await page.evaluate(() => { const G = SH.G; G.weapons = { ice: 6, xbow: 6 }; G.timers = {}; G.enemies = []; G.p.x = 0; G.p.y = 92; G.p.inv = 0;
    for (let k = 0; k < 7; k++) { const e = makeEnemy(k % 2 ? 'grunt' : 'tank', -150 + k * 50, 92 - 60 - (k % 3) * 70); e.hp = e.maxHp = 9000; e.spd = 5; G.enemies.push(e); } });
  await page.waitForTimeout(1100); await page.screenshot({ path: '' + (process.env.OUT || '.') + '/b72_play.png' });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
