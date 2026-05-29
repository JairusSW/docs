# Multiple Runtimes

A **mode** is a named execution context that overrides part of your config. Modes are how one suite runs against several runtimes — WASI, bindings, the browser, standalone engines — from a single command.

```bash
ast test --mode node:wasi,node:bindings,chromium:headless
```

Each named mode runs the selected specs with its own target and runtime, and the summary reports per mode.

## Defining modes

Add a `modes` map to `as-test.config.json`. Each entry overrides the base config — commonly the build target and the runtime command:

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "modes": {
    "node:wasi": {
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.wasi.js" } }
    },
    "node:bindings": {
      "buildOptions": { "target": "bindings" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.bindings.js" } }
    },
    "chromium:headless": {
      "default": false,
      "buildOptions": { "target": "web" },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.web.js --headless",
          "browser": "chromium"
        }
      }
    }
  }
}
```

A mode can override any top-level field: `input`, `output`, `coverage`, `features`, `fuzz`, `buildOptions`, `runOptions`, and `env`. A mode value can also be a **string path** to an external config file instead of an inline object.

## Default vs. manual modes

`"default": false` makes a mode manual-only. On a bare `ast test` (no `--mode`), default-false modes are skipped; they still run when named explicitly:

```bash
ast test                      # default modes only
ast test --mode chromium:headless   # the manual mode, on demand
```

> When a config declares any modes, an implicit `ast test` runs **only those modes** — the unnamed base config is not added on top. With no modes declared, the base config runs by itself.

## Standalone WASI engines

Because WASI artifacts don't need host injection, the same `wasi` build runs on external engines. Point a mode's runtime at the engine binary with the `<file>` placeholder:

```json
{
  "modes": {
    "wasmtime": {
      "default": false,
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "wasmtime run <file>" } }
    },
    "wasmer": {
      "default": false,
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "wasmer run <file>" } }
    },
    "wazero": {
      "default": false,
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "wazero run <file>" } }
    }
  }
}
```

Standalone engines can't be handed host modules, so specs that retain a real `@external` import (via [`unmockImport`](../mocking/import-mocks#runtime-support)) can't run on them — exclude those specs from the mode's `input`.

## Per-mode specs and exclusions

A mode can narrow or change which specs it runs. This is how you keep a suite green across runtimes with different capabilities:

```json
{
  "modes": {
    "node:bindings:esm": {
      "default": false,
      "buildOptions": { "target": "bindings", "args": ["--bindings esm"] },
      "input": ["assembly/__tests__/**/*.spec.ts", "!**/unmock.spec.ts"]
    }
  }
}
```

## Output namespacing

When several modes are active, output paths are namespaced by mode (e.g. `.as-test/build/<mode>/…`) so artifacts don't collide. `ast clean` cleans every configured mode when `--mode` is omitted, regardless of `default: false`.

## Related

- [Targets & Runtimes](./) — what each target builds for.
- [Bindings: raw & esm](./bindings) — the two bindings styles.
- [Configuration → modes](../configuration#modes) — the full field reference.
- [Multi-Mode Config recipe](../examples/multi-mode-config) — a complete example.
