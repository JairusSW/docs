# Performance

`str` exists to delete allocations. A view-producing op (`slice`, `trim`,
`substring`, …) is a couple of pointer moves and **one** small object — versus
native `String`, which allocates a new string and copies the bytes every time.
The scanning ops add SWAR/SIMD kernels, and `replace` / `padStart` / `padEnd`
are built directly from the view in a single pass.

> Figures are microbenchmarks via [`as-bench`](https://github.com/JairusSW/as-bench),
> all over one ~2 kb string, on wasmtime. Reproduce with `npm run charts:build`.

## Per-Operation Speedup

Every native `String` operation vs its `str` counterpart — native (red) is
the `1×` baseline, `str` (blue) its speedup:

![Every String operation vs its str counterpart](https://raw.githubusercontent.com/JairusSW/as-str/refs/heads/docs/charts/v0.1.0/per-op-speedup.svg)

| Operation              | vs native `String`           |
| ---------------------- | ---------------------------- |
| `replace`              | ~12× faster                  |
| `indexOf` / `includes` | ~8.5× faster                 |
| `replaceAll`           | ~3.7× faster                 |
| `lastIndexOf`          | ~2.6× faster                 |
| `padStart` / `padEnd`  | ~1.9× faster                 |
| `trim` / `trimStart`   | ~1.4–1.5× faster             |
| `slice` / `substring`  | ~parity (no copy)            |
| `toUpperCase` / `toLowerCase` | ~parity (defers to native) |

View ops sit at parity on a tiny slice — the avoided copy is cheap there — and
pull ahead as the slice grows, since `str` never copies. `replace` /
`replaceAll` are also **correct** where this `asc` version's native
`String#replaceAll` corrupts longer replacements; str fuzzes them against a
trusted reference instead.

## Throughput

Native vs `str` SWAR vs `str` SIMD, in millions of ops/sec:

![String operation throughput: native vs SWAR vs SIMD](https://raw.githubusercontent.com/JairusSW/as-str/refs/heads/docs/charts/v0.1.0/throughput.svg)

## SWAR and SIMD

The scanning hot paths — `indexOf`, `includes`, `lastIndexOf`, and `compare` —
are accelerated in three tiers, chosen at **compile time**:

- **SIMD** — 8 code units per step via `v128`, used when `--enable simd` is set
  (`ASC_FEATURE_SIMD`).
- **SWAR** — *SIMD-Within-A-Register*: 4 code units per step with ordinary `u64`
  math (a Mycroft zero-detect for the unit search). The default when SIMD is
  off.
- **scalar** — handles the short sub-block tail.

When SIMD is off the entire `v128` branch is dead-code-eliminated, and vice
versa, so you only pay for the tier you build. Wide loads are always bounded by
the remaining length, so they never read past the backing string — no scratch
padding is needed.

Copies and equality checks use the same idea: `copyBytes` and `equalsBytes` run
a size-tiered manual loop (v128 / u64 / scalar tail) that beats the bulk-memory
intrinsics on small/medium ranges, and fall back to `memory.copy` /
`memory.compare` on large ones.

## Running benchmarks locally

```bash
npm run bench         # microbenchmarks (as-bench)
npm run charts:build  # bench both builds and render charts to build/charts/
npm run charts        # build and serve the charts locally
```

Both the SIMD and SWAR builds are covered by the test suite (run under two
`as-test` modes) and by differential fuzzing against the native `String`
methods, so the accelerated paths stay byte-exact with the standard library.
