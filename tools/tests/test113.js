// 해골 왕국 (Build 159, 아들 생각): 모험 16~20칸 — 골렘과 같은 5가지 컨셉(번개 바위·용암·얼음·숲·황금) 해골 왕, 칸마다 컨셉에 맞는 땅, 지도 20칸, 20칸 깨면 정복
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({ n: STAGES.length, row: STAGES.slice(15).map(d => d.name + ':' + THEMES[d.th].tex + ':' + BOSSES[d.boss].name), spr: [11, 12, 13, 14, 15].filter(i => SPR['boss' + i]).length }));
  console.log(JSON.stringify(info)); check(info.n === 20 && info.spr === 5, 'stages/sprites');
  const want = [['dungeon', '번개'], ['volcano', '용암'], ['ice', '얼음'], ['grass', '숲'], ['castle', '황금']];
  check(info.row.every((r, i) => r.includes(':' + want[i][0] + ':') && r.includes(want[i][1] + ' 해골 왕')), 'concept/theme mismatch');
  // 칸마다 보스가 맞게 나옴
  const names = [];
  for (let i = 15; i < 20; i++) names.push(await page.evaluate(i => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.stageN = 20; enterStage(i); G.intro = null; G.enemies = []; SH.spawnBoss(); G.intro = null; const n = G.boss.name, sp = G.boss.spr; returnBase(false); if (SH.state === 'result') SH.ok(); state = 'play'; showOv(null); return n + '/' + sp; }, i));
  console.log(names.join(' · ')); check(names.every((n, k) => n.startsWith(['번개', '용암', '얼음', '숲', '황금'][k]) && n.endsWith('boss' + (11 + k))), 'stage boss wrong');
  // 지도 20칸
  const mp = await page.evaluate(() => { SH.G.stageN = 16; openMap(); return document.querySelectorAll('.mnode').length; }); check(mp === 20, 'map not 20');
  await page.evaluate(() => { const n = document.querySelector('.mnode[data-i="17"]'); n && n.scrollIntoView({ block: 'center' }); }); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/b159_map.png` });
  await page.evaluate(() => closeMap());
  // 보스 사진 (용암 해골 왕)
  await page.evaluate(() => { const G = SH.G; enterStage(16); G.intro = null; G.enemies = []; SH.spawnBoss(); G.intro = null; G.boss.x = 0; G.boss.y = G.p.y - 150; G.boss.spd = 0; G.cam.y = G.p.y - 80; }); await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/b159_boss.png` }); await page.evaluate(() => { returnBase(false); if (SH.state === 'result') SH.ok(); });
  // 20칸 첫 클리어 → 정복 화면 + 업적
  const r = await page.evaluate(() => { const G = SH.G; G.stageN = 19; G.stars = Array(19).fill(1); enterStage(19); G.intro = null; G.st.stars = 1; G.st.clear = true; returnBase(true); return { t: $('clrTitle').textContent, n: G.stageN }; });
  console.log(JSON.stringify(r)); check(r.t.includes('해골 왕국 정복') && r.n === 20, 'conquer screen');
  check(await page.evaluate(() => { checkAch(); return !!((JSON.parse(localStorage.getItem('stickhero_meta')).ach || {}).skull20); }), 'skull20 ach');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
