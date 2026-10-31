# 글꼴 줄이기: index.html에 실제로 쓰인 글자만 남겨 fonts/*.woff2로 저장 (원본 art/fonts/*.ttf, SIL OFL 1.1)
# 사용: python3 tools/fonts.py          → 새로 만들기 (게임 글자를 바꾸면 다시 실행)
#       python3 tools/fonts.py --check  → index.html 글자가 글꼴에 다 들어 있는지 확인 (없으면 종료 코드 1)
import sys, re
from fontTools import subset
from fontTools.ttLib import TTFont
FONTS = [('Jua', 'fonts/jua.woff2'), ('BlackHanSans', 'fonts/blackhansans.woff2')]
html = open('index.html', encoding='utf-8').read()
need = {c for c in html if '가' <= c <= '힣' or 'ㄱ' <= c <= 'ㆎ'}   # 한글 글자만 (이모지는 기기 글꼴)
need |= {chr(c) for c in range(32, 127)} | set('·…→←↑↓×°%~★☆♥「」『』《》“”‘’')
if '--check' in sys.argv:
    bad = 0
    for src, out in FONTS:
        full = TTFont(f'art/fonts/{src}.ttf').getBestCmap(); cm = TTFont(out).getBestCmap()
        miss = sorted(c for c in need if ord(c) in full and ord(c) not in cm)   # 원본 글꼴에 있는데 줄인 글꼴에 없는 글자
        if miss: print(out, '빠진 글자', ''.join(miss)); bad = 1
    print('OK' if not bad else '→ python3 tools/fonts.py 로 다시 만드세요'); sys.exit(bad)
for src, out in FONTS:
    font = TTFont(f'art/fonts/{src}.ttf')
    cm = font.getBestCmap(); text = ''.join(c for c in need if ord(c) in cm)
    opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.name_IDs = ['*']; opt.notdef_outline = True
    s = subset.Subsetter(opt); s.populate(text=text); s.subset(font); font.flavor = 'woff2'; font.save(out)
    print(out, len(text), '글자')
