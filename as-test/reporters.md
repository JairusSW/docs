# Reporters

`as-test` ships with a built-in default reporter and a built-in TAP reporter.

It also supports custom reporters loaded from a module path.

## Built-in Reporters

- `default`
- `tap`

CLI examples:

```bash
ast test
ast test --tap
ast test --reporter tap
ast run --reporter ./scripts/my-reporter.mjs
```

## Configuring A Reporter

String form:

```json
{
  "runOptions": {
    "reporter": "default"
  }
}
```

Object form:

```json
{
  "runOptions": {
    "reporter": {
      "name": "tap",
      "options": ["per-file"],
      "outDir": "./.as-test/reports"
    }
  }
}
```

Supported TAP options:

- `single-file`
- `per-file`

Defaults:

- TAP output directory: `./.as-test/reports`
- TAP output file in single-file mode: `./.as-test/reports/report.tap`

## Custom Reporter Modules

Custom reporters are loaded from a module path and must export a factory as either:

- `createReporter`
- the module default export

The runtime resolves the path relative to the config file when it is not absolute.
