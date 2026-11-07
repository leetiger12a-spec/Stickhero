// 퀘스트 바꾸기 (Build 73): 하루 1번 안 끝난 퀘스트 하나를 🔄로 바꿈, 진행도 0, 끝난 퀘스트는 못 바꿈, 저장 유지, 다음 날 다시 가능
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1'));
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.click('#bStart'); await page.waitForTimeout(500);
  await page.evaluate(() => { const G = SH.G; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9;
    G.quests = [{ id: 'wood', goal: 40, prog: 40, done: true }, { id: 'kill', goal: 150, prog: 12, done: false }, { id: 'stone', goal: 20, prog: 3, done: false }]; SH.G.questSwap = false; });
  await page.waitForTimeout(200);
  const btn = async () => page.evaluate(() => [...document.querySelectorAll('#questBox .qsw')].map(x => +x.dataset.i));
  let bs = await btn(); console.log('swap buttons', bs.join()); check(bs.join() === '1,2', 'swap buttons should be on unfinished quests only');
  await page.screenshot({ path: `${OUT}/b73_quest_before.png`, clip: { x: 0, y: 150, width: 260, height: 150 } });
  // 실제 손가락으로 🔄 누르기 (상자 접기가 아니라 바꾸기)
  const bb = await page.locator('#questBox .qsw[data-i="1"]').boundingBox(); check(bb && bb.width >= 18 && bb.height >= 18, 'swap button too small: ' + JSON.stringify(bb));
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(200);
  const a = await page.evaluate(() => ({ q: SH.G.quests.map(q => [q.id, q.prog, q.done]), sw: SH.G.questSwap, open: !document.getElementById('questBox').textContent.includes('▸') }));
  console.log('after swap', JSON.stringify(a));
  check(a.q[1][0] !== 'kill' && a.q[1][1] === 0 && !['wood', 'stone'].includes(a.q[1][0]), 'quest not swapped to a new one');
  check(a.q[0][0] === 'wood' && a.q[0][2] && a.q[2][0] === 'stone' && a.q[2][1] === 3, 'other quests changed');
  check(a.sw && a.open, 'swap flag / box folded by mistake');
  check((await btn()).length === 0, 'swap buttons still shown');
  await page.screenshot({ path: `${OUT}/b73_quest_after.png`, clip: { x: 0, y: 150, width: 260, height: 150 } });
  // 두 번째는 안 됨
  check(await page.evaluate(() => swapQuest(2) === false && SH.G.quests[2].id === 'stone'), 'second swap allowed');
  // 저장 → 이어하기: 오늘 이미 바꿨음이 유지
  await page.evaluate(() => saveGame()); await page.reload(); await page.waitForTimeout(500); await page.click('#bContinue'); await page.waitForTimeout(300);
  check(await page.evaluate(() => SH.G.questSwap === true && document.querySelectorAll('#questBox .qsw').length === 0), 'swap flag not saved');
  // 다음 날: 다시 바꿀 수 있음
  await page.evaluate(() => SH.killBase()); await page.waitForTimeout(2800); await page.click('#bRetry'); await page.waitForTimeout(500);
  const d2 = await page.evaluate(() => ({ day: SH.G.day, sw: SH.G.questSwap, n: document.querySelectorAll('#questBox .qsw').length }));
  console.log('day2', JSON.stringify(d2)); check(d2.day === 2 && !d2.sw && d2.n === 3, 'day2 swap not reset');
  // 접기 누르면 접힘 (🔄 밖)
  const hb = await page.locator('#questBox .qh').boundingBox(); await page.mouse.click(hb.x + 20, hb.y + hb.height / 2); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.getElementById('questBox').textContent.includes('▸') && SH.G.questSwap === false), 'fold broken');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
