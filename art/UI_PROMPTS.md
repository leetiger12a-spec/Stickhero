# 🖼 인터페이스 그래픽 업그레이드 (Build 291~)
지금 화면 위쪽 숫자 옆·버튼 안 그림은 대부분 휴대폰 이모지(❤ 🏠 💀 🪵 ⏸ 🔊 📜 …)라서 게임 그림체와 따로 놀아요.
→ 같은 그림체의 아이콘 16개를 한 장 시트로 받아서 이모지 자리를 바꿔요. 받은 그림은 배경 제거·자르기·크기만 조절.

## ① UI 아이콘 16개 시트 — ChatGPT, 첨부 `art/ref/STYLE_MASTER.png`
```
TASK: one 2D game UI ICON SHEET for a bright, cute mobile action game: exactly 16 icons arranged in a grid of 4 columns x 4 rows, read left to right, top row first.

STYLE (most important — copy the attached image): match the attached characters' art style 100%: same thick, uniform dark-brown/black outlines, same flat cel shading with 2-3 tones per color plus one sharp white highlight, same bright SATURATED colors, chunky and cute shapes. Every icon is a single solid object, slightly 3/4 top-down, easy to read at very small size (32 px).

ICONS IN THIS EXACT ORDER:
- Row 1: (1) a glossy red heart, (2) a small cozy village house with a red roof, (3) a cute white skull, (4) a short brown wooden log with rings on its end.
- Row 2: (5) a grey stone chunk, (6) a rolled parchment quest scroll with a red ribbon, (7) a pause button: two thick vertical bars on a round cream badge, (8) a speaker with sound waves on a round cream badge.
- Row 3: (9) a swirling green wind gust (dash), (10) a big orange-yellow explosion star (special attack), (11) a blue walkie-talkie radio (call for help), (12) a golden trophy cup.
- Row 4: (13) a silver gear (settings), (14) a folded treasure map with a red X, (15) a thick brown book with a monster face on the cover, (16) a bank vault: a small golden safe with a round dial.

GRID RULES (strict):
- Every icon is centered in its cell and fills about 70% of the cell, all icons the SAME visual size.
- VERY WIDE empty white gaps between all icons and between the rows; nothing touches or comes near another cell.
- Only the 16 icons. No labels, no numbers, no extra items.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no shadows, no glow halo, no sticker border, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## ①-2 UI 아이콘 16개 시트 — "멋있게" 버전 (아빠 요청, Build 291) — ChatGPT, 첨부 `art/ref/STYLE_MASTER.png`
```
TASK: one premium 2D fantasy action game UI ICON SHEET: exactly 16 icons arranged in a grid of 4 columns x 4 rows, read left to right, top row first.

STYLE (most important): EPIC and POLISHED, like the UI of a top-quality mobile RPG. Each icon is a heroic, detailed object with thick dark outlines (same outline thickness as the attached characters), rich saturated colors, strong cel shading with deep shadows and bright sharp highlights, gleaming GOLD trims and metal edges, a few small gem accents. Bold and cool, NOT cute or babyish. Every icon is a single solid object, slightly 3/4 view, very readable at small size (32 px).

ICONS IN THIS EXACT ORDER:
- Row 1: (1) a glossy crimson crystal heart with a gold rim, (2) a fortified village keep with a red banner, (3) a menacing horned skull, (4) a sturdy wooden log bound with an iron band.
- Row 2: (5) a rugged granite ore chunk with silver specks, (6) a royal quest scroll with a red wax seal and gold rods, (7) a pause emblem: two thick gold bars on a round dark-navy shield badge with a gold rim, (8) a speaker emblem with sound waves on a round dark-navy shield badge with a gold rim.
- Row 3: (9) a swirling teal wind gust with speed streaks (dash), (10) a blazing orange-gold burst star with sharp rays (special attack), (11) a rugged military radio with an antenna and a blue light (call for help), (12) a golden champion trophy with a red gem.
- Row 4: (13) a steel gear with gold inlay (settings), (14) an old treasure map with a red X and a gold compass, (15) a heavy leather monster tome with iron corners and a glowing eye on the cover, (16) a gold-and-steel vault safe with a big round dial.

GRID RULES (strict):
- Every icon is centered in its cell and fills about 70% of the cell, all icons the SAME visual size.
- VERY WIDE empty white gaps between all icons and between the rows; nothing touches or comes near another cell.
- Only the 16 icons. No labels, no numbers, no extra items.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no shadows, no glow halo, no sticker border, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## ② UI 아이콘 2번째 시트 16개 (Build 293~) — ChatGPT, 첨부 2장: `art/ui_icons_src.png`(첫 시트 = 그림체 정답) + `art/ref/STYLE_MASTER.png`
```
TASK: one 2D game UI ICON SHEET: exactly 16 NEW icons arranged in a grid of 4 columns x 4 rows, read left to right, top row first.

STYLE (most important): image 1 is a finished icon sheet from the same game. Match it 100%: same thick dark outlines, same flat cel shading with 2-3 tones plus one sharp white highlight, same bright saturated colors, same chunky shapes, same size inside each cell, same slight 3/4 view. Image 2 shows the game's characters for extra style reference. Every icon is a single solid object, very readable at small size (32 px).

ICONS IN THIS EXACT ORDER:
- Row 1: (1) a round blue badge with a big white question mark (help), (2) an open storybook with a red bookmark (story), (3) two golden music notes (music), (4) a volume knob dial with tick marks (volume).
- Row 2: (5) a painter's palette with a brush (customize), (6) a flexing arm with a red headband (power-up), (7) a desk calendar page with a red ring (daily check-in), (8) a smartphone with vibration lines (vibration).
- Row 3: (9) a red number "123" badge on a white tag (damage numbers), (10) a brass spyglass telescope (view), (11) an orange cat head wearing a tiny helmet (team tactics), (12) a slider bar with a round knob (screen shake).
- Row 4: (13) a sparkling blue evolution crystal (evolution book), (14) two crossed steel swords with gold hilts (battle), (15) a crescent moon with two little stars (night), (16) a flaming fire symbol (combo).

GRID RULES (strict):
- Every icon is centered in its cell and fills about 70% of the cell, all icons the SAME visual size.
- VERY WIDE empty white gaps between all icons and between the rows; nothing touches or comes near another cell.
- Only the 16 icons. No labels, no letters or numbers except the "123" on icon 9, no extra items.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no shadows, no glow halo, no sticker border, no text, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
