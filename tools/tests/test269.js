// Build 353: 💖 금화 부활 — 쓰러지면 버튼, 누르면 그 자리에서 부활(스테이지 실패 안 함), 값이 오름, 금화 없으면 안 됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const a = await page.evaluate(async () => { const G = SH.G; G.quests = []; G.gold = 1000; G.nextBoss = 999; G.enemies = []; G.spawnAcc = -1e9; SH.enterStage(0); await new Promise(q => setTimeout(q, 300)); if (G.intro) endIntro(); G.p.x = 40; const x0 = G.p.x; G.p.inv = 0; hurtPlayer(1e9); await new Promise(q => setTimeout(q, 200));
    return { dead: G.p.dead, vis: $('bRevive').style.display !== 'none', txt: $('bRevive').textContent, cost: reviveCost(), x0 }; });
  await page.screenshot({ path: `${OUT}/b353_revive.png` });
  await page.click('#bRevive', { force: true }); await page.waitForTimeout(200);
  const r = await page.evaluate(() => { const G = SH.G; return { dead: G.p.dead, mode: G.mode, x: G.p.x, gold: G.gold, vis: $('bRevive').style.display !== 'none', next: reviveCost(), st: ST.goldRevives }; });
  console.log(JSON.stringify(a), JSON.stringify(r));
  check(a.dead && a.vis && a.txt.includes('부활') && !r.dead && r.mode === 'stage' && Math.abs(r.x - a.x0) < 5 && r.gold === 1000 - a.cost && !r.vis && r.next === a.cost * 2 && r.st === 1, 'gold revive');
  const c = await page.evaluate(async () => { const G = SH.G; G.gold = 0; G.p.inv = 0; hurtPlayer(1e9); await new Promise(q => setTimeout(q, 200)); $('bRevive').click(); return { dead: G.p.dead, no: $('bRevive').classList.contains('no') }; });
  console.log(JSON.stringify(c)); check(c.dead && c.no, 'no gold no revive');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
