# 👑 보스 동작 12칸 시트 (제미나이, Build 327~) — 보스 1마리씩, 걷기 → 공격
첨부: `art/bossN_src.png` (지금 게임에 들어간 보스 새 그림체) 1장. 받으면 칸별 검사 후 `tools/grid2sheet.py`로 넣음.

### PIXVERSE LAYOUT (픽스버스로 만들 때만 TASK 바로 아래에 넣기 — 오른쪽 위 워터마크 피하기, Build 362에서 통함)
```
LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.
```

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

## B1-① 강철 거인 걷기 (쿵쿵 무거운 걸음) — 첨부 `art/boss1_src.png`
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

CHARACTER: the attached Steel Giant boss (a huge blue armored brute with a round blue head, yellow angry eyes, a wide toothy grin, dark curved horns, a small gold crown with a red gem, big grey steel shoulder plates with gold studs, a brown leather chest strap and belt with a gold buckle, grey spiked steel gauntlets with big blue fists, grey armored knees and big grey steel boots). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, horns, shoulder plates, strap, belt, gauntlets and boots are in EVERY frame.

ANIMATION: a slow HEAVY STOMPING WALK in place, facing right (seen from the 3/4 front-right like the attached image). The LEGS MUST CLEARLY MOVE: in every frame the two legs are in a DIFFERENT position, exactly like this (the "front leg" is the leg on the right side of the picture):
- Frame 1: both boots on the ground, legs apart, standing like the attached image.
- Frame 2: the front leg starts to lift, its knee bending, its boot heel off the ground.
- Frame 3: the front leg lifted HIGH, knee up at belt height, boot clearly in the air; the body leans slightly back.
- Frame 4: the front leg swinging forward, boot still in the air and further to the right.
- Frame 5: the front boot STOMPS down far forward, legs in a wide step; the body dips low, both fists swing down.
- Frame 6: weight moves onto the front leg; the back boot's heel lifts.
- Frame 7: the back leg starts to lift, its knee bending, its boot off the ground.
- Frame 8: the back leg lifted HIGH, knee up at belt height, boot clearly in the air.
- Frame 9: the back leg swinging forward past the front leg, boot in the air.
- Frame 10: the back boot STOMPS down; legs in a wide step the other way; the body dips low.
- Frame 11: weight shifting back to the middle, both boots on the ground, legs wide.
- Frame 12: standing up again, almost like frame 1, flowing back into frame 1.
The arms swing opposite to the legs (when the right-side leg goes forward, the right-side fist goes back). The head bobs down on every stomp. The face keeps the same angry grin.

GRID RULES (strict):
- Every frame: the SAME boss at the SAME size (the same crown and head size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the boss stays in the center of its cell.
- The boss fills about 70% of its cell height (leave room for the lifted knees and swinging fists).
- VERY WIDE empty white gaps between all cells and between the rows; no horn, crown, fist, boot or spike may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no effects, no dust clouds, no impact marks, no speed lines, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B1-② 강철 거인 공격 (로켓 펀치 준비 → 내지르기) — 첨부 `art/boss1_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Steel Giant boss (a huge blue armored brute with a round blue head, yellow angry eyes, a wide toothy grin, dark curved horns, a small gold crown with a red gem, big grey steel shoulder plates with gold studs, a brown leather chest strap and belt with a gold buckle, grey spiked steel gauntlets with big blue fists, grey armored knees and big grey steel boots). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, horns, shoulder plates, strap, belt, gauntlets and boots are in EVERY frame. Both fists stay attached to the arms in every frame.

ANIMATION: a big ROCKET PUNCH wind-up and straight punch in place, facing right. Each frame MUST show a DIFFERENT pose, exactly like this (the "punching arm" is the arm on the right side of the picture):
- Frame 1: fighting stance like the attached image, both fists up.
- Frame 2: the body twists back to the left, the punching arm starts pulling back.
- Frame 3: the punching arm pulled FAR back behind the body, the fist clenched tight, the other fist forward as a guard; knees bent low.
- Frame 4: same wound-up pose, but the body leans further back and the face shows teeth clenched, eyes narrowed (charging power).
- Frame 5: still wound up, the back foot digs in, the shoulder plate rises (maximum charge).
- Frame 6: the body starts to turn forward, the punching arm swinging forward at waist height.
- Frame 7: the punching arm shooting forward, halfway straight, the body leaning right.
- Frame 8: FULL PUNCH: the punching arm completely straight to the right at chest height, the big fist far out in front, the body leaning far forward, the front foot stepped forward, mouth wide open shouting.
- Frame 9: the punch held fully extended, the other arm pulled back to the hip.
- Frame 10: the punching arm starts pulling back, the body straightening.
- Frame 11: both arms coming back to the front, the knees straightening.
- Frame 12: back to the fighting stance, almost like frame 1, flowing back into frame 1.

SIZE RULES (strict): the crown, horns and head are EXACTLY THE SAME SIZE in all 12 frames. Only the arms, legs and body lean change; the boss never gets bigger or closer to the camera.

GRID RULES (strict):
- Every frame: the SAME boss, facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the boss stays in the center of its cell.
- The boss fills about 65% of its cell height (leave room for the long straight punch on the right).
- VERY WIDE empty white gaps between all cells and between the rows; no horn, crown, fist, boot or spike may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no effects, no fire, no smoke, no speed lines, no impact marks, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
