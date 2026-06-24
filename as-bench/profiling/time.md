# Self Time (`--time`)

```bash
asb profile --time
asb profile --time --iters 20
```

Per-function wall-clock self time, recursion-safe and overhead-corrected. Unlike [`--instr`](./instructions), this measures real nanoseconds — so it captures cache behavior and anything else that makes an instruction cost more than its static weight.

## How it works

A Binaryen pass outlines each function: the body moves to `<name>$tprof_inner` and a timing wrapper takes the original name, so direct calls, exports, and `call_indirect` element segments all flow through it.

- **Self time** = a frame's own duration minus its direct wrapped callees (the wrappers maintain a bookkeeping stack mirroring the real call stack).
- **Inclusive time** is gated to outermost frames, so recursive functions don't multi-count.
- **Overhead** (~2 clock reads + a frame per call) is measured per bench by an injected calibration routine and subtracted, split into per-own-call and per-child-call components.

## Flags

| Flag | Effect |
| --- | --- |
| `--iters <n>` | Iterations per bench in profile mode (default `10`). More iterations → steadier self times. |
| `--min-instrs <w>` | Don't wrap functions under `w` static instructions; their time folds into the caller's self time (default `4`). Reduces wrapper overhead on trivial helpers. |
| `--top <n>` / `--all` | As in every profile mode. |

## When to trust it

Trust self times **≥ ~1 µs/call**. Below that, the per-call overhead correction dominates the signal — use [`--instr`](./instructions), which is exact there. `--time` is the **node host only** (it uses `hrtime.bigint`).

```text
profile: assembly/__benches__/example.ts (wall-clock self time, overhead-corrected; 10 iterations per bench)
```

A memory-thrashing function will take a larger share of wall-clock than of instructions next to a tight compute loop — that divergence is exactly what this mode exists to surface.

## Next

- [Instruction Counts](./instructions) — exact, deterministic, machine-independent.
- [Allocations](./allocations) — bytes claimed from the allocator.
