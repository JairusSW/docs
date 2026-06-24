# Getting Started

## Install

Add `as-bench` to an AssemblyScript project:

```bash
npm install --save-dev as-bench
# or: bun add -d as-bench
```

External WASI runtimes (`wasmtime`, `wasmer`, `wazero`) are optional — the default `node` host needs nothing extra. The pure-WASI build target additionally uses `@assemblyscript/wasi-shim`, which the scaffolder adds when needed.

## Scaffold a project

The fastest path is the initializer:

```bash
npx asb init
```

`asb init` can create:

- `as-bench.config.json` (with `quick` + `wasmtime` modes)
- a sample bench in `assembly/__benches__/`
- `package.json` bench scripts and the required dev dependencies

Useful flags:

| Flag | Effect |
| --- | --- |
| `--dir <path>` | Scaffold into a specific directory (also accepted positionally). |
| `--install` | Install dependencies after scaffolding. |
| `--yes`, `-y` | Accept defaults; no prompts. |
| `--force` | Overwrite managed files. |

```bash
npx asb init --yes --install
```

Then confirm your environment is wired up correctly:

```bash
npx asb doctor
```

## Your first benchmark

A benchmark is any file matched by `input` (default `assembly/__benches__/**/*.ts`). There is no `run()` — the file's top-level code *is* the run, and `bench()` drives the engine the moment it's called:

```ts
import { bench, blackbox } from "as-bench/assembly/index";

function fib(n: i32): i32 {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

bench("fib(20)", () => {
  blackbox<i32>(fib(blackbox<i32>(20)));
});
```

> `blackbox<T>(v)` forces the compiler to treat `v` as live. Without it the optimizer folds away the work you're trying to measure. See [Writing Benchmarks](./writing-benchmarks#blackbox).

## Run it

```bash
npx asb run                       # build + run every bench file
npx asb run --mode quick          # faster settings while iterating
npx asb run --filter "fib*"       # only benches whose name matches
npx asb run --watch               # re-run on change
```

`asb run` compiles each file with the AssemblyScript compiler (bundling the statistics engine), then executes the wasm through the configured runtime and renders the results. See the [CLI reference](./cli) for the full flag set and [Statistics & Output](./statistics) for how to read them.

## Minimal config

`asb init` writes this for you, but the whole thing fits in a few lines:

```json
{
  "$schema": "./node_modules/as-bench/as-bench.config.schema.json",
  "input": ["assembly/__benches__/**/*.ts"],
  "settings": {
    "warmupTime": 3000,
    "measurementTime": 3000
  }
}
```

## Next

- [Writing Benchmarks](./writing-benchmarks) — the full authoring surface.
- [Statistics & Output](./statistics) — what the numbers mean.
- [Baselines](./baselines) — track performance over time.
- [Configuration](./configuration) — every config field.
