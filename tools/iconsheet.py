# 아이콘 격자 시트 → 아이콘마다 webp (Build 292)
# 사용: python3 tools/iconsheet.py 시트.png 접두사 이름1,이름2,... [cols=4] [rows=4] [h=128] [nolabel=1]
# 칸마다 가장자리와 이어진 흰 배경만 지우고(안쪽 흰색은 남김), 그림만 잘라 높이 h로 줄여 img/접두사_이름.webp
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, pre, names = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
o = dict(a.split('=', 1) for a in sys.argv[4:]); C, R, TH = int(o.get('cols', 4)), int(o.get('rows', 4)), int(o.get('h', 128))
A = np.asarray(Image.open(src).convert('RGB')).astype(np.int16); H, W = A.shape[:2]
for i, nm in enumerate(names):
    r, c = divmod(i, C); a = A[r * H // R:(r + 1) * H // R, c * W // C:(c + 1) * W // C]
    bg = (a.min(-1) > 225) & (a.max(-1) - a.min(-1) < 30); lb, _ = ndimage.label(bg)
    edge = set(np.unique(np.concatenate([lb[0], lb[-1], lb[:, 0], lb[:, -1]]))) - {0}
    m = ~np.isin(lb, list(edge)); lab, k = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, k + 1))
    m = np.isin(lab, [j + 1 for j, v in enumerate(sz) if v > 40])
    if o.get('nolabel'):   # Build 327: 그림 아래 따로 떨어진 글자(라벨) 조각은 버림 — 가장 큰 덩어리 아래끝보다 아래에서 시작하는 조각
        big = int(np.argmax(sz)) + 1; bb = ndimage.find_objects(lab)[big - 1]; obs = ndimage.find_objects(lab)
        m = np.isin(lab, [j + 1 for j, v in enumerate(sz) if v > 40 and obs[j][0].start <= bb[0].stop - 4 and obs[j][0].stop >= bb[0].start + 4])
    ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    al = (ndimage.gaussian_filter(m.astype(float), 0.6) * 255).clip(0, 255).astype(np.uint8)
    im = Image.fromarray(np.dstack([a.astype(np.uint8), al])[y0:y1, x0:x1], 'RGBA')
    s = TH / max(im.width, im.height); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    im.save(f'img/{pre}_{nm}.webp', quality=92); print(nm, im.size)
