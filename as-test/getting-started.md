# Getting Started

## Install

Add `as-test` to an AssemblyScript project:

```bash
npm install --save-dev as-test
```

## Scaffold A Project

The fastest path is the initializer:

```bash
npx ast init
```

Useful variants:

```bash
npx ast init --dir .
npx ast init --target wasi
npx ast init --target bindings
npx ast init --target web
npx ast init --fuzz-example
npx ast init --yes
```

`ast init` can create:

- `as-test.config.json`
- default runner scripts under `.as-test/runners/`
- a sample spec
- an optional sample fuzzer
- `assembly/tsconfig.json`

## Run The Suite

Run normal specs:

```bash
npx ast test
```

Run the suite through the ordered file worker pool:

```bash
npx ast test --parallel
```

Run fuzzers only:

```bash
npx ast fuzz
```

Run specs and fuzzers together:

```bash
npx ast test --fuzz
```

## Minimal Config

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "output": ".as-test/",
  "buildOptions": {
    "target": "wasi"
  },
  "runOptions": {
    "runtime": {
      "cmd": "node ./.as-test/runners/default.wasi.js <file>"
    }
  }
}
```

## What To Read Next

- [Writing Tests](./writing-tests)
- [Assertions](./assertions/)
- [Fuzzing](./fuzzing/)
- [Configuration](./configuration)
