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

## 🎬 GIF 동작 프롬프트 틀 (사진 → GIF/MP4, 24칸)
첨부: 그 캐릭터의 서 있는 그림 1장. `[ACTION]`과 `[WHO]`만 바꿔요.
```
Animate the attached character as a seamless looping game sprite animation.

ACTION: [ACTION], facing right, IN PLACE (the character does NOT move across the screen). Exactly one full cycle, and the last frame must flow back into the first frame perfectly.

KEEP EXACTLY THE SAME: [WHO]'s design, colors, outlines, proportions and art style in every frame (2D cel-shaded game art, thick dark outlines). Same size in every frame, feet stay on the same ground line, character stays centered.

CAMERA: completely static. No zoom, no pan, no camera shake, no rotation, no perspective change.

BACKGROUND: plain pure white (#FFFFFF) in every frame. No ground, no shadows, no dust, no particles, no new objects, no text, no watermark.

OUTPUT: 1 second long, 24 frames (24 fps), looping. Export as GIF (or MP4). Highest resolution available.
```
