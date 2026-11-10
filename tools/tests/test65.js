// 이번 주 도전 (Build 105): 시작 화면 버튼으로 켜고/끄기(저장), 켜고 시작하면 이번 주 규칙 적용, 규칙 4종 효과, 보스 3마리 = 금고 🪙300 (주 1번)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800);
  const txt = () => page.evaluate(() => $('bWeekly').textContent);
  let t = await txt(); console.log(t); check(t.includes('꺼짐'), 'should start off');
  // 꺼진 채 시작 → 규칙 없음
  await page.click('#bStart'); await page.waitForTimeout(300); check(await page.evaluate(() => !SH.G.weekly), 'weekly on while off');
  await page.reload(); await page.waitForTimeout(700);
  await page.click('#bWeekly'); await page.waitForTimeout(150); t = await txt(); check(t.includes('켜짐'), 'toggle failed');
  await page.screenshot({ path: `${OUT}/b105_title.png` });
  await page.reload(); await page.waitForTimeout(700); check((await txt()).includes('켜짐'), 'toggle not saved');
  // 규칙 4종 효과 (주를 바꿔 가며)
  const eff = await page.evaluate(() => { const out = {};
    for (const w of WEEKLY.map(w => w.id)) { WEEKLY_FORCE = w; startGame(); const G = SH.G, e = makeEnemy('grunt', 0, 0), base = ETYPES.grunt;
      out[w] = { weekly: G.weekly, hp: +(e.maxHp / (base.hp * DF().ehp)).toFixed(2), gold: e.gold / base.gold, spd: +(G.p.speed / 150).toFixed(2), weapons: Object.keys(G.weapons).join('+') }; }
    return out; }).catch(e => ({ err: e.message }));
  console.log('effects', JSON.stringify(eff));
  check(eff.giant && eff.giant.hp === 1.6 && eff.giant.gold === 2, 'giant wrong'); check(eff.swift && eff.swift.spd === 1.15, 'swift hero speed wrong');
  check(eff.magic && eff.magic.weapons.includes('bolt') && eff.magic.weapons.includes('ice'), 'magic wrong'); check(eff.swarm && eff.swarm.hp === 0.6, 'swarm wrong');
  // 보스 3마리 → 금고 +300, 두 번째는 안 줌
  const r = await page.evaluate(() => { WEEKLY_FORCE = 'giant'; startGame(); const bank = () => (JSON.parse(localStorage.getItem('stickhero_meta')) || {}).bank || 0, b0 = bank();
    weeklyBoss(); weeklyBoss(); const b2 = bank(); weeklyBoss(); const b3 = bank(); SH.G.weeklyB = 0; weeklyBoss(); weeklyBoss(); weeklyBoss(); return [b2 - b0, b3 - b0, bank() - b0]; });
  console.log('bank', r.join()); check(r[0] === 0 && r[1] === 300 && r[2] === 300, 'weekly reward wrong');
  check((await txt()).includes('보상 받음') || await page.evaluate(() => { refreshWeekly(); return $('bWeekly').textContent.includes('보상 받음'); }), 'done mark missing');
  // 저장·이어하기에 규칙 유지
  const kept = await page.evaluate(() => { saveGame(); const d = JSON.parse(localStorage.getItem('stickhero_save')); return d && d.weekly; }); check(kept === 'giant', 'weekly not saved: ' + kept);
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
