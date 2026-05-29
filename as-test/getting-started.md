# Getting Started

## Install

Add `as-test` to an AssemblyScript project:

```bash
npm install --save-dev as-test
```

`as-test` is self-contained — value serialization for assertions, snapshots, and `log()` is built in, so there are no required peer dependencies.

The WASI target additionally needs `@assemblyscript/wasi-shim`:

```bash
npm install --save-dev @assemblyscript/wasi-shim
```

## Scaffold a project

The fastest path is the initializer:

```bash
npx ast init
```

`ast init` can create:

- `as-test.config.json`
- runner scripts under `.as-test/runners/`
- a sample spec in `assembly/__tests__/`
- an optional sample fuzzer in `assembly/__fuzz__/`
- `assembly/tsconfig.json`

Useful flags:

| Flag | Effect |
| --- | --- |
| `--target <wasi\|bindings\|web>` | Set the build target (default `wasi`). |
| `--example <minimal\|full\|none>` | Choose the sample spec, or skip it. |
| `--fuzz-example` / `--no-fuzz-example` | Include or omit the sample fuzzer. |
| `--enable <list>` | Turn on features at scaffold time (e.g. `coverage`, `try-as`). |
| `--dir <path>` | Scaffold into a specific directory. |
| `--install` | Install dependencies after scaffolding. |
| `--yes`, `-y` | Accept defaults; no prompts. |
| `--force` | Overwrite managed files. |

```bash
npx ast init --target bindings --example full --fuzz-example --yes
```

## Your first spec

A spec is any file matched by `input` (default `assembly/__tests__/*.spec.ts`). Register suites, assert with `expect`, and end with `run()`:

```ts
import { describe, expect, test } from "as-test";

describe("example", () => {
  test("adds numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

> `run()` is called for you when a spec defines suites but never calls it. Add an explicit `run()` only when you need to pass [`RunOptions`](./writing-tests#logging).

## Run the suite

```bash
npx ast test            # build + run every spec
npx ast test --parallel # spread files across a worker pool
npx ast fuzz            # run fuzz targets only
npx ast test --fuzz     # run specs, then fuzzers
npx ast test --watch    # re-run on change
```

`ast test` compiles each spec with the AssemblyScript compiler (running the `as-test` transform), then executes the resulting wasm through the configured runtime. See the [CLI reference](./cli) for the full flag set.

## Minimal config

`ast init` writes this for you, but the whole thing fits in a few lines:

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "output": ".as-test/",
  "buildOptions": {
    "target": "wasi"
  },
  "runOptions": {
    "runtime": {
      "cmd": "node ./.as-test/runners/default.wasi.js"
    }
  }
}
```

## Next

- [Writing Tests](./writing-tests) — the full authoring surface.
- [Assertions](./assertions/) — every matcher.
- [Runtimes & Modes](./runtimes/) — run the same specs on more than one runtime.
- [Configuration](./configuration) — every config field.
