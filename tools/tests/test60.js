// 새 퀘스트 4종 (Build 100): 밤 버티기·유령 상자·독 웅덩이로 처치·별똥별로 처치 (독·별은 무기가 열려야 나옴)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  // 잠금: 처음엔 독·별 퀘스트 안 나옴, 11칸 깨면 나옴
  const pool = await page.evaluate(() => { const ids = () => QUESTS.filter(q => !q.ok || q.ok()).map(q => q.id); const a = ids(); const m = JSON.parse(localStorage.getItem('stickhero_meta') || '{}'); m.maxStage = 11; localStorage.setItem('stickhero_meta', JSON.stringify(m)); return [a, ids()]; });
  console.log('pool', pool.map(x => x.filter(i => ['night', 'ghost', 'poison', 'meteor'].includes(i)).join()).join(' | '));
  check(pool[0].includes('night') && pool[0].includes('ghost') && !pool[0].includes('poison') && !pool[0].includes('meteor'), 'locked pool wrong');
  check(pool[1].includes('poison') && pool[1].includes('meteor'), 'unlocked pool wrong');
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99;
    G.quests = [{ id: 'poison', goal: 2, prog: 0, done: false }, { id: 'meteor', goal: 2, prog: 0, done: false }, { id: 'night', goal: 1, prog: 0, done: false }]; });
  // 독 웅덩이로 2마리, 별똥별로 2마리, 그냥 피해는 안 셈
  const pr = await page.evaluate(async () => { const G = SH.G, mk = (x) => { const e = makeEnemy('grunt', x, 120); e.hp = e.maxHp = 5; e.spd = 0; G.enemies.push(e); return e; };
    const a = mk(100), b2 = mk(140); addFlame(120, 120, 60, 2, { poison: true, dmg: 50 });
    const c = mk(-100), d = mk(-130); G.meteors.push({ x: -115, y: 120, t: 0.45, dur: 0.5, dmg: 99, rad: 50 });
    const e = mk(0); hurtEnemy(e, 999, 0, 0, 0);
    await new Promise(r => setTimeout(r, 900)); return G.quests.map(q => q.prog); });
  console.log('prog', pr.join()); check(pr[0] === 2 && pr[1] === 2, 'poison/meteor kills not counted');
  // 밤을 버티면
  await page.evaluate(() => { SH.G.bt = NIGHT_START + 30; }); await page.waitForTimeout(200); await page.evaluate(() => { SH.G.bt = NIGHT_START + NIGHT_LEN + 0.3; SH.G.enemies = []; }); await page.waitForTimeout(300);
  const q = await page.evaluate(() => SH.G.quests.map(q => q.done)); console.log('done', q.join()); check(q.every(Boolean), 'quests not done');
  // 유령 상자 퀘스트
  await page.evaluate(() => { const G = SH.G; G.quests = [{ id: 'ghost', goal: 1, prog: 0, done: false }]; G.bt = NIGHT_START + NIGHT_CYCLE + 8.5; G.ghostDone = false; }); await page.waitForTimeout(300);
  await page.evaluate(() => { const G = SH.G; G.p.x = G.ghost.x; G.p.y = G.ghost.y; }); await page.waitForTimeout(150);
  check(await page.evaluate(() => SH.G.quests[0].done), 'ghost quest not done');
  await page.screenshot({ path: `${OUT}/b100_quest.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
