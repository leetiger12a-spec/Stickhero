// 겨울 이벤트 (Build 137): 눈사람·쿠키맨 그림, 마을은 12~1월(시험은 __winter)·얼음 나라는 언제나 섞여 나옴, 잡으면 선물·사탕, 선물 3가지·사탕 회복+빨라짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  check(await page.evaluate(() => !!SPR.e_snowman && !!SPR.e_ginger && !!WICON.i_gift && !!WICON.i_candy), 'pictures not loaded');
  check(await page.evaluate(() => winterSeason(new Date(2026, 11, 20)) && winterSeason(new Date(2027, 0, 5)) && !winterSeason(new Date(2026, 6, 1))), 'season dates');
  // 마을: 이벤트 꺼짐 → 안 섞임, 켬 → 약 12%
  const mix = await page.evaluate(() => { const cnt = () => { let w = 0; for (let i = 0; i < 2000; i++) if (winterSwap('grunt') !== 'grunt') w++; return w; }; window.__winter = false; const a = cnt(); window.__winter = true; const b = cnt(); return [a, b]; });
  console.log('mix off/on', mix.join()); check(mix[0] === 0 && mix[1] > 160 && mix[1] < 330, 'mix rate wrong');
  // 얼음 나라는 철 상관없이
  const ice = await page.evaluate(() => { window.__winter = false; const G = SH.G; G.p.hp = G.p.maxHp = 1e9; const i = STAGES.findIndex(s => THEMES[s.th].tex === 'ice'); enterStage(i); G.intro = null; let w = 0; for (let k = 0; k < 1000; k++) if (winterSwap('grunt') !== 'grunt') w++; returnBase(true); if (SH.state === 'result') SH.ok(); state = 'play'; showOv(null); return w; });
  check(ice > 60, 'not in ice land: ' + ice);
  // 눈사람 등장 + 사진
  await page.evaluate(() => { window.__winter = true; const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; G.weapons = {}; G.p.meleeCd = 99; G.need = 1e9; G.p.x = 0; G.p.y = 120;
    for (const [t, x] of [['e_snowman', -70], ['e_ginger', 70]]) { const e = winterFix(makeEnemy(t, x, 40)); e.spd = 0; G.enemies.push(e); } dropItem('gift', -40, 200); dropItem('candy', 40, 200); });
  await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/b137_winter.png` });
  check(await page.evaluate(() => SH.G.banner && SH.G.banner.text.includes('겨울')), 'no winter banner');
  // 떨어뜨리기 비율
  const drops = await page.evaluate(() => { const G = SH.G; let g = 0, c = 0; for (let i = 0; i < 1000; i++) { G.items = []; const e = makeEnemy('e_snowman', 500, 500); G.enemies.push(e); killEnemy(e); g += G.items.filter(x => x.kind === 'gift').length; c += G.items.filter(x => x.kind === 'candy').length; } G.items = []; G.enemies = []; G.gems = []; G.coins = []; return [g, c]; });
  console.log('gift/candy /1000', drops.join()); check(drops[0] > 90 && drops[0] < 220 && drops[1] > 90 && drops[1] < 220, 'drop rates wrong');
  // 선물·사탕 줍기
  const r = await page.evaluate(async () => { const G = SH.G, p = G.p; p.hp = p.maxHp - 50; const g0 = G.gold, x0 = G.xp, c0 = (G.chests || []).length; dropItem('gift', p.x, p.y - 10); await new Promise(q => setTimeout(q, 150));
    const gift = G.gold > g0 || G.xp > x0 || (G.chests || []).length > c0; const h0 = p.hp; dropItem('candy', p.x, p.y - 10); await new Promise(q => setTimeout(q, 150)); return { gift, heal: p.hp - h0, fast: G.candyT > 5, st: SH.state, dead: p.dead, items: G.items.length }; });
  console.log(JSON.stringify(r)); check(r.gift && r.heal === 20 && r.fast, 'pickup effects wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
