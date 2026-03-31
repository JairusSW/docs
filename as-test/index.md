# as-test

`as-test` is a runtime-aware test runner for AssemblyScript.

It lets you write normal specs, snapshots, mocks, and fuzzers without locking yourself to one execution environment. The same project can run against WASI, bindings, or web targets through named modes, and the CLI can fan work out across files when your suite gets larger.

## What It Covers

- Ordinary test files in `assembly/__tests__/*.spec.ts`
- Dedicated fuzz targets in `assembly/__fuzz__/*.fuzz.ts`
- Snapshots, coverage, logs, and crash artifacts under `.as-test/`
- Multiple runtime modes selected with `--mode`
- Built-in default and TAP reporters

## Recommended Path

1. Start with [Getting Started](./getting-started).
2. Write your first suite with [Writing Tests](./writing-tests).
3. Learn matcher behavior in [Assertions](./assertions/).
4. Add [Snapshots](./snapshots), [Mocking](./mocking/), or [Fuzzing](./fuzzing/) as needed.
5. Use [Configuration](./configuration) and [CLI](./cli) once the defaults stop being enough.

## Project Layout

Typical project layout:

```text
assembly/
  __tests__/
    math.spec.ts
  __fuzz__/
    parser.fuzz.ts
.as-test/
  build/
  logs/
  snapshots/
  crashes/
as-test.config.json
```

If you also need fast JSON support for AssemblyScript data structures, see [json-as](/json-as/).
