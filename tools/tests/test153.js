// 🧹 화면 글자 줄이기 (Build 218): 퀘스트 접힘 · 싸울 땐 안내 글/이름표 숨김 · 피해 숫자 줄임 · '돌진!' 없음 · 알림 짧게
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(600);
  // 퀘스트: 처음엔 한 줄
  const q0 = await page.evaluate(() => { updQuestBox(); return document.querySelectorAll('#questBox .q').length; });
  check(q0 === 0, 'quest folded by default ' + q0);
  await page.click('#questBox'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.querySelectorAll('#questBox .q').length >= 1), 'quest opens on tap');
  await page.click('#questBox'); await page.waitForTimeout(100);
  // 싸우는 중 판단
  const f = await page.evaluate(async () => {
    const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.hp = G.p.maxHp = 1e9;
    await new Promise(q => setTimeout(q, 400)); const calm = !fighting();
    for (let i = 0; i < 30; i++) { const e = makeEnemy('tank', G.p.x + 40 + (i % 6) * 15, G.p.y - 40 + Math.floor(i / 6) * 15); e.hp = e.maxHp = 1e9; e.dmg = 0; G.enemies.push(e); }
    await new Promise(q => setTimeout(q, 400)); const fight = fighting();
    let maxN = 0, maxC = 0, dash = 0;
    for (let k = 0; k < 20; k++) { await new Promise(q => setTimeout(q, 100)); maxN = Math.max(maxN, G.texts.filter(t => t.dmg).length); maxC = Math.max(maxC, G.texts.filter(t => t.crit).length); dash += G.texts.filter(t => t.text === '돌진!').length; }
    banner('테스트', '알림', '#fff', 5); const bd = G.banner.dur;
    return { calm, fight, maxN, maxC, dash, bd };
  });
  console.log(JSON.stringify(f));
  check(f.calm && f.fight, 'fighting() ' + f.calm + f.fight);
  check(f.maxN <= 4 && f.maxC <= 3, 'damage numbers ' + f.maxN + '/' + f.maxC);
  check(f.dash === 0, 'no 돌진 text'); check(f.bd <= 2.2, 'banner short ' + f.bd);
  await page.screenshot({ path: `${OUT}/b218_clean.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
