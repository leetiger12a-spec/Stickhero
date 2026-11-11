// 봇 똑똑하게 고르기 (Build 133): BOT_PICK=smart로 봇을 짧게(1판 3분) 돌리면 오류 0, 카드 빼기를 써서 무기를 5개 안쪽으로 모음
const { execFileSync } = require('child_process');
const out = execFileSync('node', [__dirname + '/../bot.js', '1', '3'], { env: Object.assign({}, process.env, { BOT_URL: 'http://localhost:8765/index.html', BOT_PICK: 'smart', BOT_STAGE: '15' }), encoding: 'utf8', timeout: 300000 });
const errors = []; const check = (c, m) => { if (!c) errors.push(m); };
const m = out.match(/"rerolls":(\d+),"bans":(\d+),"nW":(\d+)/); console.log(m ? m[0] : 'no stats');
check(m, 'no smart stats'); if (m) { check(+m[3] <= 6, 'too many weapons: ' + m[3]); check(+m[2] >= 1 || +m[3] <= 5, 'never banned'); }
check(/ERRORS: 0/.test(out), 'bot errors');
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK'); process.exit(errors.length ? 1 : 0);
