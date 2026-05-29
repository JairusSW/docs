# Multi-Mode Config

Run one suite across several runtimes by declaring [modes](../runtimes/multiple-runtimes). This config builds for WASI and Node bindings by default, and keeps a headless browser mode and an esm-bindings mode available on demand.

```json
{
  "$schema": "node_modules/as-test/as-test.config.schema.json",
  "input": ["assembly/__tests__/**/*.spec.ts"],
  "output": ".as-test/",
  "buildOptions": { "target": "wasi" },
  "runOptions": {
    "runtime": { "cmd": "node ./.as-test/runners/default.wasi.js" }
  },
  "modes": {
    "node:wasi": {
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.wasi.js" } }
    },
    "node:bindings": {
      "buildOptions": { "target": "bindings" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.bindings.js" } }
    },
    "node:bindings:esm": {
      "default": false,
      "buildOptions": { "target": "bindings", "args": ["--bindings esm"] },
      "input": ["assembly/__tests__/**/*.spec.ts", "!**/unmock.spec.ts"],
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

Run the defaults, or pick modes explicitly:

```bash
ast test                                       # default modes: node:wasi, node:bindings
ast test --mode node:bindings:esm,chromium:headless
ast test --mode node:wasi                      # just one
```

What's going on:

- **`default: false`** keeps `node:bindings:esm` and `chromium:headless` out of a bare `ast test`, but reachable via `--mode`.
- The **esm mode declares `--bindings esm`**, so `as-test` doesn't add `--bindings raw`. Its `input` excludes `unmock.spec.ts` because [import-mock fallbacks can't run under esm bindings](../mocking/import-mocks#runtime-support).
- Each mode's **outputs are namespaced** (`.as-test/build/<mode>/…`) so artifacts don't collide.

To add a standalone WASI engine, point a mode's runtime at its binary with the `<file>` placeholder:

```json
"wasmtime": {
  "default": false,
  "buildOptions": { "target": "wasi" },
  "runOptions": { "runtime": { "cmd": "wasmtime run <file>" } }
}
```

See [Multiple Runtimes](../runtimes/multiple-runtimes) for the full mode reference.
