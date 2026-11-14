// 기록실 (Build 103): 시작 화면 📊 기록 → 14칸 (놀이 시간·잡은 적·보스·…), 놀이 시간은 게임 중에만 1초씩 늘고 저장됨
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const t0 = await page.evaluate(() => ST.playT || 0); await page.waitForTimeout(2100); check(await page.evaluate(() => ST.playT || 0) === t0, 'play time grew on title');
  await page.click('#bStart'); await page.waitForTimeout(300);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; G.p.inv = 0; G.p.hp = G.p.maxHp = 1e6; ST.playT = 9; }); await page.waitForTimeout(2300);
  const pt = await page.evaluate(() => [ST.playT, (JSON.parse(localStorage.getItem('stickhero_meta')).st || {}).playT]); console.log('playT', pt.join()); check(pt[0] >= 11 && pt[1] >= 10, 'play time not counted/saved');
  await page.evaluate(() => { ST.kills = 12345; ST.bosses = 7; ST.ghosts = 3; ST.playT = 3725; SH.killBase && 0; state = 'title'; showOv('ovTitle'); });
  await page.click('#bStats'); await page.waitForTimeout(300);
  const rows = await page.evaluate(() => [...document.querySelectorAll('#statList .st')].map(e => e.textContent)); console.log(rows.join(' / '));
  check(rows.length === 27, 'rows not 27');   /* Build 172: 5칸 추가 */   /* Build 146: 8칸 추가 */ check(rows.some(r => r.includes('12,345')) && rows.some(r => r.includes('1시간 2분')) && rows.some(r => r.includes('유령') && r.endsWith('3')), 'values wrong');
  await page.screenshot({ path: `${OUT}/b103_stats.png` });
  await page.click('#bStatsOk'); await page.waitForTimeout(200); check(await page.evaluate(() => SH.state === 'title' && $('ovTitle').classList.contains('show')), 'close failed');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
