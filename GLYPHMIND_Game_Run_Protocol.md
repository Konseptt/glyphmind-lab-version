# GLYPHMIND Game Task Run Protocol

How research staff run the GLYPHMIND N-back task in the BSVG/tDCS study. This covers the computer task only. Consent, screening, tDCS setup, safety checks, and debrief still follow the approved IRB protocol.

## 1. What the task is

The participant walks a first-person corridor. Paintings alternate on the left and right walls. When the participant stands close enough, a hieroglyph appears on the painting.

- **1-back:** compare the current painting to the previous one in the same block.
- **3-back:** compare the current painting to the one three steps back in the same block.
- **MATCH:** left click (desktop).
- **NO MATCH:** right click (desktop).

Each **scored** block has **70 paintings**. The first **N** are watch-only and count toward those 70. The rest are scored. Each block is built with **30** true N-back matches among all 70 paintings.

Before each scored block, the participant runs a **20-painting practice** at the same N-back level. Practice is not exported. Practice accuracy is shown on the transition screen before the scored block.

In the export, a full two-block session has **140 rows** (70 per block). Use `trialType === "scored"` and answered `Resp` values for primary analysis. Watch-only rows use `trialType = warmup` and blank `Resp`.

The session runs **continuously** once started. There is no pause menu and no in-task block restart.

## 2. Before the participant arrives

1. Confirm participant ID, session number (1, 2, or 3), stimulation condition, and task phase (pre, during, or post) from the study record.
2. Open the GLYPHMIND folder. Check that `index.html`, `lib/`, and `fonts/` are present.
3. Load the task in Chrome, Firefox, Safari, or Edge. If `file://` fails, use a local server:

   ```bash
   python3 -m http.server 8765 --bind 127.0.0.1
   ```

   Then open `http://127.0.0.1:8765/index.html`.

4. Optional smoke test:

   ```bash
   node scripts/verify-logic.mjs
   node scripts/verify-session-data.mjs
   ```

   Expect `All checks passed.`

5. Clear the download folder or confirm the last participant's file was moved.
6. Do not type the participant's name into the game. Use the assigned ID only.
7. Set **ACCESSIBILITY** options on the title screen if needed before **READY FOR PARTICIPANT**.

## 3. Title screen setup

1. **Block order:** `1-BACK then 3-BACK` or `3-BACK then 1-BACK` per counterbalancing.
2. **Participant ID:** deidentified ID only.
3. **Session:** click `1`, `2`, or `3` (stored in the export as `"1"`, `"2"`, or `"3"`).
4. **Stimulation:** ANODAL, CATHODAL, or SHAM. Stored as `anodal`, `cathodal`, or `sham`. Confirm the lit button matches randomization (default is anodal).
5. **ACCESSIBILITY** (optional): high contrast, HUD glyph labels, larger crosshair, low mouse sensitivity, mute, longer glyph glow.
6. Click **READY FOR PARTICIPANT**. The participant screen shows ID and session only.

## 4. What to tell the participant

Read or paraphrase:

"You will walk down a hallway. Paintings are on the walls to your left and right. Walk up to each painting and stop when you are close enough for the symbol to appear.

Remember the symbols and decide whether the new symbol matches one from earlier in the same block.

In a 1-back block, compare to the previous painting. In a 3-back block, compare to the painting three back. Same symbol: left click for MATCH. Different symbol: right click for NO MATCH.

The first painting in a 1-back block is watch-only. The first three in a 3-back block are watch-only. Just look and remember; do not click yet. The screen will say OBSERVE.

Before each main block you will get a short practice run. You can miss answers in practice and still continue.

Use the mouse to answer during the main blocks: left click MATCH, right click NO MATCH. Keyboard keys do not count as answers. The run is continuous once it starts. Questions before we start?"

**Current build:** desktop mouse only. On-screen touch buttons are not implemented yet.

## 5. Running the task

### Session 1

1. Participant clicks **BEGIN**.
2. Short cutscene (click or key to advance). Staff may press **Y** to skip the cutscene only; the slide tutorial still runs.
3. **Slide tutorial** (6 slides):
   - Welcome and block order
   - Watch-only / OBSERVE rules
   - 1-back and 3-back answer rules
   - Two practice quizzes (order-specific: 1-then-3 uses 1-back quiz; 3-then-1 uses 3-back quiz)
   - Walk / look / click controls
   - Final button: **CONTINUE TO PRACTICE** (with arrow on screen)
4. Block 1 practice gate, then **BEGIN ... PRACTICE** (20 paintings).
5. Block 1 scored instruction gate (**MAIN ROUND**), then **BEGIN ROUND 1** (70 paintings).
6. **ROUND 1 COMPLETE** gate (block 2 rules), then **CONTINUE**.
7. Block 2 practice gate, then practice (20 paintings).
8. Block 2 scored instruction gate (**FINAL ROUND**), then **BEGIN ROUND 2** (70 paintings).
9. Session complete screen. Click **DOWNLOAD DATA** before closing the browser.

### Sessions 2 and 3

Same block structure. No cutscene or slide tutorial. Short **SESSION N RETURN** gate, then block 1 practice.

### During a block

- HUD shows painting number, N-back level, **OBSERVE** on watch-only trials, and running accuracy on scored trials.
- Participant must answer every scored painting before the next painting can reveal.
- Paintings reveal when the participant is within about **3 m** of the panel (3D distance). Encourage stopping at each painting.
- **Esc** closes the accessibility panel only if it was opened from the title screen. There is no pause menu.
- If the tab reloads, use the recovery banner **DOWNLOAD DATA**. Recovery exports do not resume the session; incomplete files are marked `_PARTIAL`.

## 6. Timing fields (for analysis)

### RT

Time from **painting revealed** to **button clicked**.

`RT = clickTime - revealTime`

### RSI

Time from **button clicked** to **next painting shown**.

`RSI = thisRevealTime - lastClickTime`

On watch-only trials (and the first scored trial, before any click in the block), there is no prior click, so RSI uses **previous painting shown to this painting shown** instead.

Practice and tutorial trials are not exported.

## 7. Export and QC

1. After block 2, click **DOWNLOAD DATA** on the session complete screen.
2. Check the download folder. Auto filename pattern:

   `BSVG_GLYPHMIND_SESSION{1|2|3}_{participantID}.xlsx`

   Example: `BSVG_GLYPHMIND_SESSION2_01.xlsx`

3. Rename per lab convention if needed.
4. Open the workbook or run:

   ```bash
   node scripts/audit-export.mjs path/to/file.xlsx --strict
   ```

5. Complete session checks:
   - **140** Trials rows total.
   - **70** rows per block (`warmup` + `scored`).
   - **30** scored rows with `isMatch = 1` per block (Meta QC).
   - `rows_scored_pending = 0` on Meta.
   - Both `block1_sequenceSeed` and `block2_sequenceSeed` present.

6. Log irregularities: early stop, reload, discomfort, partial export.

## 8. After the participant

Follow IRB protocol for tDCS removal, scheduling, debrief, and filing. Move the `.xlsx` to the study data folder. Keep consent forms separate from data files.

## 9. Troubleshooting

| Problem | What to try |
|---------|-------------|
| Blank page | Confirm `lib/` and `fonts/` are present; try a local server |
| Box glyphs | Confirm `fonts/` folder; reload |
| Export fails | Confirm `lib/xlsx.full.min.js`; do not close browser until download finishes |
| Reload mid-session | Use recovery banner download; do not dismiss without saving |
| Confused participant | Restate 1-back vs 3-back, walk-to-painting, and left vs right click |
| RTs look very long | Confirm participant is walking to each side painting (not only down the corridor center) |

## 10. Shipped behavior (staff reference)

1. **20-trial practice** before each scored block. Not exported.
2. **Instruction gate** after each practice block before the scored hall.
3. **Watch-only paintings** take no click. First N in each scored block.
4. **Mouse only** on desktop for MATCH / NO MATCH.
5. **Block 1 break:** ROUND 1 COMPLETE (includes block 2 rules). **Block 2 practice gate:** PRACTICE ROUND. **Block 2 scored:** FINAL ROUND.
6. **70 paintings** logged per scored block. Observe trials are inside those 70.
7. **Download** only at session complete. **TITLE SCREEN** starts the next participant (PID field clears).
8. **Condition** in export: `anodal`, `cathodal`, or `sham`. Verify the button before BEGIN.
9. **Accessibility** on title screen only. **Esc** closes that panel if open.
10. **Staff shortcut Y** during session 1 cutscene skips cutscene only (not shown to participants).
11. **Audio:** corridor SFX unless participant mutes in Accessibility.

tDCS electrode placement and stimulation parameters are not covered here. Use the approved stimulation protocol.
