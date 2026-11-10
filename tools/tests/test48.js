// 골렘 보스 5종 (Build 84, 아들 생각): 그림·체력·특기 — 바위 골렘 왕 충격파+작은 골렘, 용암 불길, 얼음 숨결, 숲 뿌리+회복, 황금 금화+도망
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const spawn = n => page.evaluate(n => { const G = SH.G; window.__bossN = n; G.enemies = []; G.hazards = []; G.ebullets = []; G.weapons = {}; G.p.hp = G.p.maxHp = 1e6; G.p.x = 0; G.p.y = 300; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    SH.spawnBoss(0, 150); SH.skipIntro(); delete window.__bossN; const e = G.boss; return { name: e.name, hp: Math.round(e.maxHp), dmg: Math.round(e.dmg), spr: e.spr, img: !!SPR[e.spr], gold: !!e.goldG }; }, n);
  const want = { 6: ['바위 골렘 왕', 50000], 7: ['용암 골렘', 50000], 8: ['얼음 골렘', 50000], 9: ['숲 골렘', 50000], 10: ['황금 골렘', 40000] };
  for (const n of [6, 7, 8, 9, 10]) { const r = await spawn(n); console.log(n, JSON.stringify(r)); check(r.name === want[n][0] && r.hp === want[n][1] && r.img, `boss ${n} wrong: ${JSON.stringify(r)}`); }
  // 바위 골렘 왕: 충격파 → 바위 조각 10개, 반쯤 다치면 작은 골렘 3
  await spawn(6);
  await page.evaluate(() => SH.bossSpecial()); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.boss.mode === 'quakeWind'), 'rock king no quake windup');
  await page.screenshot({ path: `${OUT}/b84_quake.png` });
  await page.waitForTimeout(900);
  check(await page.evaluate(() => SH.G.ebullets.filter(b => b.cannon).length >= 8), 'rock king no rock shards');
  const sm = await page.evaluate(async () => { const e = SH.G.boss; e.hp = e.maxHp * 0.49; await new Promise(r => setTimeout(r, 200)); return SH.G.enemies.filter(x => x.type === 'e_golem' && x.small).length; });
  console.log('small golems', sm); check(sm === 3, 'rock king did not call 3 golems');
  // 용암 골렘: 걸으며 불길
  await spawn(7); await page.evaluate(() => { SH.G.boss.st = 99; }); await page.waitForTimeout(1600);
  check(await page.evaluate(() => SH.G.hazards.length >= 1), 'magma golem no fire trail');
  // 얼음 골렘: 얼음 숨결
  await spawn(8); await page.evaluate(() => SH.bossSpecial()); await page.waitForTimeout(1000);
  check(await page.evaluate(() => SH.G.ebullets.some(b => b.ice)), 'ice golem no ice breath');
  // 숲 골렘: 뿌리 덫 + 회복
  await spawn(9); await page.evaluate(() => { SH.bossSpecial(); SH.G.boss.hp = SH.G.boss.maxHp * 0.5; }); await page.waitForTimeout(1300);
  const fr = await page.evaluate(() => ({ roots: SH.G.hazards.filter(h => h.root).length, hp: SH.G.boss.hp / SH.G.boss.maxHp }));
  console.log('forest', JSON.stringify(fr)); check(fr.roots >= 3 && fr.hp > 0.5, 'forest golem roots/heal missing');
  await page.screenshot({ path: `${OUT}/b84_roots.png` });
  // 황금 골렘: 맞으면 금화, 40초 지나면 도망 (상자 없음)
  await spawn(10);
  const gc = await page.evaluate(async () => { const G = SH.G, e = G.boss, c0 = G.coins.length; for (let i = 0; i < 6; i++) { G.t += 0.3; hurtEnemy(e, 10, 0, 1, 0); } return G.coins.length - c0; });
  console.log('gold coins on hit', gc); check(gc >= 5, 'gold golem drops no coins');
  await page.screenshot({ path: `${OUT}/b84_gold.png` });
  // Build 85: 황금 골렘 남은 시간 표시
  const tx = await page.evaluate(async () => { const H = window.hudText, seen = []; window.hudText = function (t) { seen.push(String(t)); return H.apply(this, arguments); }; await new Promise(r => setTimeout(r, 120)); window.hudText = H; return seen.filter(t => t.includes('도망까지')); });
  console.log('flee text', tx[0]); check(tx.length > 0 && /도망까지 \d+초/.test(tx[0]), 'gold golem countdown not shown');
  const fl = await page.evaluate(async () => { const G = SH.G, e = G.boss; e.fleeT = 0.3; await new Promise(r => setTimeout(r, 600)); return { boss: !!G.boss, dead: e.dead, chests: (G.chests || []).length, banner: G.banner && G.banner.t }; });
  console.log('gold flee', JSON.stringify(fl)); check(!fl.boss && fl.dead && fl.chests === 0, 'gold golem did not flee cleanly');
  // 황금 골렘을 잡으면 금빛 상자
  await spawn(10); await page.evaluate(() => { const e = SH.G.boss; hurtEnemy(e, 1e9, 0, 1, 0); }); await page.waitForTimeout(300);
  check(await page.evaluate(() => (SH.G.chests || []).some(c => c.gold)), 'gold golem no golden chest');
  // Build 85: 골렘 업적 (황금 골렘을 잡았으니 첫 골렘·황금을 잡아라)
  const ach = await page.evaluate(() => { checkAch(); const m = JSON.parse(localStorage.getItem('stickhero_meta')); return { g1: !!m.ach.golem1, gG: !!m.ach.golemG, g5: !!m.ach.golem5, n: ACH.length }; });
  console.log('golem ach', JSON.stringify(ach)); check(ach.g1 && ach.gG && !ach.g5 && ach.n === 30, 'golem achievements wrong');
  // 도감: 보스 12종
  const dx = await page.evaluate(() => DEX.filter(d => d.boss).length); console.log('dex bosses', dx); check(dx === 12, 'dex bosses not 12');
  // 무한 탑 30~45층 = 골렘 4종
  const tw = await page.evaluate(() => { const G = SH.G, out = []; const m = G.mode; G.mode = 'stage'; for (const f of [30, 35, 40, 45]) { G.st = { n: 1 + f, tower: f, def: { goal: 'tboss' } }; SH.spawnBoss(0, 0); out.push(G.boss.name); G.enemies = G.enemies.filter(x => x !== G.boss); G.boss = null; G.intro = null; } G.mode = m; G.st = null; return out; });
  console.log('tower', tw.join()); check(tw.join() === '바위 골렘 왕,용암 골렘,얼음 골렘,숲 골렘', 'tower golem floors wrong');
  // Build 86: 무한 탑 50층 = 황금 골렘, 도망가도 층은 통과
  const t50 = await page.evaluate(async () => { const G = SH.G; while (SH.state === 'levelup') SH.choose(0); G.pending = 0; G.gems = []; G.slow = 0; if (SH.state !== 'play') { state = 'play'; showOv(null); } SH.tower(50); G.intro = null; G.enemies = []; G.st.bossOn = true; SH.spawnBoss(0, G.p.y - 200); SH.skipIntro(); const e = G.boss, name = e.name; e.fleeT = 0.2; await new Promise(r => setTimeout(r, 500)); return { name, clear: !!G.st.clear, portal: !!G.st.portal, boss: !!G.boss, st: SH.state, ft: e.fleeT, chest: SH.G.chests && SH.G.chests.length }; });
  console.log('tower 50', JSON.stringify(t50)); check(t50.name === '황금 골렘' && t50.clear && t50.portal && !t50.boss, 'tower 50 gold golem flee wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
