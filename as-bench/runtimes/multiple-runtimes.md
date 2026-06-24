# Multiple Runtimes & Modes

## Comparison table

Pass `--runtime` more than once and every bench runs under each runtime, rendered as a comparison table normalized to the fastest:

```bash
asb run --runtime node --runtime wasmtime --runtime wasmer
```

```text
runtime comparison (point estimates, fastest = 1.00×)

fib(20)
  node      45.97 µs  1.00×
  wasmtime  61.40 µs  1.34×
  wasmer    63.10 µs  1.37×
```

The same effect is available in config via a `runOptions.runtime` list (see below), which is the better home for a comparison you run often.

> In `--json` mode the comparison table is suppressed — only the JSON document is written to stdout.

## Modes

A **mode** is a named partial-config overlay applied with `--mode <name>`. Objects merge one level deep; scalars and arrays replace. Precedence is:

```text
defaults < config < mode < CLI flags
```

```json
{
  "settings": { "warmupTime": 250, "measurementTime": 500 },
  "modes": {
    "full":      { "settings": { "warmupTime": 3000, "measurementTime": 5000 } },
    "wasmtime":  { "runtime": "wasmtime" },
    "compare":   {
      "runOptions": {
        "runtime": ["node", "wasmtime", "wasmer", { "cmd": "wazero run <env:-env> <file>", "name": "wazero" }]
      }
    }
  }
}
```

```bash
asb run --mode full       # criterion-style long run
asb run --mode compare    # node + wasmtime + wasmer + wazero, one table
```

A `runOptions.runtime` list mixes plain strings (a named runtime or a command template) and `{cmd, name}` objects. `--mode` works on `run`, `build`, `profile`, `watch`, `compare`, `doctor`, and `clean`.

## Next

- [Deterministic Mode](./deterministic) — when host nondeterminism muddies timing.
- [Configuration](../configuration) — the full `runOptions` shape.
