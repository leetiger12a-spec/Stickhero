// 얼음 나라 (Build 94): 모험 지도 11~15칸, 얼음 테마(장식 3종·땅 장식 4종), 칸 보스 골렘, 15칸 황금 골렘은 도망 안 감, 엔딩은 10칸에서만
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({ n: STAGES.length, fin: FINAL_IDX, ice: STAGES.slice(11).map(d => d.name + ':' + THEMES[d.th].name + ':' + d.goal), img: ['icepillar', 'snowman', 'snowtree'].filter(k => SPR[k]).length, dec: ['d_snowball', 'd_icecrys', 'd_icepud', 'd_snowrock'].filter(k => WICON[k]).length }));
  console.log(JSON.stringify(info)); check(info.n === 20 && info.fin === 9 && info.ice.length === 9 && info.ice.slice(0, 4).every(t => t.includes(':얼음:')) && info.img === 3 && info.dec === 4, 'ice land setup wrong');
  // 지도: 10칸까지 깨면 11칸 열림
  const mp = await page.evaluate(() => { SH.G.stageN = 10; openMap(); return { nodes: document.querySelectorAll('.mnode').length, open: [...document.querySelectorAll('.mnode')].filter(b => !b.classList.contains('lock')).length }; });
  console.log('map', JSON.stringify(mp)); check(mp.nodes === 20 && mp.open === 11, 'map nodes wrong');
  await page.screenshot({ path: `${OUT}/b94_map.png` });
  await page.evaluate(() => closeMap());
  // 11칸: 얼음 장식 그려짐
  const dc = await page.evaluate(async () => { const G = SH.G; enterStage(11); G.intro = null; G.p.hp = G.p.maxHp = 1e6; G.p.y = -G.st.L * 0.4;   /* Build 158: 11칸은 그냥 숲, 얼음은 12칸부터 */
    const D = window.drawDecal, c = {}; window.drawDecal = function (n) { const ok = D.apply(this, arguments); if (ok) c[n] = (c[n] || 0) + 1; return ok; };
    await new Promise(r => setTimeout(r, 300)); window.drawDecal = D; return { decals: c, deco: [...new Set(G.st.deco.map(d => d.kind))], th: G.st.th.name }; });
  console.log('stage 11', JSON.stringify(dc)); check(dc.th === '얼음' && dc.deco.join() === 'ice' && Object.keys(dc.decals).length >= 2 && Object.keys(dc.decals).every(k => ['d_snowball', 'd_icecrys', 'd_icepud', 'd_snowrock'].includes(k)), 'ice decorations wrong');
  await page.screenshot({ path: `${OUT}/b94_stage.png` });
  // 칸 보스
  const bs = await page.evaluate(() => { const G = SH.G, out = []; for (const i of [10, 11, 13, 14]) { enterStage(i); G.intro = null; SH.spawnBoss(); SH.skipIntro(); out.push([i + 1, G.boss.name, G.boss.fleeT > 1e8 ? 'no-flee' : G.boss.fleeT ? 'flee' : '']); G.enemies = []; G.boss = null; returnBase(false); } return out; });
  console.log('bosses', JSON.stringify(bs)); check(bs.map(x => x[1]).join() === '숲 골렘,얼음 골렘,용암 골렘,황금 골렘' && bs[3][2] === 'no-flee', 'ice stage bosses wrong');
  // 10칸을 처음 깨면 엔딩, 15칸을 처음 깨면 얼음 나라 정복 (엔딩 아님)
  const fin = await page.evaluate(() => { const G = SH.G; G.stageN = 9; enterStage(9); G.st.stars = 3; G.st.clear = true; returnBase(true); return { btn: $('bClrOk').textContent, title: $('clrTitle').textContent }; });
  console.log('final clear', JSON.stringify(fin)); check(fin.btn.startsWith('엔딩'), 'ending not at final');
  await page.evaluate(() => { state = 'play'; showOv(null); });
  const ic = await page.evaluate(() => { const G = SH.G; G.stageN = 14; enterStage(14); G.st.stars = 3; G.st.clear = true; returnBase(true); return { btn: $('bClrOk').textContent, title: $('clrTitle').textContent, n: G.stageN }; });
  console.log('ice clear', JSON.stringify(ic)); check(!ic.btn.startsWith('엔딩') && ic.title.includes('얼음 나라 정복') && ic.n === 15, 'ice land clear wrong');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
