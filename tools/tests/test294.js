// Build 394: ❄ 투기장 눈보라 웨이브 — 눈사람·쿠키맨만 나오고, 눈발 그림, 영웅은 안 느려짐
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); window.__noGold = true; window.__eliteP = 0; window.__arenaRule = 'snoww'; });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots'; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(900); await page.click('#bStart'); await page.waitForTimeout(400);
  await page.evaluate(() => { const G = SH.G; G.stageN = 3; SH.openMap(); }); await page.click('#bArena'); await page.click('#bGoArena'); await page.waitForTimeout(300);
  const r = await page.evaluate(async () => { const G = SH.G; G.p.hp = G.p.maxHp = 1e9; G.st.arenaRule = 'snoww'; G.enemies = [];
    let strokes = 0; const f = CanvasRenderingContext2D.prototype.stroke; CanvasRenderingContext2D.prototype.stroke = function () { strokes++; return f.apply(this, arguments); };
    G.st.acc = 8; await new Promise(q => setTimeout(q, 1500)); CanvasRenderingContext2D.prototype.stroke = f;
    const types = [...new Set(G.enemies.filter(e => !e.small).map(e => e.type))]; return { types, n: G.enemies.length, snowW: G.enemies.every(e => e.small || e.snowW), slow: !!(G.st.blizOn > 0), rules: Object.keys(ARENA_RULES).length }; });
  console.log(JSON.stringify(r)); check(r.n >= 4 && r.types.every(t => t === 'e_snowman' || t === 'e_ginger') && r.snowW, 'only winter monsters'); check(!r.slow && r.rules === 8, 'no slow blizzard, 8 rules');
  await page.screenshot({ path: `${OUT}/b394_snowwave.png` });
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
