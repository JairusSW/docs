# CLI

The binary is available as both `asb` and `as-bench`. Use `npx asb <command>` (or add scripts to `package.json`).

```bash
asb --version
asb --help
```

## Commands

| Command | Purpose |
| --- | --- |
| `asb run` | Build, then run benchmarks with full statistical analysis. The everyday command. |
| `asb build` | Compile benchmarks to wasm without running. |
| `asb profile` | Per-function work profile (instructions, time, or allocations). |
| `asb watch` | Rebuild and rerun on source change. |
| `asb compare` | Diff two saved baselines without re-running. |
| `asb init` | Scaffold config and an example bench. |
| `asb doctor` | Validate config, dependencies, input globs, and runtimes. |
| `asb clean` | Remove generated build/chart outputs. |

`run`, `build`, `profile`, `watch`, `compare`, `doctor`, and `clean` accept `--config <path>` and `--mode <name>`. See [Configuration](./configuration).

## `asb run`

```bash
asb run                              # all files from config input globs
asb run assembly/__benches__/my.ts   # a specific file
asb run --mode quick                 # apply a named overlay
asb run --filter "fib*"              # only benches whose name matches
asb run --json                       # machine-readable JSON to stdout
asb run --verbose                    # print every estimate
```

**Timing flags** (override config `settings.*`):

| Flag | Effect |
| --- | --- |
| `--warmup <ms>` | Warmup time cap. |
| `--warmup-tolerance <x>` | Stable-met drift threshold (`0` = fixed-time). |
| `--warmup-min <ms>` | Minimum warmup time. |
| `--measure <ms>` | Measurement window. |
| `--samples <n>` | Sample count (≥ 10). |
| `--resamples <n>` | Bootstrap resamples. |
| `--sampling auto\|linear\|flat` | Sampling strategy. |
| `--confidence <x>` | Confidence level, in (0, 1). |

Numeric flags are validated against the same bounds as the config file — out-of-range values are rejected rather than silently producing garbage.

**Baseline flags:**

| Flag | Effect |
| --- | --- |
| `--save-baseline <id>` | Save this run's raw samples as `<id>`. |
| `--baseline <id>` | Compare each bench against a saved baseline (node host only). |

See [Baselines](./baselines).

**Runtime flags:**

| Flag | Effect |
| --- | --- |
| `--runtime <r>` | `node` (default), `wasmtime`, `wasmer`, `wazero`, or a command template. Repeat to compare. |
| `--deterministic` | Record host imports once, replay them every later iteration (node host only). |

See [Runtimes](./runtimes/).

**Other:**

| Flag | Effect |
| --- | --- |
| `--filter <pattern>` | Run only benches whose name matches (substring or `*` glob; repeatable). |
| `--json` | Machine-readable JSON to stdout; suppresses human output. |
| `--verbose`, `-V` | Print all estimates (mean / median / std dev / MAD / slope). |

## `asb build`

```bash
asb build                            # compile all input files
asb build --runtime wasmtime         # also emit the pure-WASI WIPC build
```

Accepts build-selection flags only — no statistical or runtime execution.

## `asb profile`

```bash
asb profile            # --instr (default)
asb profile --time
asb profile --alloc    # alias: --heap
```

| Flag | Effect |
| --- | --- |
| `--instr` | Cost-weighted instruction count (default; exact, deterministic). |
| `--time` | Wall-clock self time (overhead-corrected; node host only). |
| `--alloc`, `--heap` | Bytes allocated (exact, deterministic). |
| `--top <n>` | Rows per bench (default `10`). |
| `--all` | Include engine/runtime-internal rows. |
| `--iters <n>` | (`--time` / `--alloc`) iterations per bench. |
| `--min-instrs <w>` | (`--time`) don't wrap functions under `w` static instructions. |

The legacy `--heaviest=instr|time|alloc` forms still work. See [Profiling](./profiling/).

## `asb watch`

```bash
asb watch
asb watch --filter "fib*" --mode quick
```

Accepts all `asb run` flags. Re-runs on source change, separating runs with a `---` line.

## `asb compare`

```bash
asb compare main dev
asb compare main dev --mode quick
```

| Flag | Effect |
| --- | --- |
| `--significance <x>` | p-value threshold for "changed" (default `0.05`). |
| `--noise <x>` | Ignore changes within ±x (default `0.01`). |
| `--config <path>` / `--mode <name>` | Config / overlay selection. |

See [Baselines](./baselines#diff-two-saved-baselines).

## `asb init`

```bash
asb init
asb init --yes --install
asb init ./bench-project
```

| Flag | Effect |
| --- | --- |
| `--dir <path>` | Target directory (also positional). |
| `--install` | Run install after scaffolding. |
| `--yes`, `-y` | Accept defaults; no prompts. |
| `--force` | Overwrite managed files. |

## `asb doctor`

Validates config loading, Node/dependency setup, bench-file discovery, and the selected runtime commands. See [Doctor](./doctor).

## `asb clean`

```bash
asb clean                # build/chart outputs; baselines preserved
asb clean --baselines    # also remove saved baselines  (alias: --all)
```

## JSON output

`asb run --json` writes one JSON document to stdout (all human output suppressed):

```json
{
  "version": 1,
  "benches": [
    {
      "file": "assembly/__benches__/example.ts",
      "runtime": "node",
      "suite": null,
      "name": "fib(20)",
      "result": { "lb": 1.23e-3, "point": 1.30e-3, "hb": 1.37e-3 },
      "delta": { "lb": -0.02, "point": 0.015, "hb": 0.05, "pValue": 0.32, "verdict": "no change", "vs": "baseline 'main'" },
      "outliers": { "lowSevere": 0, "lowMild": 0, "highMild": 2, "highSevere": 0 },
      "warnings": []
    }
  ]
}
```

Times are in milliseconds.
