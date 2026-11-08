// 보통 적은 보스보다 약해야 함 (Build 78, 아들 제보: 바위 골렘이 보스보다 셈)
// 같은 단계에 나오는 보스와 비교: 적 체력(나뉘는 조각 포함) < 그 단계 무렵 마을 보스 체력, 적 피해 < 가장 센 보통 보스 피해
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const split = { e_golem: 3 * 0.1, e_slime: 2 * 0.35 }, out = [];
    // 단계 k(0~3)에 나오는 적 ↔ 그 무렵 보스: 단계마다 보스 1~2마리씩 지나감 → 비교 보스 BOSS_HP[k+1] (마지막 단계는 [5]의 절반 이하 권장 대신 [3])
    const cmp = [BOSS_HP[1], BOSS_HP[2], BOSS_HP[3], BOSS_HP[3]];
    TIERS.forEach((ts, k) => ts.forEach(t => { const T = ETYPES[t], hp = T.hp * (1 + (split[t] || 0)); out.push({ t, k, hp: Math.round(hp), boss: cmp[k], dmg: T.dmg }); }));
    for (const t in ETYPES) if (!out.some(o => o.t === t)) { const T = ETYPES[t]; out.push({ t, k: -1, hp: Math.round(T.hp * (1 + (split[t] || 0))), boss: BOSS_HP[0], dmg: T.dmg }); }
    return { out, maxBossDmg: 25 + 5 * 8 };
  });
  for (const o of r.out) {
    const okH = o.hp < o.boss, okD = o.dmg < r.maxBossDmg;
    console.log((okH && okD ? '  ' : '⚠ ') + o.t.padEnd(11), '단계', String(o.k).padStart(2), '체력', String(o.hp).padStart(6), '< 보스', String(o.boss).padStart(6), ' 피해', o.dmg);
    check(okH, `${o.t} hp ${o.hp} >= boss ${o.boss}`); check(okD, `${o.t} dmg ${o.dmg} >= boss dmg ${r.maxBossDmg}`);
  }
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
