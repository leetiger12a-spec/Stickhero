# 👑 보스 동작 12칸 시트 (제미나이, Build 327~) — 보스 1마리씩, 걷기 → 공격
첨부: `art/bossN_src.png` (지금 게임에 들어간 보스 새 그림체) 1장. 받으면 칸별 검사 후 `tools/grid2sheet.py`로 넣음.

## B0-① 대왕 슬라임 걷기 (꿀렁꿀렁 미끄러지기) — 첨부 `art/boss0_src.png`
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

CHARACTER: the attached King Slime boss (a huge glossy red slime with yellow angry eyes, a toothy grin, dark curved horns, a gold crown with red gems, gold-trimmed dark spiked shoulder pads and arm bands, a gold chain with a red gem, and two big red slime hands). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, horns, armor and chain are in EVERY frame.

ANIMATION: a heavy OOZING CRAWL in place, facing right. Each frame MUST show a DIFFERENT body shape:
- Frames 1-3: the body squashes down and spreads wide, the bottom puddle spreading out, both hands planted on the ground in front.
- Frames 4-6: the body stretches up and leans forward to the right, the hands reaching forward, the puddle pulling in.
- Frames 7-9: the body rolls forward, the bottom bulging toward the right, drips falling from the arms.
- Frames 10-12: the body settles back to the round shape of the attached image, wobbling, flowing back into frame 1.
The crown and horns bob with the body. The face keeps the same angry grin.

GRID RULES (strict):
- Every frame: the SAME boss at the SAME size (the same crown and face size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the boss stays in the center of its cell.
- The boss fills about 70% of its cell height.
- VERY WIDE empty white gaps between all cells and between the rows; no horn, crown, hand, drip or puddle may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no effects, no splashes, no flying droplets away from the body, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B0-② 대왕 슬라임 공격 (뛰어올라 쿵!) — 첨부 `art/boss0_src.png`
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

CHARACTER: the attached King Slime boss (a huge glossy red slime with yellow angry eyes, a toothy grin, dark curved horns, a gold crown with red gems, gold-trimmed dark spiked shoulder pads and arm bands, a gold chain with a red gem, and two big red slime hands). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, horns, armor and chain are in EVERY frame.

ANIMATION: a big JUMP AND SLAM in place, facing right. Each frame MUST show a DIFFERENT pose, exactly like this:
- Frame 1: round ready shape like the attached image.
- Frames 2-3: squashing down very low and wide, gathering power, hands pressed on the ground, eyes squinting.
- Frame 4: springing up, the body stretching tall and thin, the bottom leaving the ground.
- Frames 5-6: in the air, body round, both hands raised high above the head, mouth wide open roaring (draw the boss only a little higher in its cell, keep it inside the cell).
- Frame 7: falling down, body stretching downward, hands coming down.
- Frame 8: SLAMMING onto the ground, body squashed extremely flat and wide, both hands smashing down, the puddle splashing out wide.
- Frames 9-10: still flat, wobbling, slime ripples, grinning.
- Frames 11-12: rising back up into the round ready shape, flowing back into frame 1.

GRID RULES (strict):
- Every frame: the SAME boss at the SAME size (the same crown and face size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame (except the 2-3 air frames, which are only slightly higher); the boss stays in the center of its cell.
- The boss fills about 60% of its cell height (leave room for the raised hands and the wide slam).
- VERY WIDE empty white gaps between all cells and between the rows; no horn, crown, hand, drip or puddle may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no shockwaves, no dust, no impact marks, no flying droplets away from the body, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
