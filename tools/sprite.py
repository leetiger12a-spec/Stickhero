# 사용: python3 sprite.py 원본.png 출력.webp 높이 [recolor=orange] [exclude=x0,y0,x1,y1;...]
import sys, numpy as np
from PIL import Image, ImageFilter
from collections import deque
src, out, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=', 1) for a in sys.argv[4:])
im = np.array(Image.open(src).convert('RGB')).astype(np.int32)
H, W, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]
mx, mn = im.max(-1), im.min(-1)
# 1) 흰 배경 제거: 가장자리에서 출발해 밝고 무채색인 픽셀만 채우기
bgish = (mn > 225) & (mx - mn < 25)
bg = np.zeros((H, W), bool)
q = deque()
for x in range(W):
    for y in (0, H - 1):
        if bgish[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if bgish[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and not bg[ny, nx] and bgish[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))
alpha = np.where(bg, 0, 255).astype(np.uint8)
# 가장자리 부드럽게
a_img = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
alpha = np.array(a_img)
# 2) 색 바꾸기 (푸르스름한 흰 몸 → 주황)
if opts.get('recolor') == 'orange':
    L = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    tint = (b - r > 6) & (L > 0.45)
    gap = (~bg) & (mn > 240)                      # 외곽선과 몸 사이의 흰 틈도 칠함
    body = (~bg) & (tint | gap)
    yy, xx = np.mgrid[0:H, 0:W]
    # 눈: 지정 영역 안의 어두운 눈동자 주변만 제외 (피부는 칠함)
    for box in filter(None, opts.get('eyes', '').split(';')):
        x0, y0, x1, y1 = map(int, box.split(','))
        dark = np.zeros((H, W), np.uint8); sub = (L < 0.8); sub[:y0] = False; sub[y1:] = False; sub[:, :x0] = False; sub[:, x1:] = False
        dark[sub] = 255
        dil = np.array(Image.fromarray(dark).filter(ImageFilter.MaxFilter(int(opts.get('eyepad', 13))))) > 0
        body &= ~dil
    # 무기 등: 선분(x0,y0,x1,y1,반지름) 근처 제외
    for seg in filter(None, opts.get('noseg', '').split(';')):
        x0, y0, x1, y1, rad = map(float, seg.split(','))
        dx, dy = x1 - x0, y1 - y0
        tt = np.clip(((xx - x0) * dx + (yy - y0) * dy) / (dx * dx + dy * dy), 0, 1)
        dist = np.hypot(xx - (x0 + tt * dx), yy - (y0 + tt * dy))
        body &= dist > rad
    t = np.clip((L - 0.62) / 0.33, 0, 1)[..., None]
    dark, light = np.array([214, 92, 18]), np.array([255, 178, 82])
    col = dark * (1 - t) + light * t
    hi = (np.clip((L - 0.965) / 0.03, 0, 1) * tint)[..., None]          # 반짝이는 하이라이트는 밝게 유지
    col = col * (1 - hi) + np.array([255, 236, 200]) * hi
    im = np.where(body[..., None], col, im)
rgba = np.dstack([np.clip(im, 0, 255).astype(np.uint8), alpha])
img = Image.fromarray(rgba, 'RGBA')
bbox = img.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
img = img.crop(bbox)
pad = 6
w, h = img.size
nh = height - 2 * pad; nw = round(w * nh / h)
img = img.resize((nw, nh), Image.LANCZOS)
canvas = Image.new('RGBA', (nw + 2 * pad, height), (0, 0, 0, 0)); canvas.paste(img, (pad, pad))
canvas.save(out, 'WEBP', quality=90, method=6)
# 미리보기: 풀밭 배경 위에
prev = Image.new('RGBA', canvas.size, (143, 209, 106, 255)); prev.alpha_composite(canvas)
prev.convert('RGB').save(out.rsplit('.', 1)[0] + '_preview.png')
print(out, canvas.size, 'bbox', bbox)
