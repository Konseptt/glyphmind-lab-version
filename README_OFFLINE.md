# GLYPHMIND — Fully offline / zero setup

**No internet at runtime**, **no npm**, **no build step.** Copy this folder, keep paths intact, open **`index.html`** in a modern browser.

Required beside **`index.html`**:

- **`lib/`** — `three.min.js`, `xlsx.full.min.js`
- **`fonts/`** — Cinzel + Noto Egyptian Hieroglyphs (see **`fonts/FONT_NOTICE.txt`**)

## Folder layout

```
├── index.html
├── lib/
│   ├── three.min.js
│   └── xlsx.full.min.js
├── fonts/
├── scripts/
│   └── verify-logic.mjs   ← optional sequence smoke test
└── README.md
```

## Browser

Chrome, Firefox, Safari, or Edge (current). Not IE / Legacy Edge.

## Running

1. Double-click **`index.html`** (`file://…`), or
2. `python3 -m http.server 8080` → `http://localhost:8080`

## Per-participant workflow

1. **Researcher setup:** Participant ID (required), session, condition, phase, block order (1→3 or 3→1).
2. **Ready for participant** → participant **BEGIN** (cutscene / tutorial / block instructions).
3. After **both blocks:** **Save & next participant** exports one `.xlsx` (all trial rows), clears PID, returns to setup for the next person.

**Export data** saves a copy without clearing the session (useful as backup mid-session).

## Two blocks, one participant

| Block | N-back | Paintings | Scored responses |
|-------|--------|-----------|------------------|
| 1 | First in order (e.g. 1) | 70 | 70 − N |
| 2 | Second (e.g. 3) | 70 | 70 − N |

Between blocks: break screen with preview → **Continue to block 2** → full instructions overlay → corridor.

**PID / Session / Condition / Phase** stay the same until **Save & next participant**.

Example filename: `glyphmind_P001_tDCS_pre_n1+3_2026-05-29.xlsx`

## Workbook

| Sheet | Contents |
|-------|-----------|
| **Trials** | All rows (warmup + scored) |
| **Meta** | Timestamps, design notes, block order, row counts |

### Rows per block

**70 rows** per block (one per painting): includes **N** `warmup` (observe) rows and **70 − N** `scored` rows.

### Key columns

`PID`, `Session`, `Condition`, `Phase`, `sessionStartISO`, `exportedAt`, `block`, `N`, `sequenceSeed`, `isMatchPainting`, `trialType`, `painting`, `warmupIndex`, `trial`, `tc`, `CRESP`, `Resp`, `ACC`, `RT`, `RSI`, `rsiAnchor`, trigger and stimulus/target fields.

- **`trial`** / **`painting`:** 1–70 per block.
- **`sequenceSeed`:** per-block seed used to replay the randomized glyph sequence.
- **`isMatchPainting`:** 30 rows are `1`; 40 rows are `0` per complete block. Observe-only rows are `0`.
- **`trialType`:** `warmup` or `scored`.
- Scored rows only: `Resp`, `ACC`, `RT`, `tc`, `CRESP`.

## Data-loss safeguards

- Browser warns on reload/close while trial data is still in memory.
- If you reload anyway, a banner may note possible lost data.
- Use **Export** or **Save & next participant** before closing the tab or starting a new PID.

## Smoke test

1. Page loads; title glyphs visible (not empty boxes).
2. PID **TEST**, complete both blocks (or one for a quick check).
3. Export: **Trials** has 70 rows per block; **Meta** shows `paintingsPerBlock = 70`, `matchPaintingsPerBlock = 30`, and `nonMatchPaintingsPerBlock = 40`.
4. Optional: `node scripts/verify-logic.mjs` → “All checks passed.”

## Downloads

Point the browser download folder at your study directory before collecting data.
