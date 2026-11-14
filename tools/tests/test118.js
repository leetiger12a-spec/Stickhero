// 🎲 탑 특별 층 (Build 164): 번개·황금·어둠·바람, 보상 배수, 보스 층·5층 아래는 없음
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem('stickhero_story', '1'); localStorage.setItem('stickhero_meta', JSON.stringify({ maxStage: 6, bestFloor: 30, ach: { floor10: true, floor25: true } })); });
  const page = await ctx.newPage(); const OUT = process.env.OUT || 'shots';
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(800); await page.click('#bStart'); await page.waitForTimeout(400);
  const none = await page.evaluate(() => { window.__towerRule = 'bolt'; const r = []; for (const f of [3, 10]) { SH.tower(f); r.push(SH.G.st.rule || null); } return r; });
  check(none[0] === null && none[1] === null, 'no rule on low/boss floor ' + none);
  for (const k of ['bolt', 'gold', 'dark', 'wind']) {
    await page.evaluate(k => { window.__towerRule = k; SH.tower(12); SH.G.p.hp = SH.G.p.maxHp = 1e6; }, k); await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ rule: SH.G.st.rule, name: SH.G.st.def.name, ban: SH.G.banner && SH.G.banner.text }));
    check(r.rule === k && r.ban.includes('12층'), 'rule set ' + k + JSON.stringify(r));
    await page.waitForTimeout(k === 'bolt' ? 2600 : 1500);
    if (k === 'bolt') check(await page.evaluate(() => SH.G.st.bolts.length > 0), 'bolts spawn');
    if (k === 'gold') check(await page.evaluate(() => SH.G.enemies.filter(e => e.golden).length >= 1 || SH.G.enemies.length < 4), 'gold enemies');
    await page.screenshot({ path: `${OUT}/b164_${k}.png` });
  }
  await page.evaluate(() => { window.__towerRule = 'bolt'; SH.tower(13); }); await page.waitForTimeout(1500);
  const hit = await page.evaluate(async () => { const e = SH.G.enemies.find(e => !e.boss) || null; if (!e) return 'noenemy'; const hp = e.hp; SH.G.st.bolts.push({ x: e.x, y: e.y, t: 0.05, fl: 0 }); await new Promise(r => setTimeout(r, 300)); return e.hp < hp || e.dead; });
  check(hit === true, 'bolt hurts enemy ' + hit);
  const pr = await page.evaluate(() => { window.__towerRule = 'wind'; SH.tower(12); const g0 = SH.G.gold; SH.G.enemies.length = 0; stageClear(SH.G.p.x, SH.G.p.y); return SH.G.gold - g0; });
  check(pr === Math.round((15 + 12 * 6) * 1.3), 'wind prize ' + pr);
  await b.close(); console.log('ERRORS:', errors.length); errors.forEach(e => console.log(e)); process.exit(errors.length ? 1 : 0);
})();
