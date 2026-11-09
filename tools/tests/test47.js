// 마을 보스: 적 단계에 맞춰 최소 보스 (Build 79) — 보스마다 체력은 그대로, 단계가 오르면 약한 보스는 안 나옴
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(600); await page.click('#bStart'); await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const G = SH.G, out = [];
    const one = (bt, cnt) => { G.bt = bt; G.bossCount = cnt; SH.spawnBoss(); const e = G.boss; G.enemies = G.enemies.filter(x => x !== e); G.boss = null; G.intro = null; return [bt, cnt, e.name, Math.round(e.maxHp)]; };
    for (const [bt, c] of [[0, 0], [100, 1], [200, 0], [200, 2], [350, 0], [350, 4], [500, 0], [500, 1], [500, 5], [500, 7]]) out.push(one(bt, c));
    return { out, hp: Object.fromEntries(BOSSES.map((B, i) => [B.name, BOSS_HP[i]])), idx: Object.fromEntries(BOSSES.map((B, i) => [B.name, i])) };
  });
  for (const x of r.out) console.log(`단계시간 ${String(x[0]).padStart(3)}초 · ${x[1]}번째 → ${x[2]} ${x[3]}`);
  // 보스 번호(BOSSES 순서)로 비교: 정해진 순서 칸은 그 번호, 센 보스 칸은 최소 번호 이상 (Build 84: 골렘 4종·드문 황금 골렘(10)도 센 보스)
  const exact = [0, 1, 1, 2, 3, 4, 4, 4, 5, null], atLeast = [0, 1, 1, 2, 3, 4, 4, 4, 5, 4];
  r.out.forEach((x, i) => { const k = r.idx[x[2]], ok = k === 10 ? i >= 3 : exact[i] !== null && i < 9 ? k === exact[i] : k >= atLeast[i];
    check(ok, `bt ${x[0]} #${x[1]}: ${x[2]} (#${k}) wrong`); });
  check(r.out.every(x => r.hp[x[2]] === x[3]), 'boss hp changed (must stay fixed per boss)');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
