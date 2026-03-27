# Getting Started

Install `as-test` in your AssemblyScript project:

```bash
npm install --save-dev as-test
```

Initialize the project structure:

```bash
npx ast init --dir .
```

Run the default test suite:

```bash
ast test
```

Run through the automatic worker pool when you want faster file-level scheduling:

```bash
ast test --parallel
```

Typical layout:

```text
assembly/
  __tests__/
    math.spec.ts
  __fuzz__/
    parser.fuzz.ts
.as-test/
as-test.config.json
```

Next guides:

- [Writing Tests](./writing-tests.md)
- [Fuzzing](./fuzzing.md)
- [Configuration](./configuration.md)
