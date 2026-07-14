# GLYPHMIND

Browser N-back task in a first-person corridor. Each painting shows one hieroglyph. The first N paintings in a block are watch-only. After that, the participant answers MATCH or NO MATCH by comparing the current glyph to the glyph N paintings earlier in the same block.

Open `index.html` with `lib/` (Three.js, SheetJS) and `fonts/` beside it. No build step. No network at run time.

## Session contents

- Two scored blocks, 70 paintings each (exported)
- A 20-painting practice run before each scored block (shown on screen only; not exported)
- Session 1: cutscene, 6-slide tutorial, then the block loop below
- Sessions 2 and 3: skip cutscene and slides; short return gate, then the same block loop

Block order is fixed for the run: 1-back then 3-back, or 3-back then 1-back.

There is no pause menu. The session runs straight through once started.

## Scored block layout

Constants: `TOTAL_TRIALS = 70`, `PRACTICE_TRIALS = 20`, `MATCH_COUNT = 30`.

| Part                               |  Count | Paintings                      |
| ---------------------------------- | -----: | ------------------------------ |
| Watch-only                         |      N | 1 through N                    |
| Scored                             | 70 - N | N+1 through 70                 |
| True N-back matches in the full 70 |     30 | set when the sequence is built |

A full export has 140 rows (70 per block): `warmup` for watch-only paintings, then `scored` for the rest.

Practice accuracy can appear on transition screens. It is not written to the spreadsheet.

For analysis, use `trialType === "scored"` and `Resp` in {1, 2}. HUD block accuracy is correct answers divided by answered scored trials.

## N-back rule

For scored painting index i (i >= N):

- Current glyph: `seq[i]`
- Compare to: `seq[i - N]`
- Same: MATCH (left click). Different: NO MATCH (right click).

`CRESP` is the correct code (1 = match, 2 = no match). `ACC` is 1 when `Resp === CRESP`.

Desktop build uses the mouse only.

## Sequence generation

Each scored block calls `genSeqBlock(N, sequenceSeed)`:

- 70 glyphs in corridor order
- First N are random observe glyphs
- Remaining positions fill so the block has 30 matches across all 70 paintings
- Seeds are stored on the Meta sheet as `block1_sequenceSeed` and `block2_sequenceSeed`

Practice uses the same generator with 20 trials and is not exported.

## Timing

Helpers: `reactionTimeMs`, `interStimulusInterval`, `clickPerfNow` in `index.html` and `scripts/glyphmind-core.mjs`.

### Glyph reveal

A painting reveals when the player reaches that painting's corridor bay on the Z axis (about 4.2 m). Walking the corridor center is enough; no need to hug the side wall. The glyph glows, `revealTime` is stamped, and scored trials accept clicks in that same turn (including from the middle of the hall).

### RT (reaction time)

Time from painting revealed to button clicked.

`RT = clickTime - revealTime`

### RSI (response-stimulus interval)

Time from button clicked to next painting shown.

`RSI = thisRevealTime - lastClickTime`

| Situation                                          | RSI                            |
| -------------------------------------------------- | ------------------------------ |
| Scored trial after at least one click in the block | last click to this reveal      |
| Watch-only or first scored trial (no prior click)  | previous reveal to this reveal |
| First painting in block                            | 0                              |

No idle/pause subtraction. Wall clock only.

## Researcher setup (title screen)

1. Enter Participant ID (required; any non-empty text string, stored as-is in the export).
2. Pick Session 1, 2, or 3 (exported as `"1"`, `"2"`, or `"3"`).
3. Pick Stimulation: anodal, cathodal, or sham. Confirm the lit button matches the study plan (default is anodal).
4. Pick Block order: 1-BACK then 3-BACK, or 3-BACK then 1-BACK.
5. Click READY FOR PARTICIPANT.

Returning to the title screen clears the participant ID field.

## Participant flow

Session 1:

1. Participant BEGIN
2. Cutscene (staff can press Y to skip the cutscene only; slides still run)
3. Six tutorial slides
4. Block 1 practice gate, then 20 practice paintings
5. Block 1 scored instructions (MAIN ROUND), then 70 scored paintings
6. ROUND 1 COMPLETE (includes block 2 rules)
7. Block 2 practice gate, then 20 practice paintings
8. Block 2 scored instructions (FINAL ROUND), then 70 scored paintings
9. Session complete: DOWNLOAD DATA

Sessions 2 and 3 skip cutscene and slides. Short SESSION N RETURN gate, then block 1 practice and the same loop.

Gate labels:

- Block 1 practice: **PRACTICE** (same rules/controls layout as scored; 20 paintings)
- Block 1 scored intro: **MAIN ROUND**
- After block 1 scored: **ROUND 1 COMPLETE** (includes block 2 rules)
- Block 2 practice: **PRACTICE**
- Block 2 scored intro: **FINAL ROUND**

### Session 1 slide tutorial (not exported)

| Slide | Content                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------- |
| 1     | Welcome, corridor walk, block order                                                                 |
| 2     | Watch-only paintings, OBSERVE HUD                                                                   |
| 3     | 1-back and 3-back rules, MATCH / NO MATCH                                                           |
| 4-5   | Quizzes: 1-then-3 order uses a 2-painting 1-back quiz; 3-then-1 order uses a 4-painting 3-back quiz |
| 6     | Walk / look / click controls                                                                        |

Final button: CONTINUE TO PRACTICE (arrow glyph on screen). Tutorial and practice are never exported.

## Data recovery

Trial rows are copied to `sessionStorage` during play. If the tab reloads, a recovery banner offers DOWNLOAD DATA only. It does not resume the task. Incomplete recovery files get a `_PARTIAL` filename suffix and `exportStatus = partial` on Meta.

## Data export

Download is only on the session complete screen after both scored blocks finish.

Practice is not written to the xlsx. Scored blocks write 140 Trials rows (warmup + scored).

Trials columns: `PID`, `Session`, `Condition`, `block`, `nback`, `trialType`, `trial`, `isMatch`, `CRESP`, `Resp`, `ACC`, `runningAccuracy`, `RT`, `RSI`, `StimulusName`, `StimulusChar`.

Meta includes timestamps, `blockOrder_key`, row counts, per-block seeds, and QC counts.

Example filename: `BSVG_GLYPHMIND_SESSION2_01.xlsx`

Partial recovery example: `BSVG_GLYPHMIND_SESSION2_01_PARTIAL.xlsx`

Rename in the lab if you need condition, block order, or date in the filename.

## Stimulus set

12 hieroglyphs (Noto Sans Egyptian Hieroglyphs). Indices 0 through 11 map to the in-app `GLYPHS` table. Export uses `StimulusName` and `StimulusChar`.

## Controls

| Action   | Desktop                            |
| -------- | ---------------------------------- |
| Move     | W A S D or arrows; Shift to sprint |
| Look     | Mouse (pointer lock on the canvas) |
| MATCH    | Left click                         |
| NO MATCH | Right click                        |

Space and Enter advance tutorial slides and dismiss instruction gates only. Keyboard keys do not answer trials.

Staff shortcut (not shown to participants): Y during the session 1 cutscene skips the cutscene only. The slide tutorial still runs.

## Validation

Needs Node.js for the scripts below. The task itself runs in the browser with no install.

```bash
node scripts/verify-logic.mjs
node scripts/verify-session-data.mjs
node scripts/audit-export.mjs path/to/export.xlsx --strict
```

A complete session should pass with 140 rows and zero pending scored rows under `--strict`.

If `file://` is blocked:

```bash
python3 -m http.server 8080
```

## Operator checklist

See [GLYPHMIND_Game_Run_Protocol.md](./GLYPHMIND_Game_Run_Protocol.md).

## Libraries

- Three.js (`lib/three.min.js`) for the corridor
- SheetJS (`lib/xlsx.full.min.js`) for export
- Fonts in `fonts/` (see `fonts/FONT_NOTICE.txt`)
