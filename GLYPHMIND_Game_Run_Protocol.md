# GLYPHMIND Game Task Run Protocol

This procedure describes how research staff should run the GLYPHMIND video-game N-back task within the BSVG/tDCS study protocol. It is written as an operator guide for the computer task only; all consent, eligibility screening, tDCS setup, stimulation safety checks, and debriefing must follow the approved IRB protocol and be performed by trained study personnel.

## 1. Purpose of the Game Task

GLYPHMIND is the video-game version of the working-memory N-back task. The participant walks through a first-person corridor and views a sequence of hieroglyph symbols, one symbol per painting. In each block, the participant compares the current symbol to a previous symbol in the same sequence:

- In the 1-back block, compare the current painting to the previous painting.
- In the 3-back block, compare the current painting to the painting three paintings earlier.
- If the symbols are the same, respond MATCH.
- If the symbols are different, respond NO MATCH.

Each complete block contains 70 paintings. The first N paintings are observe-only and do not require a response. The remaining paintings are scored. Each complete block is generated with exactly 30 matching paintings and 40 non-matching paintings in the exported sequence accounting. The app stores the randomization seed for each block in the exported workbook.

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
   - The title screen should show fields for participant ID, session ID, condition, phase, and block order.
   - The glyphs should display as symbols, not empty boxes.

4. Prepare the data folder.
   - Confirm that the previous participant's data file has already been renamed and moved.
   - Set or note the browser's download location.
   - Make sure exported files will not be confused with another participant's files.

## 4. When the Participant Arrives

1. Follow the approved protocol for greeting, belongings, seating, consent, questionnaires, and eligibility/safety screening.

2. Seat the participant at the computer.
   - Adjust chair, screen, keyboard, and mouse so the participant can comfortably see the screen and respond.
   - If the participant will use the mouse, make sure there is enough desk space.
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

4. Select Condition.
   - Select the option that best matches the approved stimulation/task condition.
   - If the study distinguishes anodal and cathodal stimulation but the app only shows a general `tDCS` option, record anodal/cathodal assignment in the study log and consider updating the app labels before formal data collection.

5. Select Phase.
   - Use `PRE` for a pre-stimulation/baseline run.
   - Use `DURING` for the N-back task performed during stimulation.
   - Use `POST` for a post-stimulation run.

6. Click `READY FOR PARTICIPANT`.

## 6. Participant Instructions Script

Read or paraphrase the following before the participant starts:

"In this task, you will move through a corridor and look at paintings on the wall. Each painting will reveal one symbol. Your job is to remember the symbols and decide whether each new symbol matches a symbol you saw earlier in the same block.

In a 1-back block, compare the current symbol to the symbol from the previous painting. In a 3-back block, compare the current symbol to the symbol from three paintings earlier. If the symbols are the same, choose MATCH. If they are different, choose NO MATCH.

The first painting in a 1-back block is watch-only. The first three paintings in a 3-back block are watch-only. For those paintings, just look at the symbol and remember it; do not press MATCH or NO MATCH yet.

The game will tell you which block you are in before it starts. Please read the instructions on the screen. On the keyboard, MATCH is F, Space, or left click. NO MATCH is J or right click. If you are using the on-screen controls, use the MATCH and NO MATCH buttons.

Try to respond as accurately as you can. Do you have any questions before we begin?"

Important: This script differs from the older standard N-back script. In GLYPHMIND, the observe-only paintings should not receive a response.

## 7. Starting the Game During a tDCS Session

If the task is being run during stimulation:

1. Start stimulation according to the approved tDCS protocol.
2. Have the participant sit calmly for the required pre-task stimulation period.
3. After the required wait period, ask the participant to begin the GLYPHMIND task.
4. Remain available nearby. If the protocol allows the researcher to leave the room during task performance, return promptly when the participant finishes or if they call for help.
5. Do not engage the participant in unrelated conversation or other cognitive tasks during stimulation.

For sham sessions, follow the approved sham procedure and maintain the same participant-facing routine as much as possible.

## 8. Running the GLYPHMIND Task

1. On the participant start screen, have the participant click `BEGIN`.

2. The intro/tutorial may appear.
   - The participant may read through it or skip it, depending on the approved study procedure.
   - The block instruction screen appears before each block and tells the participant whether the block is 1-back or 3-back.

3. At the block instruction screen, remind the participant:
   - First N paintings are watch-only.
   - After that, respond MATCH or NO MATCH.
   - The response rule changes depending on whether the block is 1-back or 3-back.

4. The participant enters the corridor.
   - They walk to each painting in order.
   - A glyph appears when they are close enough.
   - For observe-only paintings, they should look and continue.
   - For scored paintings, they must answer MATCH or NO MATCH before continuing with the task.

5. If the participant pauses or needs help:
   - Press `Esc` to pause.
   - Use `RESUME` to continue.
   - If a partial backup is needed, use `EXPORT DATA`.
   - If possible, pause between paintings rather than during an unanswered scored painting.

6. After Block 1 ends:
   - The results/break screen appears.
   - Click `CONTINUE TO BLOCK 2`.
   - The participant reads the next block's instructions.
   - Confirm that the participant understands whether the next block is 1-back or 3-back.

7. After Block 2 ends:
   - The session-complete screen appears.
   - Do not close or reload the browser before exporting the data.

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
   - The `Trials` sheet should contain 140 rows for a complete two-block run.
   - Each block should contain 70 rows.
   - The `Meta` sheet should show `paintingsPerBlock = 70`.
   - The `Meta` sheet should show `matchPaintingsPerBlock = 30`.
   - The `Meta` sheet should show `nonMatchPaintingsPerBlock = 40`.
   - Each block should have a `sequenceSeed` recorded.

5. Record any irregularities.
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
- Resume only after the participant understands the rule.

## 12. Items to Confirm Before Formal Data Collection

Before using this guide as the final lab SOP, confirm the following with the PI:

1. The current GLYPHMIND game uses tutorial/block instructions but does not include a separate practice run. The older protocol states that each condition has a practice run. Decide whether the tutorial is sufficient or whether a formal practice mode should be added.

2. The older N-back script tells participants to press `1` for the first symbols that do not have a comparison item. GLYPHMIND instead treats those as observe-only paintings with no response. The GLYPHMIND-specific script in this document should be used for the game task.

3. The source protocol contains stimulation-setting language that should be checked against the current approved device procedure before staff training. This game protocol intentionally does not modify tDCS setup instructions.

4. If the study must separately identify anodal vs cathodal conditions in the exported game file, the app condition labels or the session/file naming convention should be updated before data collection.
