# 한 줄로 선 캐릭터 시트를 캐릭터별 원본으로 나누기 (Build 209)
# 사용: python3 tools/splitsheet.py 시트.png 이름1 이름2 ...  → art/이름_src.png (흰 배경, 자기 조각만, 내용 수정 없음)
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, names = sys.argv[1], sys.argv[2:]
a = np.asarray(Image.open(src).convert('RGB')).astype(int)
bgish = (a.min(-1) > 225) & (a.max(-1) - a.min(-1) < 30)
bl, _ = ndimage.label(bgish); edge = set(np.unique(np.concatenate([bl[0], bl[-1], bl[:, 0], bl[:, -1]]))) - {0}
fg = ~np.isin(bl, list(edge)); lab, k = ndimage.label(fg); sizes = ndimage.sum(fg, lab, range(1, k + 1)); objs = ndimage.find_objects(lab)
big = sorted(np.argsort(-sizes)[:len(names)], key=lambda i: objs[i][1].start)
cx = [(objs[i][1].start + objs[i][1].stop) / 2 for i in big]; groups = {i: [i] for i in big}
for j in range(k):
    if j in big or sizes[j] < 20: continue
    c = (objs[j][1].start + objs[j][1].stop) / 2; groups[big[int(np.argmin([abs(c - x) for x in cx]))]].append(j)
for name, i in zip(names, big):
    m = np.isin(lab, [g + 1 for g in groups[i]]); ys, xs = np.nonzero(m); p = 24
    y0, y1, x0, x1 = max(0, ys.min() - p), min(a.shape[0], ys.max() + p), max(0, xs.min() - p), min(a.shape[1], xs.max() + p)
    out = np.full_like(a, 255); out[m] = a[m]
    Image.fromarray(out[y0:y1, x0:x1].astype(np.uint8)).save(f'art/{name}_src.png'); print(name, x1 - x0, y1 - y0, int(sizes[i]))
