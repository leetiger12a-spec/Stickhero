// Build 395: 🗼 화려한 탑 안 — 탑 층에서 새 그림(성벽·톱니·화로·깃발·마법진)을 그리고, 보스 층은 보스 그림, 오류 0
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const run = async f => { const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
    await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ bestFloor: 23, maxStage: 12 })); window.__noGold = true; });
    const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(1200); await page.click('#bStart'); await page.waitForTimeout(400);
    await page.evaluate(() => { SH.G.stageN = 12; SH.openMap(); }); await page.waitForTimeout(300); await page.click('#bTower'); await page.waitForTimeout(300); await page.evaluate(f => towerGo(f), f); await page.waitForTimeout(1600);
    const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; const seen = new Set(), d = CanvasRenderingContext2D.prototype.drawImage;
      const names = ['tf_wall', 'tf_wall_top', 'tf_wall_boss', 'tf_wall_boss_top', 'tf_brazier', 'tf_banner', 'tf_banner_boss', 'tf_circle'];
      CanvasRenderingContext2D.prototype.drawImage = function (img) { for (const n of names) if (img === SPR[n]) seen.add(n); return d.apply(this, arguments); };
      await new Promise(q => setTimeout(q, 800)); CanvasRenderingContext2D.prototype.drawImage = d; if (TF_CA.some(Boolean)) seen.add('tf_circle'); return { pat: !!TEX.tower, seen: [...seen], tower: G.st && G.st.tower, loaded: names.every(n => SPR[n]) }; });
    await ctx.close(); return r; };
  const a = await run(4), bo = await run(10);
  console.log(JSON.stringify(a), JSON.stringify(bo));
  check(a.pat && a.loaded && a.tower === 4 && ['tf_wall', 'tf_brazier', 'tf_circle'].every(n => a.seen.includes(n)) && !a.seen.includes('tf_wall_boss'), 'normal floor art');
  check(bo.tower === 10 && ['tf_wall_boss', 'tf_circle'].every(n => bo.seen.includes(n)) && !bo.seen.includes('tf_wall'), 'boss floor art');
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
