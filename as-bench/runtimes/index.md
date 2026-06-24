# Runtimes

A benchmark number is only meaningful next to the runtime it was measured on. `as-bench` runs the same bench file on Node or any external WASI runtime, so you can measure on what you actually ship to.

```bash
asb run                      # node (default)
asb run --runtime wasmtime   # pure-WASI build under wasmtime
asb run --runtime wasmer
asb run --runtime wazero
```

## How external runtimes work

The default `node` host imports a clock and reporting callbacks directly. External runtimes can't, so for them `as-bench` compiles a **pure-WASI build**: the module's only imports are `wasi_snapshot_preview1`, and it streams every engine event as framed binary messages over stdout (WIPC), which the CLI parses and feeds to the same renderer. Any WASI runtime can run it.

- Settings reach the guest as `AS_BENCH_TUNE_*` environment variables.
- Non-frame stdout (your `console.log`) passes straight through.
- `--save-baseline` works on external runtimes; `--baseline` comparison and `--deterministic` are **node-host only** (they need request/reply).

## Custom runtime commands

For anything beyond the three shorthands, give a command template — on the CLI or in config:

```bash
asb run --runtime "wazero run <env:-env> <file>"
```

| Placeholder | Expands to |
| --- | --- |
| `<file>` | the bench wasm path (appended as the last arg if you omit it) |
| `<env:PREFIX>` | the `AS_BENCH_TUNE_*` pairs as runtime env flags; a trailing `=` fuses them (`<env:--env=>` → `--env=K=V`) |

The same shape is available as `runOptions.runtime.cmd` in [config](../configuration#runoptions). Command parsing is quote-aware.

## Pages

- [Multiple Runtimes & Modes](./multiple-runtimes) — compare runtimes in one table.
- [Deterministic Mode](./deterministic) — neutralize host nondeterminism.
