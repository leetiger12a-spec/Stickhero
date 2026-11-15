# GIF(또는 MP4에서 뽑은 그림들) → 게임 동작 시트 (Build 199)
# 사용: python3 tools/gif2sheet.py art/gif/이름.gif 출력이름 칸높이 [step=1] [keep=0.06] [holes=면적] [holesy=0~1] [crop=x0,x1] [bgmin=225] [bgsat=30]
# - 칸마다 흰 배경 제거(가장자리와 이어진 흰색만), 카메라가 고정이라 모든 칸을 같은 틀(합친 범위)로 잘라 위치가 흔들리지 않음
# - 몸에서 떨어져 멀리 날아가는 조각(화살·폭탄 등)은 빼고 몸 주변 조각만 남김 (게임이 따로 그림)
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage
src, name, cellH = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=', 1) for a in sys.argv[4:])
step = int(opts.get('step', 1))
gif = Image.open(src); frames = []
try:
    i = 0
    while True:
        gif.seek(i); frames.append(np.asarray(gif.convert('RGB')).astype(np.int16)); i += 1
except EOFError: pass
frames = frames[::step]
if opts.get('crop'):   # crop=0.33,0.66 → 한 GIF에 여러 캐릭터가 나란히 걸을 때 가로 범위(비율)만 잘라 한 마리씩
    c0, c1 = (float(v) for v in opts['crop'].split(','))
    frames = [f[:, int(f.shape[1] * c0):int(f.shape[1] * c1)] for f in frames]
masks = []
for a in frames:
    bgish = (a.min(-1) > int(opts.get('bgmin', 225))) & (a.max(-1) - a.min(-1) < int(opts.get('bgsat', 30)))   # bgmin·bgsat: 스티커처럼 연한 빛 테두리도 배경으로 (예: bgmin=120 bgsat=110)
    bl, _ = ndimage.label(bgish)
    edge = set(np.unique(np.concatenate([bl[0], bl[-1], bl[:, 0], bl[:, -1]]))) - {0}
    fg = ~np.isin(bl, list(edge))
    if opts.get('holes'):   # 활줄 안쪽처럼 갇힌 큰 흰 칸도 배경 (눈 흰자 같은 작은 칸은 남김)
        hs = ndimage.sum(bgish, bl, range(1, bl.max() + 1))
        hy = float(opts.get('holesy', 0)) * a.shape[0]   # holesy=0.4: 그림 높이 40% 아래쪽 구멍만 (머리 반짝이 같은 흰 칸은 남김)
        ob = ndimage.find_objects(bl)
        big = [i + 1 for i, v in enumerate(hs) if v > int(opts['holes']) and ob[i][0].start >= hy]
        fg &= ~np.isin(bl, big)
    fg = ndimage.binary_opening(fg, iterations=1) | (fg & ndimage.binary_erosion(fg, iterations=1))
    lab, k = ndimage.label(fg)
    if k == 0: masks.append(fg); continue
    sizes = ndimage.sum(fg, lab, range(1, k + 1)); big = int(np.argmax(sizes)) + 1
    sl = ndimage.find_objects(lab)[big - 1]; y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
    my, mx = int((y1 - y0) * float(opts.get('keep', 0.06))), int((x1 - x0) * float(opts.get('keep', 0.06)))
    keep = np.zeros_like(fg)
    for L in range(1, k + 1):
        s2 = ndimage.find_objects(lab)[L - 1]
        if sizes[L - 1] < 25: continue
        if s2[0].start >= y0 - my and s2[0].stop <= y1 + my and s2[1].start >= x0 - mx and s2[1].stop <= x1 + mx: keep |= lab == L
    masks.append(keep)
U = np.zeros_like(masks[0])
for m in masks: U |= m
ys, xs = np.nonzero(U); Y0, Y1, X0, X1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
pad = 6; Y0 = max(0, Y0 - pad); X0 = max(0, X0 - pad); Y1 = min(U.shape[0], Y1 + pad); X1 = min(U.shape[1], X1 + pad)
ch, cw = Y1 - Y0, X1 - X0
k = cellH / ch; cwS = round(cw * k)
sheet = Image.new('RGBA', (cwS * len(frames), cellH), (0, 0, 0, 0))
for i, (a, m) in enumerate(zip(frames, masks)):
    al = (ndimage.gaussian_filter(m.astype(float), 0.6) * 255).clip(0, 255).astype(np.uint8)   # 테두리 살짝 부드럽게
    rgba = np.dstack([a.clip(0, 255).astype(np.uint8), al])[Y0:Y1, X0:X1]
    sheet.paste(Image.fromarray(rgba, 'RGBA').resize((cwS, cellH), Image.LANCZOS), (i * cwS, 0))
out = f'img/{name}.webp'; sheet.save(out, 'WEBP', quality=88, method=6)
m0 = masks[0][Y0:Y1, X0:X1]; ys0, xs0 = np.nonzero(m0)
foot = ys0.max() + 1; feet = xs0[ys0 > ys0.max() - ch * 0.06]
info = dict(n=len(frames), cw=cwS, ch=cellH, ax=round(float(np.median(feet)) / cw, 4), ay=round(foot / ch, 4), body=round((foot - ys0.min()) / ch, 4))
print(out, sheet.size, json.dumps(info))
