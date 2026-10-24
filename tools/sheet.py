# 연속 동작 시트(가로로 나란한 N컷)를 잘라 같은 크기 칸으로 정렬 → webp 한 장 + 정보(json)
# 사용: python3 tools/sheet.py 원본.png 출력이름 칸높이 [body=r,g,b 기준색]
# 칸마다: 흰 배경 제거 → 덩어리별로 나누기 → 몸(기준색) 가운데·발끝을 같은 위치에 맞춤
import sys, json, numpy as np
from PIL import Image, ImageFilter
from collections import deque
src, name, cellH = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=', 1) for a in sys.argv[4:])
im = np.array(Image.open(src).convert('RGB')).astype(np.int32)
H, W, _ = im.shape
mn, mx = im.min(-1), im.max(-1)
bgish = (mn > 225) & (mx - mn < 25)
bg = np.zeros((H, W), bool); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if bgish[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if bgish[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and not bg[ny, nx] and bgish[ny, nx]: bg[ny, nx] = True; q.append((ny, nx))
if opts.get('holes'):  # 테두리에 갇힌 큰 흰 칸(예: 활 안쪽)도 배경으로 — 눈 흰자처럼 작은 칸은 남김
    minA = int(opts['holes']); seen = bg.copy(); white = (mn > 238) & (mx - mn < 18)
    for yy, xx in zip(*np.nonzero(white & ~seen)):
        if seen[yy, xx]: continue
        reg = [(yy, xx)]; seen[yy, xx] = True; dq = deque(reg)
        while dq:
            a1, b1 = dq.popleft()
            for d1, d2 in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                c1, c2 = a1 + d1, b1 + d2
                if 0 <= c1 < H and 0 <= c2 < W and not seen[c1, c2] and white[c1, c2]: seen[c1, c2] = True; dq.append((c1, c2)); reg.append((c1, c2))
        if len(reg) >= minA:
            for c1, c2 in reg: bg[c1, c2] = True
alpha = np.array(Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8)))
solid = alpha > 40
# 세로로 빈 줄을 기준으로 칸 나누기 (작은 조각은 가까운 칸에 합침)
cols = solid.any(0)
runs, x = [], 0
while x < W:
    if cols[x]:
        s = x
        while x < W and cols[x]: x += 1
        runs.append([s, x])
    else: x += 1
runs = [r for r in runs if r[1] - r[0] > 3]
merged = []
for r in runs:
    if merged and (r[1] - r[0] < 40 or merged[-1][1] - merged[-1][0] < 40) and r[0] - merged[-1][1] < 30: merged[-1][1] = r[1]
    else: merged.append(r)
if opts.get('n'):  # 칸 수를 알려 주면: 균등 경계 근처에서 가장 비어 있는 세로줄로 자름
    N = int(opts['n']); colsum = solid.sum(0); xs0 = np.nonzero(cols)[0]; L, R = xs0.min(), xs0.max() + 1
    cuts = [L]
    for i in range(1, N):
        c = L + (R - L) * i / N; lo, hi = int(c - (R - L) / N * 0.35), int(c + (R - L) / N * 0.35)
        cuts.append(lo + int(np.argmin(colsum[lo:hi])))
    cuts.append(R); merged = [[cuts[i], cuts[i + 1]] for i in range(N)]
    # 칸 안에서 잘려 들어온 옆 칸 조각(작은 덩어리)은 지움
    for x0, x1 in merged:
        seg = solid[:, x0:x1].copy(); lab = np.zeros(seg.shape, np.int32); cur = 0; sizes = {}
        for yy, xx in zip(*np.nonzero(seg)):
            if lab[yy, xx]: continue
            cur += 1; lab[yy, xx] = cur; dq = deque([(yy, xx)]); n = 0
            while dq:
                a1, b1 = dq.popleft(); n += 1
                for d1, d2 in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    c1, c2 = a1 + d1, b1 + d2
                    if 0 <= c1 < seg.shape[0] and 0 <= c2 < seg.shape[1] and seg[c1, c2] and not lab[c1, c2]: lab[c1, c2] = cur; dq.append((c1, c2))
            sizes[cur] = n
        big = max(sizes.values()); keep = {k for k, v in sizes.items() if v > big * 0.04}
        drop = seg & ~np.isin(lab, list(keep))
        solid[:, x0:x1] &= ~drop; alpha[:, x0:x1][drop] = 0
print('frames found', len(merged), merged)
# 몸 기준색 (기본: 주황)
br, bgc, bb = map(int, opts.get('body', '235,130,30').split(','))
dist = np.abs(im - np.array([br, bgc, bb])).sum(-1)
body = solid & (dist < int(opts.get('tol', 120)))
frames = []
for x0, x1 in merged:
    sm = solid[:, x0:x1]; ys = np.nonzero(sm.any(1))[0]; y0, y1 = ys.min(), ys.max() + 1
    bm = body[y0:y1, x0:x1]; bys, bxs = np.nonzero(bm)
    # 몸 가운데: 아래쪽 절반(다리·몸통)의 가로 중앙값, 발끝: 불투명 맨 아래
    low = bys > np.percentile(bys, 45)
    cx = float(np.median(bxs[low])) + x0
    frames.append(dict(x0=x0, x1=x1, y0=y0, y1=y1, cx=cx, foot=y1, bodyTop=float(bys.min()) + y0))
bodyH = max(f['foot'] - f['bodyTop'] for f in frames)
left = max(f['cx'] - f['x0'] for f in frames); right = max(f['x1'] - f['cx'] for f in frames)
up = max(f['foot'] - f['y0'] for f in frames)
pad = 6
cw, ch = int(left + right) + pad * 2, int(up) + pad * 2
rgba = np.dstack([np.clip(im, 0, 255).astype(np.uint8), alpha])
full = Image.fromarray(rgba, 'RGBA')
k = cellH / ch
cwS, chS = round(cw * k), cellH
sheet = Image.new('RGBA', (cwS * len(frames), chS), (0, 0, 0, 0))
for i, f in enumerate(frames):
    cell = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    piece = full.crop((f['x0'], f['y0'], f['x1'], f['y1']))
    cell.paste(piece, (int(round(pad + left - (f['cx'] - f['x0']))), int(round(pad + up - (f['foot'] - f['y0'])))))
    sheet.paste(cell.resize((cwS, chS), Image.LANCZOS), (i * cwS, 0))
out = f'img/{name}.webp'
sheet.save(out, 'WEBP', quality=90, method=6)
info = dict(n=len(frames), cw=cwS, ch=chS, ax=round((pad + left) / cw, 4), ay=round((pad + up) / ch, 4), body=round(bodyH / ch, 4), f0=round((frames[0]['foot'] - frames[0]['y0']) / ch, 4))
print(out, sheet.size, json.dumps(info))
prev = Image.new('RGBA', sheet.size, (143, 209, 106, 255)); prev.alpha_composite(sheet)
for i in range(len(frames)):  # 기준점 표시
    px = int(i * cwS + info['ax'] * cwS); py = int(info['ay'] * chS)
    for d in range(-3, 4): prev.putpixel((min(prev.width - 1, px + d), min(prev.height - 1, py - 1)), (255, 0, 0, 255))
prev.convert('RGB').save(f'/tmp/{name}_preview.png')
