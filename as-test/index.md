# as-test

`as-test` is a runtime-aware test runner for AssemblyScript.

You write ordinary specs, snapshots, mocks, and fuzzers once, then run them against the runtime you actually ship to — WASI, Node bindings, the browser, or a standalone runtime like `wasmtime` — through named [modes](./runtimes/multiple-runtimes). Tests are compiled to WebAssembly and executed there, so what you assert is what your users get.

It ships as a CLI (`ast` / `as-test`) and an npm dev dependency. There are no required peer dependencies; value formatting for assertions, snapshots, and `log()` is built in.

## What you get

- **Specs** in `assembly/__tests__/*.spec.ts` with `describe` / `test` / `it`, lifecycle hooks, and focus/skip/todo.
- **A full matcher set** — deep equality, numeric comparisons, type and truthiness checks, string and collection matchers, snapshots, and `toThrow`.
- **Snapshots** stored under `.as-test/` and updated from the CLI.
- **Mocking** — swap local functions (`mockFn`) or host imports (`mockImport`) at compile time.
- **Fuzzing** — property tests with deterministic, reproducible seeds in `assembly/__fuzz__/*.fuzz.ts`.
- **Coverage** — branch-aware instrumentation with project/dependency filtering.
- **Runtimes & modes** — one suite, many targets, selected with `--mode`.
- **Reporters** — a human-readable default and TAP, plus custom reporter modules.

## Start here

1. [Getting Started](./getting-started) — install, scaffold, and run your first suite.
2. [Writing Tests](./writing-tests) — suites, hooks, focus/skip, and logging.
3. [Assertions](./assertions/) — the matcher reference.
4. Add [Snapshots](./snapshots), [Mocking](./mocking/), or [Fuzzing](./fuzzing/) when you need them.
5. [Runtimes & Modes](./runtimes/) — run the same specs across WASI, bindings, and the web.
6. [CLI](./cli) and [Configuration](./configuration) — once the defaults stop being enough.

## Project layout

A typical project looks like this:

```text
assembly/
  __tests__/
    math.spec.ts
  __fuzz__/
    parser.fuzz.ts
.as-test/
  build/        compiled wasm artifacts
  runners/      generated runtime entry scripts
  logs/         captured log() output
  snapshots/    stored snapshots
  crashes/      fuzz crash artifacts
as-test.config.json
```

If you also need fast JSON for AssemblyScript data structures, see [json-as](/json-as/).
