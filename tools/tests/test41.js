// 보스 세기 고정 (Build 69): 같은 보스는 마을·모험·탑·며칠째든 같은 체력, 나중 보스일수록 셈, 마을 보스 순서 고정
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  await page.click('#bStart'); await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const G = SH.G, out = { village: [], stage: [], tower: [] };
    const take = () => { const e = G.boss; G.enemies = G.enemies.filter(x => x !== e); G.boss = null; G.intro = null; return [e.name, Math.round(e.maxHp)]; };
    G.bossCount = 0; for (let i = 0; i < 8; i++) { SH.spawnBoss(0, 0); out.village.push(take()); }
    G.day = 3; G.bossCount = 1; SH.spawnBoss(0, 0); out.day3 = take(); G.day = 1;
    const mode = G.mode; G.mode = 'stage';
    for (const n of [0, 2, 4, 6, 8, 9]) { G.st = { n, tower: 0, def: { goal: n === 9 ? 'final' : 'boss' } }; SH.spawnBoss(0, 0); out.stage.push(take()); }
    for (const f of [5, 10, 25]) { G.st = { n: 1 + f, tower: f, def: { goal: 'tboss' } }; SH.spawnBoss(0, 0); out.tower.push(take()); }
    G.mode = mode; G.st = null;
    return out;
  });
  console.log(JSON.stringify(r));
  const hpOf = {}; let ok = true;
  for (const [n, h] of [...r.village, ...r.stage, ...r.tower, r.day3]) { if (hpOf[n] !== undefined && hpOf[n] !== h) ok = false; hpOf[n] = h; }
  check(ok, 'same boss has different HP somewhere');
  check(r.village.slice(0, 6).map(x => x[0]).join() === BOSS_NAMES, 'village boss order wrong');
  const v = r.village.slice(0, 6).map(x => x[1]); check(v.every((h, i) => !i || h > v[i - 1]), 'later bosses not stronger');
  check(r.stage[5][0] === '왕관 괴물 대왕' && r.stage[5][1] > v[5], 'final boss not strongest');
  check(r.day3[1] >= v[1] && v.includes(r.day3[1]), 'day 3 boss not a fixed-strength boss');   // Build 79: 다음 날은 단계가 빨라 더 센 보스 종류가 나올 수 있음 (보스마다 체력은 그대로)
  // 보스가 갈 수 없는 곳(스테이지 뒤쪽 밖)에서 쓰러져도 포털·상자는 갈 수 있는 곳에 (봇이 15분 갇혔던 문제)
  const pt = await page.evaluate(() => { const G = SH.G; enterStage(0); G.intro = null; SH.spawnBoss(0, 600); endIntro(); const e = G.boss; e.x = 900; e.y = 700; hurtEnemy(e, 1e13, 0, 1, 0);
    const P = G.st.portal, c = G.chests[G.chests.length - 1]; return { px: P.x, py: P.y, cx: c.x, cy: c.y, hw: STAGE_HW, L: G.st.L }; });
  console.log('portal', JSON.stringify(pt));
  check(Math.abs(pt.px) < pt.hw && pt.py <= 100 && pt.py >= -pt.L - 380, 'portal outside reachable area'); check(Math.abs(pt.cx) < pt.hw && pt.cy <= 100, 'chest outside reachable area');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
const BOSS_NAMES = '대왕 슬라임,강철 거인,불꽃 대마왕,얼음 용,거미 여왕,해골 왕';
