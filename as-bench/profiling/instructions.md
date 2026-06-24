# Instruction Counts (`--instr`)

```bash
asb profile            # --instr is the default
asb profile --instr
```

The default profiling mode. A Binaryen pass injects per-function call and executed-instruction counters at region granularity (function entry, loop bodies, if-arms), then the bench runs once. Counts are **exact and fully deterministic** — identical totals across runs, machines, and build flags — which makes this the right tool for comparing the effect of source or compile-flag changes.

## Weighted vs raw

Raw instruction counts treat every op as equal. That under-ranks expensive operations, so the table also shows a **weighted** cost from a static table:

| Op class | Weight |
| --- | --- |
| ALU / const / local | 1 |
| integer multiply | 3 |
| load / store | 3 / 2 |
| float arithmetic | 2 |
| call / indirect call | 5 / 8 |
| division / sqrt | 12–15 |
| float→int truncation | 3 |
| atomics | 10 |
| `memory.grow` | 100 |

Output columns: `% | weighted instrs | raw instrs | calls | wt/call | name`. The table ranks by weighted cost; both columns are shown.

```text
arith/divide-heavy     1,204 weighted · 612 instructions
   66.1%   796 wt   240 instrs   1 call   796 wt/call  divideLoop
   ...
```

## Why a static table, not measured times

Per-instruction times aren't additive under superscalar execution, and weights can't see cache behavior — a `load` is costed as an L1 hit. The table is deliberately a *ranking* heuristic, not a timing model. When you need real nanoseconds (including cache effects), use [`--time`](./time); when you need an exact, reproducible count, the raw column here is ground truth.

## Caveats

- Counts are exact, but the **weighted** column is a heuristic ranking, not a prediction of wall-clock time.
- Region attribution is approximate around early `return` / `br`: the region's cost is charged on entry, so an early exit can over-count. The raw counts remain deterministic.

## Next

- [Self Time](./time) — real wall-clock, cache-aware.
- [Allocations](./allocations) — bytes, not instructions.
