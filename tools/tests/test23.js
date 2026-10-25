// 새 보스 3종 + 최종 보스 그림: 얼음 용(얼음 숨결·느려짐), 거미 여왕(거미줄·새끼 거미), 해골 왕(순간이동·해골 구슬·해골 병사)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(300);
  const boss = async (n) => page.evaluate(n => { const G = SH.G; G.enemies = G.enemies.filter(e => e.camp); G.ebullets = []; G.hazards = []; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    G.p.hp = G.p.maxHp = 1e6; G.p.x = 300; G.p.y = 300; G.bossCount = n; spawnBoss(400, 250); SH.skipIntro(); const e = G.boss; e.st = 99; return { name: e.name, spr: e.spr, kind: bossKind(e) }; }, n);
  // 얼음 용
  let r = await boss(3); console.log(JSON.stringify(r)); check(r.spr === 'boss3' && r.kind === 'ice', 'ice dragon wrong');
  await page.evaluate(() => SH.bossSpecial()); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b44_ice.png` });
  await page.waitForTimeout(1200);
  const ice = await page.evaluate(() => ({ shards: SH.G.ebullets.filter(b => b.ice).length, slow: SH.G.p.slowT > 0, hp: SH.G.p.hp }));
  console.log('ice', JSON.stringify(ice)); check(ice.slow && ice.hp < 1e6, 'ice breath did not slow hero');
  // 거미 여왕
  r = await boss(4); console.log(JSON.stringify(r)); check(r.spr === 'boss4' && r.kind === 'web', 'spider queen wrong');
  await page.evaluate(() => { SH.G.p.slowT = 0; SH.bossSpecial(); });
  const web = await page.evaluate(() => ({ webs: SH.G.hazards.filter(h => h.web).length, spiders: SH.G.enemies.filter(e => e.type === 'e_spider').length }));
  console.log('web', JSON.stringify(web)); check(web.webs >= 2 && web.spiders >= 4, 'web/spiders missing');
  await page.waitForTimeout(1000);
  check(await page.evaluate(() => SH.G.p.slowT > 0), 'web did not slow');
  await page.screenshot({ path: `${OUT}/b44_web.png` });
  // 해골 왕
  r = await boss(5); console.log(JSON.stringify(r)); check(r.spr === 'boss5' && r.kind === 'skull', 'skeleton king wrong');
  const pos0 = await page.evaluate(() => { SH.bossSpecial(); return [SH.G.boss.x, SH.G.boss.y]; });
  await page.waitForTimeout(1300);
  const sk = await page.evaluate(p0 => { const e = SH.G.boss; return { moved: Math.hypot(e.x - p0[0], e.y - p0[1]) > 20, orbs: SH.G.ebullets.filter(b => b.skull).length, skels: SH.G.enemies.filter(e => e.type === 'e_skel').length, mode: e.mode }; }, pos0);
  console.log('skull', JSON.stringify(sk)); check(sk.moved && sk.skels >= 2 && (sk.orbs >= 8 || sk.mode === 'walk'), 'skeleton king special wrong');
  await page.screenshot({ path: `${OUT}/b44_skull.png` });
  // 최종 보스 그림
  const fin = await page.evaluate(() => { SH.G.stageN = 10; SH.enterStage(9); const G = SH.G; G.p.y = -G.st.L + 300; return 0; });
  for (let i = 0; i < 30 && !(await page.evaluate(() => !!SH.G.boss)); i++) await page.waitForTimeout(100);
  const fs = await page.evaluate(() => SH.G.boss && SH.G.boss.spr); console.log('final', fs); check(fs === 'boss_final', 'final boss sprite wrong');
  await page.waitForTimeout(900); await page.screenshot({ path: `${OUT}/b44_final_intro.png` });
  // 마을 보스 6종이 돌아가며
  const names = await page.evaluate(() => { SH.returnBase(false); const G = SH.G, out = []; G.bossCount = 0; for (let i = 0; i < 6; i++) { G.boss = null; spawnBoss(0, 600); out.push(G.boss.name); G.boss.dead = true; G.intro = null; } return out; });
  console.log(names.join(',')); check(new Set(names).size === 6, 'village boss rotation not 6');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
