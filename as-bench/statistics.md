# Statistics & Output

`as-bench` doesn't just time a loop and divide. Each bench goes through the same Criterion-style pipeline — adaptive warmup, a sampling plan, then a bootstrap analysis — so the numbers come with confidence intervals and an honest read on noise.

## The measurement pipeline

1. **Warmup.** The routine runs in doubling batches until the per-iteration mean (`met`) stabilizes within `warmupTolerance`, or `warmupTime` is reached. Warmup lets the JIT/runtime settle and produces the `met` estimate that sizes everything downstream.
2. **Sampling plan.** From `met` the engine picks how many samples to collect and how many iterations each sample runs, aiming to fill `measurementTime`. With `sampleSize: 0` (the default) the sample count auto-sizes so each sample represents ~10 ms of work, clamped to `[10, 500]`.
3. **Timed samples.** Each sample times a batch of iterations; the per-iteration time is the sample's value.
4. **Bootstrap analysis.** The sample set is resampled `numResamples` times to build confidence intervals for the point estimate, and to classify outliers.

## Warmup tuning

| Setting | Effect |
| --- | --- |
| `warmupTime` | Upper bound on warmup (ms). |
| `warmupMinTime` | Earliest warmup may be judged stable. |
| `warmupTolerance` | Relative `met` drift treated as "stable". `0` disables early exit — warmup always runs the full `warmupTime`. |

Adaptive warmup (`warmupTolerance > 0`) exits as soon as two consecutive batches agree, so fast, stable benches don't waste the full window. Set `warmupTolerance: 0` for a fixed-time warmup when you want every run identical.

## Sampling modes

| Mode | Behavior |
| --- | --- |
| `Auto` | The engine chooses linear or flat based on `met` and the target window. |
| `Linear` | Each sample runs an increasing number of iterations; the estimate comes from a regression slope through the origin. |
| `Flat` | Every sample runs the same iteration count. |

If a configuration can't fit the requested samples into `measurementTime`, the run prints a warning recommending a larger `--measure` or a smaller `--samples`.

## Reading the output

A standalone bench renders as a card:

```text
fib(20)
───────

time:     46.23 µs [46.17, 46.36]
ops/s:    21,629
samples:  10
```

- **time** — the point estimate with its `[lower, upper]` confidence interval (default 95%).
- **ops/s** — operations per second (`M`/`G` SI prefixes above 1e6).
- **samples** — how many samples the plan collected.
- **thrpt** — appears when you pass `elementsPerCall` to `bench()`.
- **outliers** — appears only when a bench actually had any.

## Suites and deltas

Benches inside a `suite()` stream into one aligned table. The first bench is the baseline; the rest show a `vs baseline` multiplier:

```text
fib
───

baseline: fib(15)

benchmark   time                   ops/s     vs baseline
─────────   ────────────────────   ───────   ───────────
fib(15)     4.15 µs [4.14, 4.15]   241,219   1.00×
fib(20)     45.97 µs [...]          21,753   11.06× slower
```

The verdict follows Criterion's rule: a change is "no change" when it is **not statistically significant** *or* when the entire confidence interval lies inside the noise band. A green `× faster` / red `× slower` only appears when the change clears both bars.

## Outliers

Samples are classified with Tukey fences (low/high, mild/severe). The outlier section is shown only when something was actually flagged:

```text
outliers:
  parse Player   2 / 25
```

Outliers don't corrupt the estimate — the bootstrap already accounts for the spread — but a high count is a hint that the bench (or the machine) is noisy.

## Significance & noise

Two render thresholds control the verdicts; set them in [config](./configuration#render) under `render`:

| Threshold | Default | Meaning |
| --- | --- | --- |
| `significanceLevel` | `0.05` | p-value below which a change is "significant". |
| `noiseThreshold` | `0.01` | Changes whose CI lies within ±this are reported as "no change". |

## JSON output

`asb run --json` suppresses the human output and writes one machine-readable document to stdout — point estimates, CIs, deltas with p-values and verdicts, and outlier counts. Times are in milliseconds. See the [CLI reference](./cli#json-output).

## Next

- [Baselines](./baselines) — turn a run into a comparison point.
- [Configuration](./configuration) — every tunable.
