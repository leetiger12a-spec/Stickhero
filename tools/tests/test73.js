// 레벨업 카드 빼기 (Build 114): 한 판에 2번, 🚫 누르고 카드 누르면 그 카드는 이번 판에 다시 안 나옴, 진화·치킨 카드는 못 뺌, 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.pending = 1; openLevelUp(); });
  check(await page.evaluate(() => $('bBan').textContent.includes('(2)')), 'ban button wrong');
  await page.click('#bBan'); await page.waitForTimeout(100);
  check(await page.evaluate(() => banMode && $('banHint').style.display === '' && document.querySelectorAll('#cards .card.banable').length > 0), 'ban mode not shown');
  await page.screenshot({ path: `${OUT}/b114_ban.png` });
  const first = await page.evaluate(() => choices[0].kind + ':' + choices[0].id);
  await page.click('#cards .card >> nth=0'); await page.waitForTimeout(150);
  const r = await page.evaluate(() => ({ state: SH.state, bans: SH.G.bans, banned: SH.G.banned, mode: banMode }));
  console.log('first', first, JSON.stringify(r)); check(r.state === 'levelup' && r.bans === 1 && r.banned[0] === first && !r.mode, 'ban did not apply');
  // 뺀 카드는 100번 다시 뽑아도 안 나옴
  const again = await page.evaluate(k => { let hit = 0; for (let i = 0; i < 100; i++) { openLevelUp(); if (choices.some(c => c.kind + ':' + c.id === k)) hit++; } return hit; }, first);
  check(again === 0, 'banned card appeared ' + again);
  // 진화 카드는 못 뺌
  const evo = await page.evaluate(() => { const G = SH.G; G.weapons = { pistol: 5 }; G.passives = { haste: 1 }; banMode = true; openLevelUp(); const i = choices.findIndex(c => c.kind === 'evo'); banCard(i); return [i, G.bans]; });
  check(evo[0] >= 0 && evo[1] === 1, 'evo card banned');
  // 저장
  check(await page.evaluate(() => { banMode = false; SH.choose(0); saveGame(); const d = JSON.parse(localStorage.getItem('stickhero_save')); return d.bans === 1 && d.banned.length === 1; }), 'not saved');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
