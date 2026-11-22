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

## B2-① 불꽃 대마왕 걷기 (불타는 거구의 큰 걸음) — 첨부 `art/boss2_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Flame Demon King boss (a huge lava-rock brute with glowing orange-yellow lava cracks all over its dark red body, a round head with glowing yellow eyes and a wide toothy grin, big dark curved horns with lava cracks, flames burning on top of the head, a gold crown with red gems, black-and-gold spiked shoulder plates, a thick gold chain with a red gem, black-and-gold studded arm bands, huge lava fists with small flames on the wrists, a belt with a gold skull buckle, a torn red cloth, black-and-gold studded leg bands, big lava-rock feet). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The head flames, crown, horns, shoulder plates, chain, skull belt and wrist flames are in EVERY frame. The flames are part of the character's body only (same size in every frame).

ANIMATION: a slow, powerful MENACING WALK in place, facing right (seen from the 3/4 front-right like the attached image). The LEGS MUST CLEARLY MOVE: in every frame the two legs are in a DIFFERENT position, exactly like this (the "front leg" is the leg on the right side of the picture):
- Frame 1: both feet on the ground, legs apart, standing like the attached image.
- Frame 2: the front leg starts to lift, its knee bending, its heel off the ground.
- Frame 3: the front leg lifted HIGH, knee up at belt height, foot clearly in the air; the body leans slightly back.
- Frame 4: the front leg swinging forward, foot still in the air and further to the right.
- Frame 5: the front foot lands far forward, legs in a wide step; the body dips, the head flames flicker backward.
- Frame 6: weight moves onto the front leg; the back foot's heel lifts.
- Frame 7: the back leg starts to lift, its knee bending, its foot off the ground.
- Frame 8: the back leg lifted HIGH, knee up at belt height, foot clearly in the air.
- Frame 9: the back leg swinging forward past the front leg, foot in the air.
- Frame 10: the back foot lands; legs in a wide step the other way; the body dips.
- Frame 11: weight shifting back to the middle, both feet on the ground, legs wide.
- Frame 12: standing up again, almost like frame 1, flowing back into frame 1.
The fists swing opposite to the legs. The torn red cloth sways with each step. The head flames flicker a little differently in each frame. The face keeps the same evil grin.

GRID RULES (strict):
- Every frame: the SAME boss at the SAME size (the same crown and head size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the boss stays in the center of its cell.
- The boss (including the head flames) fills about 70% of its cell height (leave room for the lifted knees and the flames).
- VERY WIDE empty white gaps between all cells and between the rows; no horn, flame, crown, fist, foot or spike may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo around the body, no sticker border, no extra fire or smoke or embers floating away from the body, no lava puddles, no footprints, no speed lines, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B2-② 불꽃 대마왕 공격 (두 주먹 들어 땅 내려치기 → 불바다) — 첨부 `art/boss2_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Flame Demon King boss (a huge lava-rock brute with glowing orange-yellow lava cracks all over its dark red body, a round head with glowing yellow eyes and a wide toothy grin, big dark curved horns with lava cracks, flames burning on top of the head, a gold crown with red gems, black-and-gold spiked shoulder plates, a thick gold chain with a red gem, black-and-gold studded arm bands, huge lava fists with small flames on the wrists, a belt with a gold skull buckle, a torn red cloth, black-and-gold studded leg bands, big lava-rock feet). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The head flames, crown, horns, shoulder plates, chain and skull belt are in EVERY frame.

ANIMATION: a FIRE SLAM in place, facing right. Each frame MUST show a DIFFERENT pose, exactly like this:
- Frame 1: standing like the attached image, fists at the sides.
- Frame 2: both fists rising to chest height, the wrist flames growing a little bigger.
- Frame 3: both fists raised above the shoulders, the flames on the fists bigger, the head flames rising taller.
- Frame 4: both fists raised HIGH above the head, the fists burning with big flames, mouth wide open roaring, the lava cracks glowing brighter.
- Frame 5: same high pose, leaning slightly back, eyes blazing (maximum power).
- Frame 6: both fists swinging down in front of the chest, knees bending.
- Frame 7: both fists almost hitting the ground, the body leaning far forward, knees bent low.
- Frame 8: SLAM: both burning fists smashed on the ground in front, the body crouched low, the head flames blown up tall.
- Frame 9: still crouched with the fists on the ground, grinning, the fist flames still big.
- Frame 10: starting to rise, the fists lifting off the ground, the fist flames shrinking.
- Frame 11: almost standing up, fists coming back to the sides.
- Frame 12: standing like frame 1 again, flowing back into frame 1.
The flames stay attached to the fists and the head only (they can grow bigger on the fists in frames 3-9).

SIZE RULES (strict): the crown, horns and head are EXACTLY THE SAME SIZE in all 12 frames. Only the arms, legs, body lean and flame size change; the boss never gets bigger or closer to the camera.

GRID RULES (strict):
- Every frame: the SAME boss, facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the boss stays in the center of its cell.
- The boss (including the raised burning fists and head flames) fills about 65% of its cell height (leave room above for the raised fists).
- VERY WIDE empty white gaps between all cells and between the rows; no horn, flame, crown, fist, foot or spike may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo around the body, no sticker border, no fire on the ground, no fire waves, no explosions, no smoke, no embers floating away from the body, no lava puddles, no cracks in the ground, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B3-① 얼음 용 걷기 (네 발로 성큼 + 날개 들썩) — 첨부 `art/boss3_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Ice Dragon boss (a big blue four-legged dragon with a pale belly, a head facing right with glowing cyan eyes and an open toothy mouth, light-blue ice crystal spikes on the head, back and tail, a small gold crown with red gems, two big blue bat-like wings with ice crystals and gold studs on the wing joints, grey-and-gold studded shoulder armor with a big red gem on the chest, grey-and-gold studded bands on the legs and tail, and big white claws). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, ice spikes, wings, chest armor with the red gem, leg bands and white claws are in EVERY frame.

ANIMATION: a heavy FOUR-LEGGED PROWLING WALK in place, facing right (3/4 view like the attached image). The LEGS MUST CLEARLY MOVE in every frame, like a big lizard walking (diagonal legs move together):
- Frame 1: standing like the attached image, all four feet on the ground, wings half open.
- Frame 2: the front-right claw and the back-left foot start to lift.
- Frame 3: the front-right claw lifted high and reaching forward, the back-left foot in the air; the wings rise a little.
- Frame 4: the front-right claw stretched far forward just above the ground.
- Frame 5: the front-right claw lands far forward, the body dips, the head lowers, the wings go down.
- Frame 6: the body slides forward over the planted claw, the tail swings to the other side.
- Frame 7: the front-left claw and the back-right foot start to lift.
- Frame 8: the front-left claw lifted high and reaching forward; the wings rise a little.
- Frame 9: the front-left claw stretched far forward just above the ground.
- Frame 10: the front-left claw lands, the body dips, the head lowers, the wings go down.
- Frame 11: the body slides forward, the tail swinging back.
- Frame 12: almost like frame 1, flowing back into frame 1.
The tail sways side to side and the wings gently rise and fall with each step. The head stays facing right with the open mouth and glowing eyes.

GRID RULES (strict):
- Every frame: the SAME dragon at the SAME size (the same crown and head size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the dragon stays in the center of its cell.
- The dragon (including the wings and tail) fills about 70% of its cell width and height.
- VERY WIDE empty white gaps between all cells and between the rows; no wing tip, tail tip, ice spike, crown or claw may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no snow, no ice on the ground, no frost breath, no sparkles floating away from the body, no footprints, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B3-② 얼음 용 공격 (숨 들이마시고 → 얼음 숨결 내뿜기) — 첨부 `art/boss3_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Ice Dragon boss (a big blue four-legged dragon with a pale belly, a head facing right with glowing cyan eyes and an open toothy mouth, light-blue ice crystal spikes on the head, back and tail, a small gold crown with red gems, two big blue bat-like wings with ice crystals and gold studs on the wing joints, grey-and-gold studded shoulder armor with a big red gem on the chest, grey-and-gold studded bands on the legs and tail, and big white claws). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, ice spikes, wings, chest armor with the red gem, leg bands and white claws are in EVERY frame.

ANIMATION: an ICE BREATH attack in place, facing right. Each frame MUST show a DIFFERENT pose, exactly like this:
- Frame 1: standing like the attached image, wings half open.
- Frame 2: the head pulls back and up, the mouth closing, the chest starting to swell.
- Frame 3: rearing up on the back legs a little, the front claws lifting off the ground, the head pulled far back, the chest swollen (breathing in), the wings spreading wide.
- Frame 4: reared up higher, wings fully spread wide open, the chest and throat glowing light cyan inside, eyes squinting.
- Frame 5: same high pose, the cheeks puffed, the light cyan glow brighter in the throat (maximum charge).
- Frame 6: the head snapping forward and down toward the right, the mouth opening wide.
- Frame 7: BREATH: the front claws slam back on the ground, the neck stretched far forward to the right, the jaws wide open, the wings pushed back.
- Frame 8: same breathing pose, the body pushing forward, the tail lifted high.
- Frame 9: still breathing forward, the head shaking slightly, the wings starting to fold.
- Frame 10: the mouth closing, the head pulling back to normal, the wings half open.
- Frame 11: settling down, all four feet on the ground.
- Frame 12: almost like frame 1, flowing back into frame 1.
Draw ONLY the dragon: the breath itself is NOT drawn (no frost cloud, no ice beam coming out of the mouth).

SIZE RULES (strict): the crown and head are EXACTLY THE SAME SIZE in all 12 frames. Only the neck, legs, wings and body pose change; the dragon never gets bigger or closer to the camera.

GRID RULES (strict):
- Every frame: the SAME dragon, facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame (the reared-up frames keep the back feet on the same ground line); the dragon stays in the center of its cell.
- The dragon (including the spread wings and tail) fills about 65% of its cell width and height (leave room for the fully spread wings and the stretched neck).
- VERY WIDE empty white gaps between all cells and between the rows; no wing tip, tail tip, ice spike, crown or claw may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo around the body, no sticker border, no frost breath, no ice beam, no snow, no ice shards flying, no sparkles floating away from the body, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B4-① 거미 여왕 걷기 (여덟 다리 사각사각) — 첨부 `art/boss4_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Spider Queen boss (a big purple spider with a round striped purple abdomen covered by a grey armor plate with gold spikes and studs, a purple head facing right with many glowing red eyes, big ivory fangs and a toothy mouth, a gold crown with a red gem on a grey armored collar, grey-and-gold armor on the shoulders, and eight thick purple legs with gold studded bands and glossy bright purple pointed tips). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, red eyes, fangs, abdomen armor with gold spikes and all eight legs are in EVERY frame.

ANIMATION: a quick SCUTTLING WALK in place, facing right (3/4 view like the attached image). The LEGS MUST CLEARLY MOVE in every frame, like a real spider (the legs move in two alternating groups of four):
- Frame 1: standing like the attached image, all eight leg tips on the ground.
- Frames 2-3: group A legs (front-right, third-right, second-left, back-left) lift up high, bending at the joints, tips off the ground; group B legs stay planted.
- Frame 4: group A legs reach forward to the right in the air.
- Frame 5: group A leg tips land forward; the body shifts forward and dips a little.
- Frame 6: all legs on the ground, the body forward, the abdomen swaying back.
- Frames 7-8: group B legs (second-right, back-right, front-left, third-left) lift up high, tips off the ground; group A legs stay planted.
- Frame 9: group B legs reach forward to the right in the air.
- Frame 10: group B leg tips land forward; the body dips a little.
- Frame 11: all legs on the ground, the abdomen swaying back.
- Frame 12: almost like frame 1, flowing back into frame 1.
The abdomen bobs up and down a little with each step. The head stays facing right with the red eyes glowing; the fangs open and close slightly.

GRID RULES (strict):
- Every frame: the SAME spider at the SAME size (the same crown and head size in all 3 rows), facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the spider stays in the center of its cell.
- The spider (including all legs) fills about 70% of its cell width and height.
- VERY WIDE empty white gaps between all cells and between the rows; no leg tip, spike, fang or crown may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no webs, no silk threads, no baby spiders, no dust, no footprints, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B4-② 거미 여왕 공격 (일어서서 → 앞다리 쾅, 거미줄 소환) — 첨부 `art/boss4_src.png` · 픽스버스용(LAYOUT 포함)
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Spider Queen boss (a big purple spider with a round striped purple abdomen covered by a grey armor plate with gold spikes and studs, a purple head facing right with many glowing red eyes, big ivory fangs and a toothy mouth, a gold crown with a red gem on a grey armored collar, grey-and-gold armor on the shoulders, and eight thick purple legs with gold studded bands and glossy bright purple pointed tips). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, red eyes, fangs, abdomen armor with gold spikes and all eight legs are in EVERY frame.

ANIMATION: a WEB SUMMON attack in place, facing right. Each frame MUST show a DIFFERENT pose, exactly like this:
- Frame 1: standing like the attached image.
- Frame 2: the body leans back, the two front legs start to rise.
- Frame 3: REARING UP: the front of the body lifted high, the two front legs raised high in the air and spread wide, the fangs wide open, the abdomen pressed low behind.
- Frame 4: same reared pose, the second pair of legs also raised, the red eyes glowing brighter (hissing).
- Frame 5: reared up highest, all front legs curled up above the head, the abdomen tip lifting up behind.
- Frame 6: the front legs swinging down hard toward the ground.
- Frame 7: SLAM: the front legs stabbing the ground in front, the body low and forward, the fangs snapping.
- Frame 8: still low, the abdomen raised high behind and pointing back (shooting webs, but do NOT draw any web).
- Frame 9: the abdomen shaking, the front legs still on the ground, the eyes glowing.
- Frame 10: the abdomen lowering, the body rising a little.
- Frame 11: settling down, legs spreading back to normal.
- Frame 12: almost like frame 1, flowing back into frame 1.

SIZE RULES (strict): the crown and head are EXACTLY THE SAME SIZE in all 12 frames. Only the legs, abdomen and body tilt change; the spider never gets bigger or closer to the camera.

GRID RULES (strict):
- Every frame: the SAME spider, facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame (the reared-up frames keep the back legs on the same ground line); the spider stays in the center of its cell.
- The spider (including the raised legs) fills about 65% of its cell width and height (leave room above for the raised legs).
- VERY WIDE empty white gaps between all cells and between the rows; no leg tip, spike, fang or crown may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no webs, no silk threads, no baby spiders, no dust, no impact marks, no cracks, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```

## B4-①-2 거미 여왕 걷기 다시 (첫 번째: 1536×1024로 작고, 다리가 거의 안 들리고, 아래 줄로 갈수록 커짐) — 첨부 `art/boss4_src.png` · 픽스버스용
```
TASK: one 2D game ANIMATION SPRITE SHEET of the attached boss character: exactly 12 frames arranged in a grid of 4 columns x 3 rows, read left to right, top row first.

LAYOUT (very important): the whole 4x3 grid must sit in the LOWER-LEFT part of the image. Leave a big EMPTY pure white margin along the TOP edge (the top 15% of the image height) and along the RIGHT edge (the right 15% of the image width). The TOP-RIGHT CORNER of the image (the right 30% of the width x the top 20% of the height) must be COMPLETELY EMPTY white, with no part of any frame in it. Also leave a thin empty white margin along the left and bottom edges.

CHARACTER: the attached Spider Queen boss (a big purple spider with a round striped purple abdomen covered by a grey armor plate with gold spikes and studs, a purple head facing right with many glowing red eyes, big ivory fangs and a toothy mouth, a gold crown with a red gem on a grey armored collar, grey-and-gold armor on the shoulders, and eight thick purple legs with gold studded bands and glossy bright purple pointed tips). Keep EXACTLY the same design, colors, thick black outlines, cel shading, proportions and art style in every frame. The crown, red eyes, fangs, abdomen armor with gold spikes and all eight legs are in EVERY frame.

ANIMATION: a quick SCUTTLING WALK in place, facing right (3/4 view like the attached image). THE LEG MOVEMENT MUST BE BIG AND OBVIOUS: in the lifting frames the raised leg tips are clearly HIGH in the air with a big empty white gap under them (at least half a leg length above the ground line), and the raised legs bend sharply at the joints. The legs move in two alternating groups of four:
- Frame 1: standing like the attached image, all eight leg tips on the ground.
- Frame 2: group A legs (front-right, third-right, second-left, back-left) lifting, tips clearly off the ground.
- Frame 3: group A legs lifted HIGH, knees bent sharply upward, tips high in the air; group B legs planted.
- Frame 4: group A legs swinging forward to the right, still high in the air.
- Frame 5: group A leg tips land far forward; the body shifts forward and dips low.
- Frame 6: all legs on the ground, the body forward, the abdomen swaying back.
- Frame 7: group B legs (second-right, back-right, front-left, third-left) lifting, tips clearly off the ground.
- Frame 8: group B legs lifted HIGH, knees bent sharply upward, tips high in the air; group A legs planted.
- Frame 9: group B legs swinging forward to the right, still high in the air.
- Frame 10: group B leg tips land far forward; the body dips low.
- Frame 11: all legs on the ground, the abdomen swaying back.
- Frame 12: almost like frame 1, flowing back into frame 1.
The abdomen bobs up and down with each step. The head stays facing right with the red eyes glowing.

SIZE RULES (strict): the spider is EXACTLY THE SAME SIZE in all 12 frames and in all 3 rows (the same crown, head and abdomen size). The bottom row must NOT be bigger than the top row. Never move closer to the camera.

GRID RULES (strict):
- Every frame: the SAME spider, facing right, 3/4 top-down game view, same as the attached image.
- Same ground line in every frame; the spider stays in the center of its cell.
- The spider (including all legs) fills about 70% of its cell width and height.
- VERY WIDE empty white gaps between all cells and between the rows; no leg tip, spike, fang or crown may touch or come near another cell.
- Only the 12 frames. No extra poses, no labels.

BACKGROUND: plain pure white (#FFFFFF) everywhere, no grid lines, no frame borders, no ground line, no shadows, no glow halo, no sticker border, no webs, no silk threads, no baby spiders, no dust, no footprints, no text, no letters, no numbers, no watermark.
QUALITY: ultra high resolution, QHD (2560x1440) or higher, crisp clean lines
```
