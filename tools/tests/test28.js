// 진화 도감: 업적 화면·일시정지에서 열기, 못 만든 진화는 ??? + 조합, 만든 진화는 이름, 지금 상태 표시, 새로고침 뒤 유지
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html');
  const sub = () => page.evaluate(() => document.getElementById('evoSub').textContent);
  const rows = () => page.evaluate(() => [...document.querySelectorAll('#evoList .arow')].map(r => r.textContent));
  // 시작 화면 → 업적 → 진화 도감 → 업적으로 돌아오기
  await page.click('#bAchT'); await page.waitForTimeout(150); await page.click('#bEvoA'); await page.waitForTimeout(150);
  console.log(await sub()); check((await sub()).includes('0/6'), 'count not 0/6');
  let r = await rows(); check(r.length === 6 && r.every(t => t.includes('???')), 'rows wrong');
  check(r[0].includes('회전 칼') && r[0].includes('힘'), 'combo missing');
  check(r.some(t => t.includes('🔒')), 'lock note missing');
  await page.screenshot({ path: `${OUT}/b51_evo_title.png` });
  await page.click('#bEvoOk'); await page.waitForTimeout(150);
  check(await page.evaluate(() => state === 'ach' && document.getElementById('ovAch').classList.contains('show')), 'not back to ach');
  await page.click('#bAchOk'); await page.click('#bStart'); await page.waitForTimeout(300);
  // 게임 중: 검 Lv5 + 힘, 권총 진화 완료
  await page.evaluate(() => { const G = SH.G; G.weapons.sword = 5; G.passives.power = 1; G.weapons.pistol = 6; stSet('evoT', 'pistol'); });
  await page.click('#bPause'); await page.waitForTimeout(150); await page.click('#bEvoP'); await page.waitForTimeout(150);
  console.log(await sub()); check((await sub()).includes('1/6'), 'count not 1/6');
  r = await rows(); console.log(r.slice(0, 2).join(' | '));
  check(r[0].includes('Lv5/5') && r[0].includes('있음'), 'sword now state wrong');
  check(r[1].includes('개틀링') && r[1].includes('진화 완료') && !r[1].includes('???'), 'pistol not shown');
  await page.screenshot({ path: `${OUT}/b51_evo_pause.png` });
  await page.click('#bEvoOk'); await page.waitForTimeout(150);
  check(await page.evaluate(() => state === 'paused' && document.getElementById('ovPause').classList.contains('show')), 'not back to pause');
  await page.click('#bResume'); await page.waitForTimeout(1300);
  // 새로고침해도 기록 유지
  await page.reload(); await page.waitForTimeout(600);
  await page.click('#bAchT'); await page.click('#bEvoA'); await page.waitForTimeout(150);
  check((await sub()).includes('1/6'), 'record lost after reload');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
