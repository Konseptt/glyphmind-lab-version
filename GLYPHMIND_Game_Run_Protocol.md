# GLYPHMIND Game Task Run Protocol

This procedure describes how research staff should run the GLYPHMIND video-game N-back task within the BSVG/tDCS study protocol. It is written as an operator guide for the computer task only; all consent, eligibility screening, tDCS setup, stimulation safety checks, and debriefing must follow the approved IRB protocol and be performed by trained study personnel.

## 1. Purpose of the Game Task

GLYPHMIND is the video-game version of the working-memory N-back task. The participant walks through a first-person corridor and views a sequence of hieroglyph symbols, one symbol per painting. In each block, the participant compares the current symbol to a previous symbol in the same sequence:

- In the 1-back block, compare the current painting to the previous painting.
- In the 3-back block, compare the current painting to the painting three paintings earlier.
- If the symbols are the same, respond **MATCH** (left click on desktop).
- If the symbols are different, respond **NO MATCH** (right click on desktop).

Each complete block contains 70 paintings. The first N paintings are observe-only and are **included in those 70** (there is no separate practice corridor or 71st seed painting). The remaining paintings are scored. Each complete block is generated with exactly 30 true N-back matches among scored paintings. In the export, **`isMatchPainting = 1`** appears on 30 rows and **`isMatchPainting = 0`** on 40 rows per block (observe rows count toward the 40). The app stores the randomization seed for each block in the exported workbook.

| Block part | Count | Paintings |
|------------|------:|-----------|
| Observe-only | N | 1 … N |
| Scored | 70 − N | N+1 … 70 |
| Scored N-back matches | 30 | among scored rows |
| Export `isMatchPainting = 0` | 40 | N observe + scored non-matches |

For analysis, use **`trialType === "scored"`** (or **`CRESP`**) rather than counting observe rows as behavioral non-matches.

## 2. Materials Needed

Before the participant begins the task, prepare:

- Study paperwork required for the session.
- Participant ID from the participant list.
- Session number or session label.
- Assigned stimulation condition according to the approved study randomization.
- Computer with the GLYPHMIND folder available.
- The full GLYPHMIND folder, including `index.html`, `lib/`, and `fonts/`.
- A known data-save location for exported `.xlsx` files.
- tDCS materials and device setup items, if this run occurs during a stimulation session.

Do not enter the participant's name into the game. Use only the assigned participant ID.

## 3. Before the Participant Arrives

1. Confirm the session identity.
   - Verify the participant ID.
   - Verify whether the session is Session 1, Session 2, or Session 3.
   - Verify the stimulation condition from the study randomization record.
   - Verify which task phase is being run: pre, during stimulation, or post.

2. Prepare the computer.
   - Open the GLYPHMIND folder.
   - Confirm that `index.html`, `lib/`, and `fonts/` are all present in the same folder.
   - Open the task in a current browser such as Chrome, Firefox, Safari, or Edge.
   - If double-clicking `index.html` is blocked by the computer, serve the folder locally:

     ```bash
     python3 -m http.server 8765 --bind 127.0.0.1
     ```

     Then open:

     ```text
     http://127.0.0.1:8765/index.html
     ```

3. Confirm the task loads correctly.
   - The GLYPHMIND title screen should appear.
   - The title screen should show fields for participant ID, session ID, stimulation (anodal / cathodal / sham), and block order.
   - The glyphs should display as symbols, not empty boxes.
   - Optional same-day smoke test:

     ```bash
     node scripts/verify-logic.mjs
     ```

     Expect: `All checks passed.`

4. Prepare the data folder.
   - Confirm that the previous participant's data file has already been renamed and moved.
   - Set or note the browser's download location.
   - Make sure exported files will not be confused with another participant's files.

## 4. When the Participant Arrives

1. Follow the approved protocol for greeting, belongings, seating, consent, questionnaires, and eligibility/safety screening.

2. Seat the participant at the computer.
   - Adjust chair, screen, keyboard, and **mouse** so the participant can comfortably see the screen and respond.
   - **Responses use the mouse only** on desktop: left click = MATCH, right click = NO MATCH. Keyboard keys F, Space, and J do not register responses.
   - If the participant will use the mouse, make sure there is enough desk space and that right-click is enabled in the browser.
   - If the participant has long hair and the session includes tDCS, follow the protocol instructions for tying hair back before electrode placement.

3. If this session includes stimulation, complete the tDCS preparation exactly as approved in the study protocol.
   - Confirm electrode placement according to the assigned condition.
   - Confirm the participant is comfortable before starting stimulation.
   - Monitor for discomfort according to the approved procedure.
   - Do not change stimulation parameters based on this game protocol; use the finalized tDCS protocol/device instructions.

## 5. Entering Session Information in GLYPHMIND

On the GLYPHMIND title screen:

1. Select the block order.
   - Choose `1-BACK -> 3-BACK` or `3-BACK -> 1-BACK` according to the study counterbalancing/randomization plan.
   - Use the same order recorded for that participant/session.

2. Enter Participant ID.
   - Use the assigned deidentified ID only.
   - Do not enter the participant's name or initials unless those are part of the approved ID system.

3. Enter Session ID.
   - Use a clear label such as `S1`, `S2`, or `S3`.
   - If multiple game runs occur in one session, include the run label in the session field or in the post-run filename, according to lab naming rules.

4. Select **Stimulation**.
   - Choose **ANODAL**, **CATHODAL**, or **SHAM** according to the approved study randomization.
   - This value is stored in the export as `Condition` (`anodal`, `cathodal`, or `sham`).

5. Click `READY FOR PARTICIPANT`.
   - The participant screen shows only **Participant ID** and **Session ID** (not stimulation or block order).

## 6. Participant Instructions Script

Read or paraphrase the following before the participant starts:

"In this task, you will move through a corridor and look at paintings on the wall. Each painting will reveal one symbol. Your job is to remember the symbols and decide whether each new symbol matches a symbol you saw earlier in the same block.

In a 1-back block, compare the current symbol to the symbol from the previous painting. In a 3-back block, compare the current symbol to the symbol from three paintings earlier. If the symbols are the same, **left click** for MATCH. If they are different, **right click** for NO MATCH.

The first painting in a 1-back block is watch-only. The first three paintings in a 3-back block are watch-only. For those paintings, just look at the symbol and remember it; do not click yet.

The game will tell you which block you are in before it starts. Please read the instructions on the screen. Use the **mouse only** to answer scored paintings: **left click = MATCH**, **right click = NO MATCH**. There are no keyboard keys for MATCH or NO MATCH. If you are on a touch device, use the on-screen MATCH and NO MATCH buttons at the bottom of the screen.

Try to respond as accurately as you can. Do you have any questions before we begin?"

Important: This script differs from the older standard N-back script. In GLYPHMIND, the observe-only paintings should not receive a response, and scored responses use **mouse clicks only** (not F, Space, or J).

## 6.1 Response controls (desktop vs touch)

| Input | MATCH (`Resp = 1`) | NO MATCH (`Resp = 2`) |
|-------|-------------------|------------------------|
| **Desktop (mouse)** | **Left click** on the game view | **Right click** on the game view |
| **Touch device** | Tap **MATCH** button (bottom of screen) | Tap **NO MATCH** button (bottom of screen) |
| **Keyboard** | *Not used for responses* | *Not used for responses* |

Movement and navigation still use the keyboard on desktop (**W A S D** or arrows, **Shift** to sprint, **Esc** to pause). **Space** and **Enter** advance tutorial slides and dismiss instruction overlays only; they do not submit MATCH or NO MATCH during the corridor.

Before the first block, confirm the participant can left-click and right-click in the browser. If right-click opens a browser menu instead of registering NO MATCH, use full-screen mode and click on the game canvas, not the browser chrome.

## 7. Starting the Game During a tDCS Session

If the task is being run during stimulation:

1. Start stimulation according to the approved tDCS protocol.
2. Have the participant sit calmly for the required pre-task stimulation period.
3. After the required wait period, ask the participant to begin the GLYPHMIND task.
4. Remain available nearby. If the protocol allows the researcher to leave the room during task performance, return promptly when the participant finishes or if they call for help.
5. Do not engage the participant in unrelated conversation or other cognitive tasks during stimulation.

For sham sessions, follow the approved sham procedure and maintain the same participant-facing routine as much as possible.

## 8. Running the GLYPHMIND Task

### 8.1 Start of session (both blocks)

1. On the participant start screen, have the participant click **BEGIN**.

2. **Cutscene** (skippable with Esc).
   - Short narrative intro; **no background music** (only a brief transition sound).
   - Participant may skip if your lab procedure allows.

3. **Tutorial** (four slides, skippable).
   - Covers walking to paintings, N-back rule, controls, and that each block starts with a brief rule reminder.
   - **Space**, **Enter**, or **NEXT** advances; last slide shows **BEGIN (Space)** on a new session.

4. **Block 1 instruction overlay**.
   - Short on-screen rule for the first N level (1-back or 3-back) plus controls summary.
   - Dismiss with the enter button, **Space**, or **Enter**.

5. **Block 1 corridor**.
   - Participant walks to paintings **1…70 in order**.
   - A glyph appears when they are close enough.
   - Top-right HUD shows **`PAINTING n/70`**, **`· OBSERVE`** on watch-only paintings, and running **ACC** after scored responses begin.
   - Observe paintings **1…N:** look and continue; **no click**.
   - Scored paintings **N+1…70:** **left click** = MATCH, **right click** = NO MATCH, before the next painting can appear.

### 8.2 Pause and help

Press **Esc** to open the pause menu:

| Control | Use |
|---------|-----|
| **Resume** | Continue the block |
| **Controls** | Re-open tutorial slides |
| **Accessibility** | Contrast, HUD labels, crosshair size, mouse sensitivity, mute, longer glyph glow |
| **Export data** | Backup `.xlsx` without ending session |
| **Restart block** | Discard current block rows and replay that block |
| **Back to title** | Abandon session data (confirm first) |

If possible, pause between paintings rather than during an unanswered scored trial. Pause time is excluded from RT.

### 8.3 Block 1 complete → Block 2

1. Block 1 **results / break screen** appears (accuracy, RT, hits, misses, etc.).
2. The screen shows the **next block rule** (e.g. 3-back wording) in the break panel.
3. Click **CONTINUE TO BLOCK 2**.
4. The participant enters the **block 2 corridor directly**. There is **no second full-screen instruction overlay**; the break screen already showed the rule.
5. Block 2 runs the same way: **70 paintings**, first **N** observe, then scored through painting 70.

### 8.4 Session complete

After block 2, the **session complete** screen appears. Do not close or reload the browser until data are exported successfully.

## 9. Exporting and Checking Data

1. Click `SAVE & NEXT PARTICIPANT` after both blocks are complete.
   - This exports the workbook and resets the app for the next participant.
   - Use `EXPORT DATA` instead if you want a backup copy without resetting the session.

2. Confirm the `.xlsx` file appears in the download folder.
   - Expected filename pattern:

     ```text
     glyphmind_PARTICIPANTID_CONDITION_PHASE_n1+3_YYYY-MM-DD.xlsx
     ```

     or

     ```text
     glyphmind_PARTICIPANTID_CONDITION_PHASE_n3+1_YYYY-MM-DD.xlsx
     ```

3. Rename or move the file according to lab convention.
   - Recommended format:

     ```text
     BSVG_SESSION#_PARTICIPANTID_GLYPHMIND_CONDITION_PHASE.xlsx
     ```

4. Open the workbook or check it using the lab QC procedure.
   - The `Trials` sheet should contain **140 rows** for a complete two-block run.
   - Each block should contain **70 rows** (one per painting).
   - Warmup rows: **`trialType = warmup`**, count = **N** per block.
   - Scored rows: **`trialType = scored`**, count = **70 − N** per block.
   - The `Meta` sheet should show `paintingsPerBlock = 70`.
   - The `Meta` sheet should show `matchPaintingsPerBlock = 30`.
   - The `Meta` sheet should show `nonMatchPaintingsPerBlock = 40`.
   - Each block should have a **`sequenceSeed`** recorded.
   - Scored rows should have **`Resp`**, **`ACC`**, and **`RT`** filled (no pending rows on a complete session export).

5. Optional automated QC (from the GLYPHMIND folder):

   ```bash
   node scripts/audit-export.mjs path/to/glyphmind_....xlsx --strict
   ```

   This verifies row counts, N-back ground truth, Meta consistency, and that each **`sequenceSeed`** reproduces the logged glyph sequence. Expect: `All export checks passed.`

6. Record any irregularities.
   - Examples: participant stopped early, browser was paused, stimulation stopped early, participant reported discomfort, task was restarted, or data was exported partially.

## 10. After the Participant Finishes

1. If tDCS was used, remove electrodes and complete skin/site checks according to the approved protocol.
2. Provide paper towel or cleanup materials as described in the protocol.
3. For Sessions 1 and 2, schedule the next session before the participant leaves.
4. For Session 3, provide the debriefing materials according to the approved procedure.
5. File paperwork in the correct binder location.
6. Keep consent forms separate from participant data and do not write the participant ID on the consent form.
7. Move the exported GLYPHMIND data file to the correct data folder.
8. Confirm the computer is ready for the next participant.

## 11. Troubleshooting

If the page is blank or the game does not load:

- Confirm the full folder is present.
- Confirm `lib/three.min.js` and `lib/xlsx.full.min.js` are present.
- Use the local server method instead of opening `index.html` directly.

If glyphs appear as boxes:

- Confirm the `fonts/` folder is present.
- Reload the page after confirming the fonts are available.

If the game will not export:

- Confirm `lib/xlsx.full.min.js` is present.
- Do not close the browser until export succeeds.
- Use `EXPORT DATA` from the pause or results screen if needed.

If the participant stops early:

- Export the partial data.
- Record the reason and stopping point in the session notes.
- Do not use `SAVE & NEXT PARTICIPANT` unless the export completes successfully.

If the participant is confused about responses:

- Pause the game.
- Restate the current block rule: 1-back compares to the previous painting; 3-back compares to three paintings back.
- Restate the controls: **left click = MATCH**, **right click = NO MATCH** (no keyboard response keys).
- Resume only after the participant understands the rule.

## 12. Current task design (staff reference)

These notes describe **what the shipped GLYPHMIND app does today**. They are not a list of future changes.

1. **No separate practice block.** The tutorial, block 1 instruction overlay, and in-corridor watch-only paintings serve as practice. There is no extra non-exported corridor before block 1.

2. **Observe-only paintings take no response.** The first N paintings in each block are watch-only. Do not instruct participants to click on those paintings. This differs from older N-back scripts that used a "no target" key on seed trials.

3. **Mouse-only responses on desktop.** Scored trials accept **left click** (MATCH) and **right click** (NO MATCH) only. Keys **F**, **Space**, and **J** do not register responses. Touch devices use on-screen MATCH / NO MATCH buttons instead.

4. **Block 2 instructions appear once.** After block 1, the break screen shows the next N-back rule. Continuing to block 2 skips the full-screen instruction overlay so the rule is not repeated. Block 1 always shows the overlay; **Restart block** shows it again for that block.

5. **70 paintings only.** Each block builds exactly 70 corridor panels and logs exactly 70 trial rows. Observe paintings are part of those 70, not an extra prefix.

6. **Match/non-match export accounting.** Every complete block logs 30 rows with `isMatchPainting = 1` and 40 with `isMatchPainting = 0`. Observe rows always have `isMatchPainting = 0`. Analyze scored trials with `trialType === "scored"` or `CRESP`.

7. **Audio.** The cutscene has no background music. Corridor feedback uses short SFX unless the participant enables **Mute sounds** in Accessibility.

8. **Condition labels in export.** The app records `anodal`, `cathodal`, or `sham` in the `Condition` column and export filename.

9. **tDCS setup** is not defined in this document. Follow the approved stimulation protocol separately from this game run guide.
