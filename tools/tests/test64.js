// 영웅 말풍선 (Build 104): 보스 등장·진화·밤·아침·유령 상자·체력 낮음 때 짧은 말, 2.2초 뒤 사라짐, 체력 낮음은 25초에 1번
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const say = () => page.evaluate(() => SH.G.say && { kind: SH.G.say.kind, txt: SH.G.say.txt });
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.say = null; G.pending = 0; });
  await page.waitForTimeout(200); check(!(await say()), 'speaks for nothing');
  // 보스
  await page.evaluate(() => SH.spawnBoss()); await page.waitForTimeout(150); let s = await say(); console.log('boss', JSON.stringify(s)); check(s && s.kind === 'boss' && await page.evaluate(t => SAY.boss.includes(t), s.txt), 'no boss line');
  await page.screenshot({ path: `${OUT}/b104_say.png` });
  await page.evaluate(() => { SH.G.intro = null; }); await page.waitForTimeout(2500); check(!(await say()), 'bubble did not go away');
  // 진화
  await page.evaluate(() => { const G = SH.G; G.enemies = []; G.boss = null; G.weapons = { pistol: 5 }; G.passives = { haste: 1 }; G.pending = 1; openLevelUp(); const i = [...document.querySelectorAll('#cards .card')].findIndex(c => c.classList.contains('evo')); SH.choose(Math.max(0, i)); });
  await page.waitForTimeout(200); s = await say(); console.log('evo', JSON.stringify(s)); check(s && s.kind === 'evo', 'no evo line');
  // 밤 → 아침
  await page.evaluate(() => { SH.G.say = null; SH.G.bt = NIGHT_START + 1; }); await page.waitForTimeout(200); s = await say(); check(s && s.kind === 'night', 'no night line');
  await page.evaluate(() => { SH.G.say = null; SH.G.ghost = null; SH.G.ghostDone = true; SH.G.bt = NIGHT_START + NIGHT_LEN + 0.2; }); await page.waitForTimeout(200); s = await say(); check(s && s.kind === 'morning', 'no morning line');
  // 체력 낮음: 1번만
  await page.evaluate(() => { const G = SH.G; G.say = null; G.p.hp = G.p.maxHp * 0.2; }); await page.waitForTimeout(200); s = await say(); check(s && s.kind === 'low', 'no low-hp line');
  await page.evaluate(() => { SH.G.say = null; }); await page.waitForTimeout(3300); check(!(await say()), 'low-hp line repeats too soon');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
