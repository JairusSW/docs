# as-bench

`as-bench` is a runtime-agnostic, statistically-aware benchmarking framework for AssemblyScript.

You write benchmarks once, then run them on the runtime you actually ship to — Node, a standalone WASI runtime like `wasmtime`, `wasmer`, or `wazero` — and get Criterion-style timing with confidence intervals, outlier classification, and baseline comparisons. Your bench file is compiled together with a statistics engine and executed inside WebAssembly, so what you measure is what runs.

It ships as a CLI (`asb` / `as-bench`) and an npm dev dependency. The statistics engine runs entirely inside wasm — the host only supplies a clock, settings, and the reporting channel.

## What you get

- **Benchmarks** in `assembly/__benches__/**/*.ts` with `bench()`, `suite()`, and `blackbox()`.
- **Real statistics** — adaptive warmup, an auto-sized sampling plan, bootstrap confidence intervals, and Tukey outlier classification, ported from [as-tral](https://github.com/romdotdog/as-tral) / [Criterion.rs](https://github.com/bheisler/criterion.rs).
- **Suite deltas** — each bench after the first reports its change versus the suite baseline, with a permutation-test verdict.
- **Baselines** — save a run, compare against it later, or diff two saved runs in CI.
- **Profiling** — per-function instruction counts, wall-clock self time, or allocation bytes, all from one `profile` command.
- **Any runtime** — external WASI runtimes stream results over a framed binary protocol (WIPC); compare several runtimes in one table.

## Start here

1. [Getting Started](./getting-started) — install, scaffold, and run your first bench.
2. [Writing Benchmarks](./writing-benchmarks) — `bench`, `suite`, `blackbox`, throughput, and charts.
3. [Statistics & Output](./statistics) — how the numbers are produced and how to read them.
4. [Baselines](./baselines) — save and compare runs.
5. [Profiling](./profiling/) — find where the time, instructions, or bytes go.
6. [Runtimes & Modes](./runtimes/) — run the same benches across runtimes.
7. [CLI](./cli) and [Configuration](./configuration) — once the defaults stop being enough.

## Project layout

A typical project looks like this:

```text
assembly/
  __benches__/
    example.ts
.as-bench/
  build/        compiled wasm artifacts
  baselines/    saved baselines (commit these)
  charts/       generated SVG charts
as-bench.config.json
```

If you also need fast JSON for the data structures you benchmark, see [json-as](/json-as/).
