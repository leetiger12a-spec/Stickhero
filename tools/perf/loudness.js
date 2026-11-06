// 효과음 크기 재기: 게임 설정 그대로 소리마다 녹음해 가장 큰 0.05초의 음량(dBFS)·최고점 → 기준(SFX_TARGET)과 비교
// 사용: node tools/perf/loudness.js   (http://localhost:8765 필요)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const ctx = await b.newContext();
  await ctx.addInitScript(() => localStorage.setItem('stickhero_story', '1')); const page = await ctx.newPage();
  await page.goto('http://localhost:8765/index.html'); await page.waitForTimeout(500); await page.click('#bStart');
  await page.waitForTimeout(5000);
  const res = await page.evaluate(async () => {
    const src = document.documentElement.innerHTML; const names = [...new Set([...src.matchAll(/case '([a-zA-Z]+)':/g)].map(m => m[1]))].filter(n => !/^(sword|pistol|boomerang|bolt|hammer|w|p|evo|gold|food)$/.test(n));
    const realAC = AC, realMaster = master, out = {};
    for (const n of names) {
      const off = new OfflineAudioContext(1, 44100 * 2.5, 44100), m = off.createGain(); m.gain.value = 0.6; m.connect(off.destination);
      AC = off; master = m; noiseBuf = null; for (const k in sfxLast) delete sfxLast[k];
      let ok = true; try { sfx(n); } catch (e) { ok = false; }
      const buf = await off.startRendering(), d = buf.getChannelData(0); let peak = 0, best = 0; const W = 2205;
      for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      for (let s = 0; s + W < d.length; s += 441) { let e = 0; for (let i = s; i < s + W; i++) e += d[i] * d[i]; best = Math.max(best, Math.sqrt(e / W)); }
      if (peak > 0) out[n] = { rms: +(20 * Math.log10(best)).toFixed(1), peak: +(20 * Math.log10(peak)).toFixed(1), file: !!sampFor.toString().match(new RegExp("case '" + n + "'")) };
    }
    AC = realAC; master = realMaster; noiseBuf = null; return out;
  });
  const rows = Object.entries(res).sort((a, b) => b[1].rms - a[1].rms);
  for (const [n, r] of rows) console.log(n.padEnd(12), String(r.rms).padStart(6), String(r.peak).padStart(6), r.file ? 'file' : 'synth');
  await b.close(); })();
