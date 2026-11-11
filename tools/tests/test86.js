// 화난 보스 (Build 128): 체력 50% 아래면 화남(알림·1.25배 빠름·불꽃 고리), 회오리 탄 공격, 마지막 보스·황금 골렘은 안 화남
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e9; G.weapons = {}; G.p.meleeCd = 99; G.p.x = 0; G.p.y = 300; G.need = 1e9;
    SH.spawnBoss(); G.intro = null; G.boss.x = 0; G.boss.y = 60; });
  await page.waitForTimeout(300);
  const s0 = await page.evaluate(() => ({ rage: !!SH.G.boss.rage, spd: SH.G.boss.spd })); check(!s0.rage, 'angry at full hp');
  await page.evaluate(() => { SH.G.boss.hp = SH.G.boss.maxHp * 0.45; }); await page.waitForTimeout(200);
  const s1 = await page.evaluate(() => ({ rage: !!SH.G.boss.rage, spd: SH.G.boss.spd, ban: SH.G.banner && SH.G.banner.text })); console.log(JSON.stringify(s0), JSON.stringify(s1));
  check(s1.rage && s1.ban.includes('화났다') && Math.abs(s1.spd / s0.spd - 1.25) < 0.01, 'rage wrong');
  // 회오리: 걷기 중 기술 고를 때 강제로
  const sp = await page.evaluate(async () => { const G = SH.G, e = G.boss, r = Math.random; e.mode = 'walk'; e.st = 0; G.ebullets = []; G.spShots = 0; Math.random = () => 0.1; await new Promise(q => requestAnimationFrame(q)); Math.random = r; const m = e.mode; await new Promise(q => setTimeout(q, 600)); return [m, G.spShots]; });   /* 울타리에 맞아 사라진 탄도 셈 */
  console.log('spiral', sp.join()); check(sp[0] === 'spiral' && sp[1] >= 8, 'spiral attack missing');
  await page.evaluate(() => { const G = SH.G; G.cam.x = G.boss.x; G.cam.y = G.boss.y; }); await page.waitForTimeout(100); await page.screenshot({ path: `${OUT}/b128_rage.png` });
  // 마지막 보스는 화나지 않음 (자기 2단계가 있음)
  const fin = await page.evaluate(() => { const G = SH.G; const e = G.boss; e.rage = false; e.final = true; e.hp = e.maxHp * 0.3; return new Promise(q => setTimeout(() => q(!!e.rage), 300)); });
  check(!fin, 'final boss raged');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
