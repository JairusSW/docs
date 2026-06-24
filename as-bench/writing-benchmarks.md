# Writing Benchmarks

A bench file imports from `as-bench/assembly/index` and declares benchmarks at the top level. The file runs at module start — `bench()` measures immediately, and there is no separate `run()` entry point.

```ts
import { bench, suite, blackbox, settings } from "as-bench/assembly/index";
```

## `bench`

```ts
bench(description: string, routine: () => void, elementsPerCall?: f64): void
```

Measures `routine`: warmup → sampling plan → timed samples → bootstrap analysis. The closure should do exactly the work you want timed and nothing else — allocate fixtures outside it.

```ts
bench("parse small doc", () => {
  blackbox(JSON.parse<Doc>(input));
});
```

Pass `elementsPerCall` to also report throughput (elements or bytes per second). If your routine processes 1024 bytes, pass `1024`:

```ts
bench("decode frame", () => {
  blackbox(decode(frame));
}, frame.length); // adds a thrpt line in elem/s
```

## `suite`

```ts
suite(description: string, body: () => void): SuiteHandle
```

Groups related benchmarks. The **first** `bench()` in the body is the baseline; every later one additionally reports its change versus that baseline — a bootstrap confidence interval on the mean ratio plus a permutation-test p-value.

```ts
suite("sort 1k i32", () => {
  bench("insertion", () => blackbox(insertionSort(data())));
  bench("quick",     () => blackbox(quickSort(data())));
  bench("std",       () => blackbox(data().sort()));
});
```

Suite results print as an aligned table with a `vs baseline` column. See [Statistics & Output](./statistics#suites-and-deltas).

### Charts

`suite()` returns a `SuiteHandle` you can chain `.chart()` on. An SVG is always written to `.as-bench/charts/<suite>.svg`; pass `show: true` to also print an ASCII chart in the terminal.

```ts
suite("sort 1k i32", () => {
  /* ... */
}).chart({ type: "bar", scale: "linear", show: true });
```

| Option | Values | Default | Effect |
| --- | --- | --- | --- |
| `type` | `"bar"` \| `"histogram"` | `"bar"` | Horizontal bars or vertical columns. |
| `scale` | `"linear"` \| `"log2"` | `"linear"` | Axis scaling. |
| `show` | `boolean` | `false` | Print the ASCII chart (SVG is always saved). |

## `blackbox`

```ts
blackbox<T>(value: T): T
```

An opaque identity barrier. It stores `value` through linear memory and reads it back, so the optimizer cannot prove the result is unused and delete the computation. Wrap **both** the inputs and the result of timed work:

```ts
bench("fib(20)", () => {
  blackbox<i32>(fib(blackbox<i32>(20)));
});
```

If a bench reports a suspiciously flat `0 ns` or trips the "optimized away" warning, a missing `blackbox` is the usual cause.

## `settings`

Mutate `settings` **before the first `bench()`** to change the engine defaults for the file. The CLI can override any of these per run (e.g. `--samples 50`); see [Configuration](./configuration).

```ts
settings.warmupTime = 500;        // ms
settings.measurementTime = 1000;  // ms
```

| Field | Default | Description |
| --- | --- | --- |
| `warmupTime` | `3000` | Warmup time cap in ms (adaptive exit may be earlier). |
| `warmupMinTime` | `100` | Minimum warmup time before stability is judged. |
| `warmupTolerance` | `0.02` | Relative drift considered stable; `0` = fixed-time warmup. |
| `measurementTime` | `3000` | Target measurement window in ms. |
| `sampleSize` | `0` | Samples per bench; `0` auto-sizes from warmup to ~10 ms/sample (clamped to [10, 500]). |
| `numResamples` | `100000` | Bootstrap resamples for confidence intervals. |
| `samplingMode` | `Auto` | `Auto` \| `Linear` \| `Flat`. |
| `confidenceLevel` | `0.95` | Confidence-interval level. |

See [Statistics & Output](./statistics) for what each setting actually controls.

## Next

- [Statistics & Output](./statistics) — how the numbers are produced.
- [Baselines](./baselines) — compare runs over time.
- [Profiling](./profiling/) — drill into where the cost is.
