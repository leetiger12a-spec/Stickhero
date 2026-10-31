// 능력·회복·구슬 그림: 불러오기, 레벨업 카드(능력·치킨), 진화 도감 작은 그림, 땅의 하트·경험치 구슬 그림
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('fail ' + r.url()));
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const n = await page.evaluate(() => Object.keys(WICON).length); console.log('icons', n); check(n === 23, 'icons not 23');
  await page.click('#bStart'); await page.waitForTimeout(300);
  // 땅에 구슬 3색 + 하트
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.p.magnet = 0;
    const x = G.p.x, y = G.p.y; [1, 5, 20, 1, 5, 20].forEach((v, i) => G.gems.push({ x: x - 75 + i * 30, y: y - 70, v, vx: 0, vy: 0, pull: false, bob: 0 }));
    G.hearts.push({ x: x + 40, y: y + 40, bob: 0 }); G.hearts.push({ x: x - 40, y: y + 40, bob: 0 }); });
  await page.waitForTimeout(300);
  check(await page.evaluate(() => Object.keys(ICO_BAKE).length >= 3), 'gems not baked');
  await page.screenshot({ path: `${OUT}/b54_world.png`, clip: { x: 75, y: 262, width: 240, height: 260 } });
  // 레벨업 카드: 고를 수 있는 건 힘뿐 (카드가 매번 같게) → 힘 카드 그림 + 치킨 카드 그림
  await page.evaluate(() => { const G = SH.G; G.weapons = {}; for (const id in WEAP) G.weapons[id] = MAX_WLV + 1; G.weapons.sword = 5; G.passives = {}; for (const id in PASS) if (id !== 'power') G.passives[id] = PASS[id].max; openLevelUp(); });
  await page.waitForTimeout(400);
  const cards = await page.evaluate(() => [...document.querySelectorAll('#cards .card')].map(c => (c.querySelector('.ic img') || {}).src || c.querySelector('.ic').textContent));
  console.log(cards.map(s => s.replace(/.*img\//, '')).join(' | '));
  check(cards.some(s => s.includes('p_power')), 'power card no image');
  check(cards.every(s => s.includes('.webp')), 'card without image');   // 힘 + 치킨 카드
  const hint = await page.evaluate(() => document.querySelectorAll('#cards img.mi').length); check(hint >= 1, 'hint mini icon missing');
  await page.screenshot({ path: `${OUT}/b54_cards.png` });
  await page.click('#cards .card >> nth=0'); await page.waitForTimeout(300);
  for (let i = 0; i < 6 && await page.evaluate(() => state === 'levelup'); i++) { await page.click('#cards .card >> nth=0'); await page.waitForTimeout(300); }
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bEvoP'); await page.waitForTimeout(200);
  const mi = await page.evaluate(() => document.querySelectorAll('#evoList img.mi').length); console.log('evo mini', mi); check(mi >= 12, 'evo mini icons missing');
  await page.screenshot({ path: `${OUT}/b54_evo.png` });
  // 모두 최대면 치킨 카드 → 치킨 그림
  await page.click('#bEvoOk'); await page.click('#bResume'); await page.waitForTimeout(200);
  const ch = await page.evaluate(() => { const G = SH.G; for (const id in WEAP) G.weapons[id] = MAX_WLV + 1; for (const id in PASS) G.passives[id] = PASS[id].max; openLevelUp();
    return [...document.querySelectorAll('#cards .card .ic img')].map(i => i.src).join(); });
  console.log('max cards', ch.replace(/http[^,]*img\//g, '')); check(ch.includes('i_chicken'), 'chicken image missing');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
