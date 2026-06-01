/**
 * Offline checks for sequence + session helpers (mirrors index.html logic).
 * Run: node scripts/verify-logic.mjs
 */
const TOTAL_TRIALS = 70;
const MATCH_COUNT = 30;
const NON_MATCH_PAINTING_COUNT = TOTAL_TRIALS - MATCH_COUNT;
const N_GLYPHS = 12;

function hashSeed(seed) {
  const s = String(seed || "glyphmind");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0 || 0x6d2b79f5;
}

function rngFromSeed(seed) {
  let a = hashSeed(seed);
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(n, rng = Math.random) {
  return Math.floor(rng() * n);
}
function randPick(arr, rng = Math.random) {
  return arr[randInt(arr.length, rng)];
}
function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1, rng);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function scoredCountForN(N) {
  return TOTAL_TRIALS - N;
}
function scoredNonMatchCountForN(N) {
  return scoredCountForN(N) - MATCH_COUNT;
}
function pickNonMatchGlyph(refGlyph, rng = Math.random) {
  const pool = [];
  for (let g = 0; g < N_GLYPHS; g++) if (g !== refGlyph) pool.push(g);
  return randPick(pool, rng);
}
function countScoredMatches(seq, N) {
  let n = 0;
  for (let i = N; i < TOTAL_TRIALS; i++) {
    if (seq[i] === seq[i - N]) n++;
  }
  return n;
}
function countNonMatchPaintings(seq, N) {
  return TOTAL_TRIALS - countScoredMatches(seq, N);
}
function genSeqBlock(N, seed) {
  const rng = rngFromSeed(seed);
  for (let tryNum = 0; tryNum < 16; tryNum++) {
    const seq = new Array(TOTAL_TRIALS);
    const scoredN = scoredCountForN(N);
    for (let i = 0; i < N; i++) seq[i] = randInt(N_GLYPHS, rng);
    const isMatch = new Array(scoredN).fill(false);
    const matchable = [];
    for (let j = 0; j < scoredN; j++) matchable.push(j);
    shuffle(matchable, rng);
    const numMatches = Math.min(MATCH_COUNT, matchable.length);
    for (let i = 0; i < numMatches; i++) isMatch[matchable[i]] = true;
    for (let j = 0; j < scoredN; j++) {
      const i = N + j;
      const ref = seq[i - N];
      seq[i] = isMatch[j] ? ref : pickNonMatchGlyph(ref, rng);
    }
    for (let k = 0; k < 32; k++) {
      if (countScoredMatches(seq, N) === MATCH_COUNT) break;
      for (let j = 0; j < scoredN; j++) {
        const i = N + j;
        const ref = seq[i - N];
        if (isMatch[j]) seq[i] = ref;
        else seq[i] = pickNonMatchGlyph(ref, rng);
      }
    }
    if (countScoredMatches(seq, N) === MATCH_COUNT && seq.length === TOTAL_TRIALS) {
      return seq;
    }
  }
  throw new Error(`Could not build a valid ${N}-back sequence`);
}

function makeRecorder() {
  return {
    trials: [],
    block: 1,
    recordWarmup(o) {
      const painting = o.trialIdx + 1;
      this.trials.push({
        trialType: "warmup",
        block: this.block,
        N: o.n,
        painting,
        trial: painting,
        sequenceSeed: o.sequenceSeed,
        isMatchPainting: 0,
        Resp: "",
        ACC: "",
      });
    },
    record(o) {
      const painting = o.trialIdx + 1;
      const match = o.glyphIdx === o.nbackGlyphIdx;
      const cresp = match ? 1 : 2;
      const hasResponse = o.resp === 1 || o.resp === 2;
      const row = {
        trialType: "scored",
        block: this.block,
        N: o.n,
        painting,
        trial: painting,
        sequenceSeed: o.sequenceSeed,
        isMatchPainting: match ? 1 : 0,
        tc: cresp,
        CRESP: cresp,
        Resp: hasResponse ? o.resp : "",
        ACC: hasResponse ? (o.resp === cresp ? 1 : 0) : "",
        RT: hasResponse ? Math.round(o.rt || 0) : "",
      };
      const existingIdx = this.trials.findIndex((t) => {
        return t.block === this.block && t.trialType === "scored" && t.painting === painting;
      });
      if (existingIdx >= 0) this.trials[existingIdx] = row;
      else this.trials.push(row);
    },
    scoredTrials(block) {
      return this.trials.filter((t) => t.trialType === "scored" && (block == null || t.block === block));
    },
    respondedScoredTrials(block) {
      return this.scoredTrials(block).filter((t) => t.Resp === 1 || t.Resp === 2);
    },
    accuracy(block) {
      const rows = this.respondedScoredTrials(block);
      if (!rows.length) return 0;
      return (rows.filter((t) => t.ACC === 1).length / rows.length) * 100;
    },
  };
}

function hasCompleteBlock(recorder, block) {
  const rows = recorder.trials.filter((t) => t.block === block);
  if (rows.length !== TOTAL_TRIALS) return false;
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.painting)) return false;
    seen.add(row.painting);
    if (row.trialType === "scored" && row.Resp !== 1 && row.Resp !== 2) return false;
  }
  return seen.size === TOTAL_TRIALS;
}

function simulateBlock(recorder, N, seed) {
  const seq = genSeqBlock(N, seed);
  for (let i = 0; i < N; i++) {
    recorder.recordWarmup({ trialIdx: i, n: N, sequenceSeed: seed });
  }

  const firstScored = N;
  recorder.record({
    trialIdx: firstScored,
    n: N,
    glyphIdx: seq[firstScored],
    nbackGlyphIdx: seq[firstScored - N],
    sequenceSeed: seed,
  });
  ok(recorder.scoredTrials(recorder.block).length === 1, `N=${N} pending scored row is logged`);
  ok(recorder.respondedScoredTrials(recorder.block).length === 0, `N=${N} pending row is not answered`);
  ok(!hasCompleteBlock(recorder, recorder.block), `N=${N} pending row does not complete block`);

  for (let i = firstScored; i < TOTAL_TRIALS; i++) {
    if (i !== firstScored) {
      recorder.record({
        trialIdx: i,
        n: N,
        glyphIdx: seq[i],
        nbackGlyphIdx: seq[i - N],
        sequenceSeed: seed,
      });
    }
    const resp = seq[i] === seq[i - N] ? 1 : 2;
    recorder.record({
      trialIdx: i,
      n: N,
      glyphIdx: seq[i],
      nbackGlyphIdx: seq[i - N],
      resp,
      rt: 500 + i,
      sequenceSeed: seed,
    });
  }

  const blockRows = recorder.trials.filter((t) => t.block === recorder.block);
  ok(blockRows.length === TOTAL_TRIALS, `N=${N} one row per painting after updates`);
  ok(recorder.scoredTrials(recorder.block).length === scoredCountForN(N), `N=${N} scored row count`);
  ok(recorder.respondedScoredTrials(recorder.block).length === scoredCountForN(N), `N=${N} answered row count`);
  ok(hasCompleteBlock(recorder, recorder.block), `N=${N} complete block recognized`);
  ok(recorder.accuracy(recorder.block) === 100, `N=${N} accuracy ignores pending and counts answered`);
  ok(blockRows.filter((t) => t.isMatchPainting === 1).length === MATCH_COUNT, `N=${N} logged matches`);
  ok(
    blockRows.filter((t) => t.isMatchPainting === 0).length === NON_MATCH_PAINTING_COUNT,
    `N=${N} logged nonmatches`,
  );
}

let failed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  }
}

for (const N of [1, 3]) {
  for (let t = 0; t < 2000; t++) {
    const seed = `verify-n${N}-${t}`;
    const seq = genSeqBlock(N, seed);
    ok(seq.length === 70, `N=${N} length`);
    ok(countScoredMatches(seq, N) === 30, `N=${N} matches t=${t}`);
    ok(countNonMatchPaintings(seq, N) === 40, `N=${N} nonmatches t=${t}`);
    ok(scoredNonMatchCountForN(N) + N === NON_MATCH_PAINTING_COUNT, `N=${N} nonmatch accounting`);
    for (let i = 0; i < N; i++) {
      /* observe slots exist */
    }
    const scoredN = scoredCountForN(N);
    ok(scoredN + N === 70, `N=${N} observe+scored`);
    ok(
      JSON.stringify(seq) === JSON.stringify(genSeqBlock(N, seed)),
      `N=${N} deterministic replay t=${t}`,
    );
  }
  console.log(`N=${N}: 2000 sequences OK`);
}

const replayA = genSeqBlock(3, "fixed-seed-a");
const replayB = genSeqBlock(3, "fixed-seed-b");
ok(JSON.stringify(replayA) !== JSON.stringify(replayB), "different seeds should usually differ");

const recorder = makeRecorder();
simulateBlock(recorder, 1, "record-n1");
recorder.block = 2;
simulateBlock(recorder, 3, "record-n3");
ok(hasCompleteBlock(recorder, 1) && hasCompleteBlock(recorder, 2), "two complete blocks recognized");
ok(recorder.trials.length === 140, "two blocks log 140 rows");

console.log(failed ? `\n${failed} failure(s)` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
