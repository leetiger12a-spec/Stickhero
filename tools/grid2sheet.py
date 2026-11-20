# 격자 시트(예: 제미나이 4×3 = 12칸) → 게임 동작 시트 (Build 232)
# 사용: python3 tools/grid2sheet.py 시트.png 출력이름 칸높이 [cols=4] [rows=3] [holes=면적] [anchor=mass] [holesy=0~1] [bigholes=면적]
# - 칸마다 흰 배경 제거(가장자리와 이어진 흰색만), 가장 큰 덩어리 둘레 조각만 남김
# - 칸마다 위치가 조금씩 달라도 발(맨 아래) 가운데를 기준으로 맞춰 떨림을 줄임 (그림 내용은 그대로)
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage
src, name, cellH = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=', 1) for a in sys.argv[4:]); C, R = int(opts.get('cols', 4)), int(opts.get('rows', 3))
A = np.asarray(Image.open(src).convert('RGB')).astype(np.int16); H, W = A.shape[:2]
frames = []
for r in range(R):
    for c in range(C):
        a = A[r * H // R:(r + 1) * H // R, c * W // C:(c + 1) * W // C]
        bgish = (a.min(-1) > 225) & (a.max(-1) - a.min(-1) < 30); bl, _ = ndimage.label(bgish)
        edge = set(np.unique(np.concatenate([bl[0], bl[-1], bl[:, 0], bl[:, -1]]))) - {0}
        fg = ~np.isin(bl, list(edge))
        if opts.get('holes'):
            hs = ndimage.sum(bgish, bl, range(1, bl.max() + 1)); ob = ndimage.find_objects(bl); hy = float(opts.get('holesy', 0)) * a.shape[0]   # holesy: 칸 위쪽(투구 반짝이 등)은 남기고 아래쪽 구멍만
            fg &= ~np.isin(bl, [i + 1 for i, v in enumerate(hs) if v > int(opts['holes']) and (ob[i][0].start >= hy or v > int(opts.get('bigholes', 10 ** 9)))])   # bigholes: 위쪽이라도 아주 큰 흰 칸(사슬 고리 안)은 지움
        lab, k = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, k + 1)); big = int(np.argmax(sz)) + 1
        sl = ndimage.find_objects(lab)[big - 1]; m = np.zeros_like(fg)
        for L in range(1, k + 1):
            s2 = ndimage.find_objects(lab)[L - 1]
            if (s2[0].start == 0 or s2[0].stop == a.shape[0]) and L != big: continue   # 칸 위·아래 끝에 걸친 조각 = 옆 줄 그림이 넘어온 것
            if sz[L - 1] >= 25 and s2[0].start >= sl[0].start - 20 and s2[0].stop <= sl[0].stop + 20 and s2[1].start >= sl[1].start - 20 and s2[1].stop <= sl[1].stop + 20: m |= lab == L
        ys, xs = np.nonzero(m); foot = ys.max(); fx = float(xs.mean()) if opts.get('anchor') == 'mass' else float(np.median(xs[ys > foot - (foot - ys.min()) * 0.08]))   # anchor=mass: 발이 없는 유령 등은 몸 무게중심 기준
        frames.append((a, m, foot, fx))
L_ = max(f[3] - np.nonzero(f[1])[1].min() for f in frames) + 6; Rr = max(np.nonzero(f[1])[1].max() - f[3] for f in frames) + 6
T_ = max(f[2] - np.nonzero(f[1])[0].min() for f in frames) + 6; B_ = 6
cw, ch = int(L_ + Rr), int(T_ + B_); k = cellH / ch; cwS = round(cw * k)
sheet = Image.new('RGBA', (cwS * len(frames), cellH), (0, 0, 0, 0))
for i, (a, m, foot, fx) in enumerate(frames):
    al = (ndimage.gaussian_filter(m.astype(float), 0.6) * 255).clip(0, 255).astype(np.uint8)
    rgba = Image.fromarray(np.dstack([a.clip(0, 255).astype(np.uint8), al]), 'RGBA')
    cell = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); cell.alpha_composite(rgba, (int(round(L_ - fx)), int(round(T_ - foot))))
    sheet.paste(cell.resize((cwS, cellH), Image.LANCZOS), (i * cwS, 0))
out = f'img/{name}.webp'; sheet.save(out, 'WEBP', quality=88, method=6)
m0 = frames[0][1]; body = (frames[0][2] - np.nonzero(m0)[0].min()) / ch
print(out, sheet.size, json.dumps(dict(n=len(frames), cw=cwS, ch=cellH, ax=round(L_ / cw, 4), ay=round(T_ / ch, 4), body=round(body, 4))))
