# 레전드 히어로 — 새 그림체 묶음 프롬프트 (Build 190~)

그림체: 애니메이션 액션풍 꼬마 비율 (머리 ≈ 키의 1/3, 굵은 선, 진한 색).
첨부 그림은 모두 `art/ref/` 폴더에 있어요. **모든 묶음에 `STYLE_A_enemies.png`(그림체 기준)를 같이 첨부**해요.

## 한 번에 여러 장 받는 방법
- **방법 1 — 한 장에 여러 캐릭터 (시트)**: 디자인(서 있기)은 한 장에 4~9명을 격자로. 칸 사이가 넓어서 잘 잘려요.
- **방법 2 — 한 메시지로 여러 장**: 동작 그림은 캐릭터마다 한 장씩, 한 메시지에서 "N장 따로 만들어 줘"로 요청해요.
  - 한 번에 3장 이하를 추천해요. 많으면 뒤쪽 그림이 대충 나오거나 중간에 멈출 수 있어요. 멈추면 "계속"이라고 보내요.
- 순서: 묶음 1 → 2 → 3 … (디자인 먼저, 그다음 동작)

---

## 묶음 1 — 일반 몬스터 3마리 동작 (방법 2, 3장)
첨부: `STYLE_A_enemies.png` + `B1_basic_enemies.png`
```
Attached image 1 is the art style reference and image 2 shows our 3 basic enemies (left to right: red helmeted goblin grunt with a short sword, pink goblin runner with two daggers, blue armored brute with spiked shoulder plates and a shield). Keep each enemy exactly as drawn: same design, same colors, same anime action chibi style, big head about 1/3 of body height, thick dark outlines.
Generate 3 SEPARATE images, one per enemy, in that order. Each image is an animation sprite sheet facing right with TWO rows of 4 frames:
TOP ROW: 4-frame walk cycle (the runner runs fast, the brute stomps heavily).
BOTTOM ROW: 4-frame attack (grunt: sword slash; runner: quick double dagger stab; brute: shield bash), the weapon in hand in every frame.
All frames the same size and on the same ground line, VERY WIDE empty white gaps between every frame and between the rows, so no weapon or effect comes near another frame. Full body, 3/4 top-down game view. Plain pure white background, no ground line, no shadows, no text, no letters, no numbers, no watermark. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## 묶음 2 — 특수 몬스터 8종 디자인 (방법 1, 1장)
첨부: `STYLE_A_enemies.png` + `B2_special_enemies_old.png`
```
Attached image 1 is the ART STYLE reference (anime action chibi game style, big head about 1/3 of body height, thick dark outlines, crisp cel shading, warm saturated colors, detailed armor/leather, cool not babyish). Attached image 2 shows 8 old enemies in a cute childish style. Redraw all 8 in exactly the style of image 1, keeping each one's identity and main colors, on ONE sheet in a 4x2 grid in the same order:
1) green splitting slime (glossy jelly with a mean face)
2) goblin archer with a bow and quiver
3) suicide bomber goblin carrying a big lit bomb on its back
4) bat soldier with leathery wings
5) charging boar warrior with tusks and a helmet
6) goblin shaman with a glowing staff and mask
7) big venomous spider with armored legs
8) skeleton warrior with a rusty sword and shield
Full body, 3/4 top-down game view, standing ready pose facing right, light from top-left. Wide white empty margins between them, plain pure white background, no text, no letters, no numbers, no watermark. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## 묶음 3 — 강한 몬스터 9종 디자인 (방법 1, 1장)
첨부: `STYLE_A_enemies.png` + `B3_tier_enemies_old.png`
```
Attached image 1 is the ART STYLE reference (anime action chibi game style, big head about 1/3 of body height, thick dark outlines, crisp cel shading, warm saturated colors, detailed armor/leather, cool not babyish). Attached image 2 shows 9 old enemies. Redraw all 9 in exactly the style of image 1, keeping each one's identity and main colors, on ONE sheet in a 3x3 grid in the same order:
1) armored goblin grunt with a big front shield
2) shadow runner, a dark hooded fast goblin with glowing eyes
3) steel giant with a shoulder cannon
4) knight in plate armor with a long sword
5) ninja assassin with twin daggers and a mask
6) big ogre with a spiked wooden club
7) winged demon soldier with horns and a trident
8) ghost knight, translucent blue armor with a chain
9) rock golem made of stacked boulders with glowing cracks
Full body, 3/4 top-down game view, standing ready pose facing right, light from top-left. Wide white empty margins between them, plain pure white background, no text, no letters, no numbers, no watermark. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## 묶음 4~6 — 보스 디자인 (방법 1, 3장)
`[REF]`와 `[LIST]`만 바꿔서 3번 보내요. 첨부: `STYLE_A_enemies.png` + `[REF]`
```
Attached image 1 is the ART STYLE reference (anime action chibi game style, thick dark outlines, crisp cel shading, warm saturated colors, detailed armor, menacing but kid-friendly). Attached image 2 shows old BOSS monsters. Redraw each boss in exactly the style of image 1, keeping its identity and main colors, bigger and more impressive than normal enemies, on ONE sheet in a grid in the same order: [LIST]. Full body, 3/4 top-down game view, standing facing right, light from top-left. Wide white empty margins between them, plain pure white background, no text, no letters, no numbers, no watermark. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
| 묶음 | `[REF]` | `[LIST]` |
|---|---|---|
| 4 | `B4_bosses_1_old.png` | `1) Steel Giant, a huge blue armored robot-knight with a rocket fist, 2) Flame Overlord, a fire demon king, 3) Ice Dragon, 4) Spider Queen with a crown` (2x2) |
| 5 | `B5_bosses_2_old.png` | `1) Skeleton King with a crown and scythe, 2) Rock Golem King, 3) Lava Golem, 4) Ice Golem` (2x2) |
| 6 | `B6_bosses_3_old.png` | `1) Forest Golem covered in moss and roots, 2) Golden Golem made of gold bricks, 3) the final boss: Crown Monster Emperor, a giant monster king with a huge crown and cape` (3x1) |

## 묶음 7 — 마을 건물 12개 (방법 1, 1장)
첨부: `STYLE_A_enemies.png` + `B8_village_old.png`
```
Attached image 1 is the ART STYLE reference (anime action chibi game style, thick dark outlines, crisp cel shading, warm saturated colors; see the detailed stone-and-timber house in it). Attached image 2 shows 12 old village buildings. Redraw all 12 in exactly that style, keeping each one's purpose, shape and main colors, on ONE sheet in a 4x3 grid in the same order:
1) bigger town hall level 2, 2) grand town hall level 3, 3) broken town hall (ruined, damaged roof), 4) wooden archer watchtower, 5) broken watchtower, 6) stone wall segment, 7) farm with crops, 8) stone mine entrance, 9) market stall with goods, 10) blacksmith forge with anvil, 11) tavern with a sign board (no letters), 12) enemy goblin camp tent with spikes.
3/4 top-down game view, whole object visible, light from top-left. Wide white empty margins between them, plain pure white background, no text, no letters, no numbers, no watermark. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## 다음 (디자인을 받은 뒤)
특수·강한 몬스터는 새 디자인을 받은 뒤 걷기 4칸을 **한 메시지 3장씩**(묶음 1과 같은 방식) 요청해요.

---

## ⭐ 정교한 공통 프롬프트 (Build 197~, 제미나이·마누스·ChatGPT 공용)
첨부 2장: ① `art/ref/STYLE_MASTER.png` (새 그림체 완성 캐릭터 6명 = 그림체 정답) ② 바꿀 옛 캐릭터 그림.
`[WHO]`, `[DESIGN]`, `[TOP ROW]`, `[BOTTOM ROW]`만 바꿔 써요.
```
TASK: one 2D game sprite sheet for a mobile action game.

STYLE (most important — copy image 1 exactly): image 1 shows 6 finished characters. Match their art style 100%: same thick, uniform dark-brown/black outlines (about 3-4 px at this size), same flat cel shading with only 2-3 tones per color plus one sharp white highlight, same bright SATURATED colors, same chibi proportions (head about 1/3 of total height, short sturdy body, big hands and boots), same angry/confident expressions with big eyes. Clean vector-like game art. NOT painterly, NOT soft airbrush, NOT realistic, NOT thin sketchy lines, NOT muted or brownish colors, NOT 3D render.

CHARACTER: [WHO] from image 2, redesigned in that style: [DESIGN]. Keep its main colors from image 2 but make them bright and saturated.

LAYOUT (strict):
- Exactly 8 frames: 2 rows x 4 columns, read left to right, top row first.
- TOP ROW: [TOP ROW]
- BOTTOM ROW: [BOTTOM ROW]
- Every frame shows the SAME character at the SAME size, facing right, full body, 3/4 top-down game view.
- The character fills about 70% of its cell height. All feet on the same ground line within a row.
- VERY WIDE empty white space between frames and between the rows; no part of any frame (weapon, wing, effect) may come near another frame.
- No extra items floating outside the character, no explosions, no dust clouds, no motion lines between frames.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no ground line, no shadows, no gradient, no frame borders, no text, no letters, no numbers, no watermark, no logo, no signature.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

---

## 🎬 GIF 동작 프롬프트 틀 (사진 → GIF, 24칸 · MP4·동영상 생성 금지)
첨부: 그 캐릭터의 서 있는 그림 1장. `[ACTION]`과 `[WHO]`만 바꿔요.
```
Animate the attached character as a seamless looping game sprite animation.

ACTION: [ACTION], facing right, IN PLACE (the character does NOT move across the screen). Exactly one full cycle, and the last frame must flow back into the first frame perfectly.

KEEP EXACTLY THE SAME: [WHO]'s design, colors, outlines, proportions and art style in every frame (2D cel-shaded game art, thick dark outlines). Same size in every frame, feet stay on the same ground line, character stays centered.

CAMERA: completely static. No zoom, no pan, no camera shake, no rotation, no perspective change.

BACKGROUND: plain pure white (#FFFFFF) in every frame. No ground, no shadows, no dust, no particles, no new objects, no text, no watermark.

OUTPUT: 1 second long, 24 frames (24 fps), looping. Export as an animated GIF only. Highest resolution available.
```

---

## 🧙 묶음 S1 — 주술사·거미·해골 새 디자인 (Build 205~, 1장)
첨부 2장: ① `art/ref/STYLE_MASTER.png` ② `art/ref/B2b_shaman_spider_skel_old.png`
```
TASK: one 2D game character design sheet for a mobile action game.

STYLE (most important — copy image 1 exactly): image 1 shows 6 finished characters. Match their art style 100%: same thick, uniform dark-brown/black outlines (about 3-4 px at this size), same flat cel shading with only 2-3 tones per color plus one sharp white highlight, same bright SATURATED colors, same chibi proportions (head about 1/3 of total height, short sturdy body, big hands and boots), same angry/confident expressions with big eyes, same detailed leather straps, belts, buckles and metal plates. Clean vector-like game art. NOT painterly, NOT soft airbrush, NOT realistic, NOT thin sketchy lines, NOT muted or brownish colors, NOT 3D render, NOT babyish or round blob shapes.

CHARACTERS: image 2 shows 3 old enemies (left to right). Redraw each one in the style of image 1, keeping its identity and main colors:
1) GOBLIN SHAMAN: dark-blue hooded robe with gold trim, glowing purple crystal on a twisted wooden staff held in one hand, glowing eyes and sharp grin inside the hood, leather belt with pouches and small bone charms, sturdy boots.
2) VENOMOUS SPIDER: big purple spider with darker stripes, 8 armored segmented legs with bright magenta tips, glowing red eyes, sharp fangs, a few metal plates on its back. Same height as the other two, wide body.
3) SKELETON WARRIOR: cream-white bones, glowing green eyes, rusty short sword in one hand and a small round wooden shield, torn purple cloth and a leather belt with a metal buckle, bone boots.

LAYOUT (strict):
- ONE sheet, 3 characters in ONE row, left to right in the order above.
- Each character: full body, standing ready pose, facing RIGHT, 3/4 top-down game view, light from top-left.
- All 3 about the same height, feet on the same ground line, each fills about 70% of the sheet height.
- VERY WIDE empty white space between characters; no weapon, leg or effect may come near another character.
- No extra items floating, no magic particles away from the body, no effects, no dust.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no ground line, no shadows, no gradient, no frame borders, no text, no letters, no numbers, no watermark, no logo, no signature.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
받은 뒤: 한 마리씩 GIF 틀(위 🎬)로 동작 요청 → 몬스터는 12칸으로 줄여 넣음.

## ⚔ 묶음 S2a~c — 강한 몬스터 9종 새 디자인 (Build 209~, 3장을 하나씩)
첨부 2장: ① `art/ref/STYLE_MASTER.png` ② `art/ref/B3a_tier_old.png` (b·c는 같은 틀에 그림·CHARACTERS만 바꿈)
S2a CHARACTERS:
1) ARMORED GOBLIN GRUNT: red goblin in a spiked steel helmet and steel chest armor, curved short sword in one hand, round wooden shield with a steel boss in the other, red pants, heavy boots.
2) SHADOW RUNNER: fast ninja goblin in a purple hood and wrap with long flowing headband tails, dark face with big white angry eyes and sharp grin, a curved dagger in each hand, purple gi with a dark belt, light running pose.
3) STEEL GIANT: big blue brute in heavy riveted steel armor and helmet, holding a huge double-barrel shoulder cannon with both hands, steel boots, wide and heavy.
S2b CHARACTERS (첨부 ② `art/ref/B3b_tier_old.png`):
1) KNIGHT: silver plate-armored knight with a visored helmet and a red plume, red cape, long steel sword in one hand, red-and-gold cross-free heraldic shield (plain gold emblem) in the other, red belt.
2) ASSASSIN: dark hooded assassin in a black tattered cloak, glowing yellow eyes and sharp grin in the dark hood, a curved blade in each hand, leather belt and bracers with gold buckles.
3) OGRE: big green ogre with small horns and tusks, angry face, bare muscular arms with spiked leather bracers, brown fur loincloth with a skull buckle, holding a spiked wooden club.

---

## 💥 몬스터 공격 GIF 틀 (Build 211~, 한 마리씩)
첨부: 그 몬스터 서 있는 그림 1장 (`art/e_이름_src.png`). `[WHO]`와 `[ATTACK]`만 바꿔요. 게임에선 공격이 0.25초라 빠르게 한 번 치는 동작이 좋아요.
```
Animate the attached character as a seamless looping game sprite animation.

ACTION: [ATTACK], facing right, IN PLACE (the character does NOT move across the screen). Structure: short wind-up (frames 1-8), one fast powerful strike (frames 9-14), then return to the starting ready pose (frames 15-24). The last frame must match the first frame so it loops perfectly.

KEEP EXACTLY THE SAME: [WHO]'s design, colors, outlines, proportions and art style in every frame (2D cel-shaded game art, thick dark outlines, chibi proportions). Weapons stay in the same hands. Same size in every frame, feet stay on the same ground line, character stays centered.

CAMERA: completely static. No zoom, no pan, no camera shake, no rotation, no perspective change.

BACKGROUND: plain pure white (#FFFFFF) in every frame. No ground, no shadows, no dust, no smoke, no motion blur, no slash trails, no impact effects, no projectiles, no particles, no new objects, no text, no watermark.

OUTPUT: 1 second long, 24 frames (24 fps), looping. Export as an animated GIF only. Highest resolution available, at least 1920x1080. ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
| 몬스터 | 첨부 | `[WHO]` | `[ATTACK]` |
|---|---|---|---|
| 방패 고블린 | e_agrunt_src.png | the red armored goblin | a fast overhead sword slash while keeping the shield in front |
| 그림자 닌자 | e_srunner_src.png | the purple ninja goblin | a lightning-fast double dagger stab forward, both daggers thrusting |
| 강철 거인 | e_stank_src.png | the blue steel giant | firing the double-barrel cannon: brace, strong recoil pushing the body back, then steady again (no fire, no smoke, no cannonball) |
| 주술사 | e_shaman_src.png | the goblin shaman | thrusting the crystal staff forward to cast a spell, the crystal glowing brighter only during the thrust |
| 거미 | e_spider_src.png | the purple spider | rearing up on its back legs and lunging forward to bite with its fangs (always exactly 8 legs) |
| 해골 | e_skel_src.png | the skeleton warrior | a fast diagonal slash with the rusty sword while the shield stays raised |

---

## 🎞 제미나이용 동작 칸 시트 (Build 215~, 제미나이는 GIF를 못 만듦 → 그림 한 장에 12칸)
몬스터는 게임에서 12칸만 쓰므로 12칸(4열×3행)으로 요청 (칸이 커서 더 선명). 첨부: ① `art/ref/STYLE_MASTER.png` ② 그 몬스터 옛 그림 `art/ref/old_이름.png`.
받은 시트는 `tools/grid2sheet.py`로 칸을 잘라 GIF와 같은 게임 그림으로 만듦.
- (Build 215) 제미나이가 옛 그림체를 따라 그려서 → 옛 그림은 첨부하지 않고 `art/ref/STYLE_MONSTERS.png`(새 그림체 몬스터 6마리) 1장만 첨부, 한 번에 한 마리, 모습은 글로만 설명.

## 👑 보스 새 그림체 (Build 224~, 제미나이, 한 번에 1마리)
첨부: `art/ref/STYLE_MONSTERS.png` 1장만 (옛 그림 첨부 금지). `THE NEW BOSS:` 줄만 바꿈. 목록은 대화 답변의 표 참고 (boss0~5, boss_final 먼저).

## 🌪 새 무기 "바람 부채" 그림 4개 (한 장 시트) — 첨부 `art/ref/STYLE_MASTER.png` · ChatGPT용 (Build 394 준비)
넣는 곳: ① `img/w_fan.webp` ② `img/w_fan_evo.webp` ③ `img/pj_tornado.webp` ④ `img/pj_tornado_evo.webp`
```
TASK: one game ITEM SPRITE SHEET with exactly 4 separate items arranged in a grid of 2 columns x 2 rows, read left to right, top row first. Wide landscape image (3:2).

STYLE: the same bright cartoon game-icon style as the attached image: thick clean black outlines, bold saturated colors, cel shading with soft highlights, a little sparkle glow, chunky cute proportions. Each item is drawn as a standalone game icon, seen slightly from the front, NOT inside a frame or badge.

ITEMS:
1. (top-left) WIND FAN weapon: a magic folding hand fan opened wide like a half circle, made of pale mint-green and white paper panels with thin bamboo-brown ribs, a gold handle with a small round emerald gem, and three small curly white wind swirls coming off the top edge of the fan. Fan tilted about 30 degrees, handle at the bottom-left.
2. (top-right) EVOLVED TYPHOON FAN: the same fan shape but bigger and more powerful: deep teal and silver panels with glowing cyan patterns, a gold handle with a big glowing cyan crystal, and a strong spiral of cyan wind and tiny leaves swirling around the fan. Same tilt as item 1.
3. (bottom-left) WHIRLWIND: a small cute cartoon tornado, a funnel of curved pale mint-green and white wind bands, wide at the top and narrow at the bottom, with a few tiny green leaves caught in it. Standing upright.
4. (bottom-right) BIG TYPHOON: a bigger, stronger cartoon tornado, curved teal and cyan wind bands with glowing cyan edges, small lightning sparks and leaves spinning in it. Standing upright. About 1.3 times taller than item 3.

GRID RULES (strict):
- Exactly 4 items, each centered in its own quarter of the image, each filling about 65% of its quarter.
- VERY WIDE empty white gaps between the items; no item may touch or come near another.
- No labels, no numbers, no text.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no shadows on the ground, no sticker border, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## 🗼 무한 탑 안 화려하게 (Build 395 준비, 아빠: "넘 허접 · 화려하게") — ChatGPT용 3장 · 첨부 `art/ref/tower_ref.png` + `art/ref/STYLE_MASTER.png`
### T-① 소품 시트 6개 → `tf_wall` `tf_wall_boss` `tf_brazier` `tf_banner` `tf_banner_boss` `tf_circle`
```
TASK: one game PROP SPRITE SHEET with exactly 6 separate items arranged in a grid of 3 columns x 2 rows, read left to right, top row first. Wide landscape image (3:2). These are EPIC, RICHLY DETAILED decorations for the inside of a legendary magic sky tower in a top-down 2D action game. Make them look premium, glowing and magical, like a high-end mobile RPG.

STYLE: bright cartoon fantasy game art matching the attached images: thick clean dark outlines, bold saturated colors, cel shading with strong highlights, lots of shine, gold trim and glowing gems, chunky cute proportions.

ITEMS:
1. (top-left) GRAND TOWER WALL SEGMENT: a TALL vertical piece of tower wall seen from the front, about 1 wide x 2.5 tall: pale lavender-gray stone bricks with polished white marble edges, thick gold trim bands at the top and bottom, a tall arched stained-glass window in the middle glowing with blue, purple and gold light, two small glowing cyan crystals set into the stone, a few green ivy leaves, and a crenellated top with gold caps. The top and bottom edges are straight so the segments can be stacked.
2. (top-middle) BOSS TOWER WALL SEGMENT: the same shape and size, but dark obsidian-black stone with glowing red-orange lava cracks, red gems, gold trim, a red stained-glass window with a gold crown, and a carved gold skull above the window.
3. (top-right) MAGIC CRYSTAL BRAZIER: a tall ornate gold and dark-iron standing brazier on a round stone base, holding a big glowing crystal that burns with a swirling magic flame in purple, pink and cyan, tiny sparkles floating up. Standing upright.
4. (bottom-left) ROYAL TOWER BANNER: a long hanging tapestry banner on a gold rod with gold tassels: deep royal purple cloth with gold embroidered borders and a big glowing white-gold star emblem with a small tower in it. Hanging straight down, slightly waving at the bottom.
5. (bottom-middle) BOSS BANNER: the same banner but crimson red cloth with black and gold borders and a big gold crown and skull emblem.
6. (bottom-right) LEGENDARY MAGIC CIRCLE: a flat glowing magic circle seen straight from above (top-down, perfectly round, NOT tilted), very detailed: three layered rings of glowing violet and cyan light, a six-pointed star, a smaller rotating inner ring of runes, tiny glowing gems at the star points, sparkles. Only glowing lines and runes on a transparent-looking background: NO filled background disc, the white paper must show through between the lines.

GRID RULES (strict):
- Exactly 6 items, each centered in its own sixth of the image, each filling about 70% of its cell height.
- VERY WIDE empty white gaps between the items; no item may touch or come near another.
- No labels, no numbers, no text.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground, no cast shadows, no sticker border, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
### T-② 탑 바닥 무늬 (이어 붙이는 타일) → `tf_floor`
```
TASK: one SEAMLESS TILEABLE square ground texture for a top-down 2D game, seen straight from above. When the image is repeated left-right and up-down there must be NO visible seams.

CONTENT: the polished floor of a legendary magic sky tower: large smooth pale lavender and cream marble tiles in a neat grid, thin gold inlay lines between the tiles, small glowing cyan gem dots at some tile corners, a few faint star-shaped gold inlays, soft cloudy marble veins. Elegant and bright but calm, so characters standing on it are easy to see. Even lighting, no big single bright spot, no objects, no characters, no shadows of objects.

STYLE: cartoon fantasy game art, clean shapes, soft cel shading, matching the attached images.

FORMAT: square image, the pattern fills the whole image edge to edge, no border, no frame, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
### T-③ 보스 층 바닥 무늬 (이어 붙이는 타일) → `tf_floor_boss`
```
TASK: one SEAMLESS TILEABLE square ground texture for a top-down 2D game, seen straight from above. When the image is repeated left-right and up-down there must be NO visible seams.

CONTENT: the floor of a boss chamber at the top of a magic tower: large dark charcoal-purple stone tiles in a neat grid, thin glowing red-orange lava lines between the tiles, small gold rivets at the tile corners, a few faint carved rune marks. Dark and dramatic but not too dark, so characters standing on it are easy to see. Even lighting, no objects, no characters.

STYLE: cartoon fantasy game art, clean shapes, soft cel shading, matching the attached images.

FORMAT: square image, the pattern fills the whole image edge to edge, no border, no frame, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
