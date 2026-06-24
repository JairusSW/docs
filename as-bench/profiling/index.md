# Profiling

`asb run` tells you *which* bench is slow. `asb profile` tells you *where* the cost is — per function, inside one bench. It builds a debug + instrumented wasm, runs each bench, and renders a ranked table.

```bash
asb profile                  # --instr (default)
asb profile --time           # wall-clock self time
asb profile --alloc          # bytes allocated  (alias: --heap)
```

## Three lenses

| Mode | Flag | Ranks by | Exact? |
| --- | --- | --- | --- |
| [Instructions](./instructions) | `--instr` (default) | cost-weighted wasm instructions | yes, deterministic |
| [Self time](./time) | `--time` | overhead-corrected wall-clock self time | measured |
| [Allocations](./allocations) | `--alloc` / `--heap` | bytes claimed from the allocator | yes, deterministic |

Reach for `--instr` when you want a stable, machine-independent ranking; `--time` when cache behavior matters and you want real nanoseconds; `--alloc` when you're chasing allocation pressure.

> The legacy `--heaviest=instr|time|alloc` forms are still accepted.

## Shared flags

| Flag | Effect |
| --- | --- |
| `--top <n>` | Rows per bench (default `10`). |
| `--all` | Include engine/runtime-internal rows (hidden by default). |
| `--iters <n>` | (`--time` / `--alloc`) iterations per bench. |
| `--min-instrs <w>` | (`--time`) don't wrap functions under `w` static instructions; their time folds into callers (default `4`). |

## Reading the table

By default each bench shows the rows that account for **≥ 1%** of total cost, capped at `--top`, followed by a coverage line:

```text
sort 1k i32/quick      274,696 weighted · 222,593 instructions
   49.5%   135,997 wt   116,095 instrs    3,317 calls   41 wt/call  StaticArray#__get
   31.8%    87,283 wt    63,349 instrs      361 calls  241 wt/call  quickSort
   16.3%    44,720 wt    38,480 instrs    1,040 calls   43 wt/call  StaticArray#__set
  top 3 rows account for 97.6% of total cost
  (+2 hidden rows, use --all to show)
```

Tiny profiles collapse to the few rows that matter; large ones shed their sub-1% tail. Pass `--all` to see everything, including runtime-internal functions.

## Pages

- [Instruction Counts](./instructions) — `--instr`
- [Self Time](./time) — `--time`
- [Allocations](./allocations) — `--alloc` / `--heap`
