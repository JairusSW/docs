# Performance

`str` exists to delete allocations. A view-producing op (`slice`, `trim`,
`substring`, …) is a couple of pointer moves and **one** small object — versus
native operations that materialize a substring. Some native no-op operations
reuse their receiver, so allocation savings depend on the operation and input.
The scanning ops add SWAR/SIMD kernels, and `replace` / `padStart` / `padEnd`
are built directly from the view in a single pass.

Manual `str.slice(s, 1, 3)` allocates one wrapper;
`str.from(s).slice(1, 3)` allocates two. The `single` and `auto` transforms can
replace eligible intermediates with scalar values or packed spans, eliminating
those wrappers while retaining the backing storage. Splitting manually also
allocates an array and its element views.

> The charts and ratios below are historical **v0.1.0** microbenchmarks via
> [`as-bench`](https://github.com/JairusSW/as-bench), over one ~2 kb string on
> Wasmtime. They are not measurements of the current release or guarantees for
> other workloads. Regenerate with `npm run charts:build` for your environment.

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
can avoid larger copies as the slice grows. Correctness is checked separately
with differential tests and independent references; speedup does not establish
semantic equivalence.

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
npm run bench:runtime # equality, repeat, padding, search, and codepoint slices
npm run bench:payloads # parsing, search, normalization, and encoding workflows
npm run charts:build  # bench both builds and render charts to build/charts/
npm run charts        # build and serve the charts locally
```

Both the SIMD and SWAR builds are covered by the test suite (run under two
`as-test` modes) and by differential fuzzing against the native `String`
methods, so the accelerated paths stay byte-exact with the standard library.

## Comparing changes

Save a baseline, then compare after changing the implementation:

```bash
npm run bench:runtime -- --out build/runtime-baseline
npm run bench:runtime -- --baseline build/runtime-baseline

npm run bench:payloads -- --out build/payload-baseline
npm run bench:payloads -- --baseline build/payload-baseline \
  --corpus build/payload-baseline/corpus.json
```

The runtime comparison checks result checksums and records alternating-run
samples, build hashes, and runtime metadata. Payload records are checked against
an independent JavaScript reference in UTF-16 and UTF-8 modes. Reuse the saved
corpus so both revisions process the same inputs.

Results are written to `build/runtime-performance/` and
`build/payload-performance/`. Separate instrumented builds count allocation
blocks. These counts do not measure peak memory or RSS. Record compiler/runtime
versions, flags, hardware, power state, and concurrent load when publishing
timings; compilation time and Wasm execution time are separate measurements.
