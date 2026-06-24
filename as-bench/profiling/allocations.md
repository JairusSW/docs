# Allocations (`--alloc` / `--heap`)

```bash
asb profile --alloc
asb profile --heap     # alias for --alloc
```

Per-function allocation profiling — **exact and deterministic** (verified bit-identical across runs). It uses the same outlining wrapper as [`--time`](./time) but reads a monotone byte counter instead of a clock, so there's no calibration and no overhead distortion: a wrapper can't perturb a byte count.

## What it counts

The runtime's allocation chokepoint — the deepest layer that survives `-O` inlining (tlsf `allocateBlock`, falling back to `__alloc` then `__new`) — gets a prelude that bumps shared monotone byte/count globals. So managed `__new`, unmanaged `heap.alloc`, and realloc/renew moves are each counted **exactly once**.

Per function you get:

- **self bytes** — claimed in the function's own frame, minus wrapped callees.
- **incl bytes** — outermost-frame-gated inclusive bytes (recursion-safe).
- **allocs** — allocation count.
- **pages** — linear-memory page growth attributed to the live frame (via `memory.size()` as a monotone counter).

`~lib/rt/*` is never wrapped, so allocator and runtime-helper bytes charge the user-level caller.

## The summary line

Each bench prints a split:

```text
churn 64 × Array(16)   7.00 KiB allocated · 4.00 KiB managed (128 objs) · memory +1 pages (64.00 KiB)
```

- **managed (N objs)** — payloads via `__new`, including the 16 B object header.
- **unmanaged** — `heap.alloc` bytes, exact as requested.
- **N realloc(s) (X requested)** — move-based reallocs; in-place growth claims no new block and counts 0.
- **memory +P pages** — linear-memory growth for the bench window.

## Semantics to know

- It measures **allocation pressure** — bytes claimed from the allocator — not live or peak heap. GC frees don't subtract.
- Default **1 iteration** (use `--iters` for more); the counts are exact, so one run suffices.
- A bench whose module contains no allocator (the runtime was fully DCE'd) reports `0 B` with a note.

## Next

- [Self Time](./time) — where the nanoseconds go.
- [Instruction Counts](./instructions) — exact op counts.
