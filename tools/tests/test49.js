// 공격 그림 (Build 87): 적·보스 총알, 로켓 주먹, 영웅 얼음 조각·석궁 화살이 그림으로 (모두 진행 방향으로 돌림)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  const n = await page.evaluate(() => PROJ_IMG.filter(k => WICON[k]).length); console.log('proj images', n); check(n === 8, 'proj images not 8');
  // 멈춘 총알을 영웅 둘레에 늘어놓고 한 프레임에 그려진 그림 세기
  const seen = await page.evaluate(async () => {
    const G = SH.G, p = G.p; G.nextBoss = 999; G.nextWave = 999; G.spawnAcc = -1e9; G.enemies = []; p.inv = 0; p.hp = p.maxHp = 1e6;   /* inv를 크게 하면 화면이 빨갛게 덮임 */
    G.weapons = { ice: 1, xbow: 1 };
    const kinds = [{ slime: true }, { ice: true }, { skull: true }, { cannon: true }, { cannon: true, rock: true }, {}, { arrow: true }];
    const mk = () => { G.ebullets = kinds.map((k, i) => ({ x: p.x - 150 + (i % 4) * 100, y: p.y - 150 - Math.floor(i / 4) * 70, vx: i % 2 ? 0.001 : -0.001, vy: 0.0005, r: 9, dmg: 0, life: 99, ...k }));
      G.fists = [{ x: p.x + 60, y: p.y - 230, vx: 0, vy: 0, t: 0, back: false, owner: { x: p.x, y: p.y, dead: false }, dmg: 0, hit: true, rot: 0.3 }]; };
    mk(); const D = window.drawProj, c = {}; window.drawProj = function (nm) { const ok = D.apply(this, arguments); if (ok) c[nm] = (c[nm] || 0) + 1; return ok; };
    await new Promise(r => setTimeout(r, 100)); mk(); await new Promise(r => setTimeout(r, 60)); window.drawProj = D; return c;
  });
  console.log('drawn', JSON.stringify(seen));
  check(['pj_slime', 'pj_ice', 'pj_skull', 'pj_cannon', 'pj_rock', 'pj_orb', 'pj_bolt', 'pj_fist'].every(k => seen[k] > 0), 'some projectile pictures not drawn');
  await page.evaluate(() => { const G = SH.G, p = G.p; G.ebullets.forEach(b => b.life = 99); });
  await page.screenshot({ path: `${OUT}/b87_proj.png` });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); await b.close(); process.exit(errors.length ? 1 : 0);
})();
