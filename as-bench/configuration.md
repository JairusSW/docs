# Configuration

`as-bench.config.json` is auto-discovered in the current directory; point elsewhere with `--config <path>`. A JSON schema ships at `node_modules/as-bench/as-bench.config.schema.json` for editor autocomplete.

```json
{
  "$schema": "./node_modules/as-bench/as-bench.config.schema.json",
  "input": ["assembly/__benches__/**/*.ts"],
  "outDir": ".as-bench/build",
  "baselineDir": ".as-bench/baselines",
  "runtime": "node",
  "verbose": false,
  "deterministic": false,
  "settings": {
    "warmupTime": 3000,
    "measurementTime": 3000,
    "sampleSize": 0,
    "numResamples": 100000
  },
  "render": { "significanceLevel": 0.05, "noiseThreshold": 0.01 },
  "buildOptions": { "optimize": true, "debug": false, "args": [] },
  "profile": { "top": 10, "all": false, "iters": 10, "minInstrs": 4 },
  "modes": {
    "quick": { "settings": { "warmupTime": 250, "measurementTime": 500, "numResamples": 20000 } }
  }
}
```

Precedence: **defaults < config < mode < CLI flags**. See [Modes](./runtimes/multiple-runtimes#modes).

## Top-level keys

| Key | Type | Description |
| --- | --- | --- |
| `input` | `string[]` | Glob(s) for bench files (default `assembly/__benches__/**/*.ts`). |
| `outDir` | `string` | Build output directory. |
| `baselineDir` | `string` | Where `--save-baseline` writes and `--baseline` / `compare` read. |
| `runtime` | `string \| string[]` | Shorthand runtime(s); see `runOptions` for full control. |
| `verbose` | `boolean` | Print all estimates by default. |
| `deterministic` | `boolean` | Enable [deterministic mode](./runtimes/deterministic). |
| `settings` | object | Engine tunables (below). |
| `render` | object | Verdict thresholds (below). |
| `buildOptions` | object | Compiler options (below). |
| `profile` | object | Profiler defaults (below). |
| `runOptions` | object | Runtime command(s) (below). |
| `modes` | object | Named overlays applied with `--mode`. |

## `settings`

Engine tunables — every field maps to a `Settings` property and a `run` CLI flag.

| Field | Default | Bound |
| --- | --- | --- |
| `warmupTime` | `3000` | ≥ 0 |
| `warmupMinTime` | `100` | ≥ 0 |
| `warmupTolerance` | `0.02` | ≥ 0 |
| `measurementTime` | `3000` | ≥ 1 |
| `sampleSize` | `0` (auto) | ≥ 10 when set |
| `numResamples` | `100000` | ≥ 1 |
| `samplingMode` | `auto` | `auto` \| `linear` \| `flat` |
| `confidenceLevel` | `0.95` | (0, 1) |

`sampleSize: 0` auto-sizes from warmup to ~10 ms/sample, clamped to `[10, 500]`. See [Statistics & Output](./statistics).

## `render`

| Field | Default | Meaning |
| --- | --- | --- |
| `significanceLevel` | `0.05` | p-value below which a change counts as significant. |
| `noiseThreshold` | `0.01` | Changes whose CI lies within ±this read as "no change". |

## `buildOptions`

| Field | Default | Meaning |
| --- | --- | --- |
| `optimize` | `true` | Compile with optimizations. |
| `debug` | `false` | Keep debug info / the name section. |
| `args` | `[]` | Extra `asc` arguments (e.g. `["--transform", "json-as/transform"]`). |

## `profile`

| Field | Default | Meaning |
| --- | --- | --- |
| `top` | `10` | Rows per bench. |
| `all` | `false` | Include internal rows. |
| `iters` | `10` | Iterations per bench (`--time`). |
| `minInstrs` | `4` | Skip wrapping functions under this many static instructions (`--time`). |

## `runOptions`

For more than the top-level `runtime` shorthand, use `runOptions.runtime` with a `{cmd, name}` object or a list:

```json
{
  "runOptions": {
    "runtime": [
      "node",
      "wasmtime",
      { "cmd": "wazero run <env:-env> <file>", "name": "wazero" }
    ]
  }
}
```

- `<file>` → the bench wasm path (appended last if omitted).
- `<env:PREFIX>` → expands `AS_BENCH_TUNE_*` settings as runtime env flags; a trailing `=` fuses (`<env:--env=>` → `--env=K=V`).

A list runs every bench under each runtime, rendered as a [comparison table](./runtimes/multiple-runtimes#comparison-table).

## Modes

`modes` holds named partial configs applied with `--mode <name>`. Objects merge one level deep; scalars and arrays replace. A missing mode name errors with the list of available modes.

```json
{
  "modes": {
    "full": { "settings": { "warmupTime": 3000, "measurementTime": 5000 } },
    "wasmtime": { "runtime": "wasmtime" }
  }
}
```
