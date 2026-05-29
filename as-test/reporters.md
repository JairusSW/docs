# Reporters

A reporter turns run events into output. `as-test` ships two — a human-readable `default` and `tap` — and accepts custom reporter modules.

## Built-in reporters

| Reporter | Output |
| --- | --- |
| `default` | Human-readable progress, per-suite results, coverage summary. |
| `tap` | [TAP](https://testanything.org/) version 13, for CI and TAP consumers. |

```bash
ast test                 # default
ast test --reporter tap
ast test --tap           # shortcut for --reporter tap
```

## Configuring a reporter

String form selects a built-in or a module path:

```json
{ "runOptions": { "reporter": "tap" } }
```

Object form passes options. The TAP reporter supports `single-file` (default) and `per-file` output, with `outDir` / `outFile` controlling where it lands:

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

| Field | Purpose |
| --- | --- |
| `name` | `"default"`, `"tap"`, or a module path. |
| `options` | Reporter-specific flags (TAP: `single-file` \| `per-file`). |
| `outDir` | Output directory (TAP; defaults to `./.as-test/reports`). |
| `outFile` | Output file for TAP single-file mode. |

## Custom reporters

Point `name` (or `--reporter`) at a module path. `as-test` resolves it and calls its `createReporter` factory, which returns an object implementing the reporter interface. Implement only the hooks you care about:

```ts
// my-reporter.ts
export function createReporter(context) {
  return {
    onRunStart(event) {},
    onFileStart(event) {},
    onSuiteStart(event) {},
    onSuiteEnd(event) {},
    onAssertionFail(event) {},
    onSnapshotMissing(event) {},
    onWarning(event) {},
    onLog(event) {},
    onFileEnd(event) {},
    onRunComplete(event) {},
    flush() {},
  };
}
```

```json
{ "runOptions": { "reporter": "./tools/my-reporter.js" } }
```

| Hook | Fires |
| --- | --- |
| `onRunStart` | once, before any file runs |
| `onFileStart` / `onFileEnd` | around each spec file |
| `onSuiteStart` / `onSuiteEnd` | around each suite |
| `onAssertionFail` | on a failing assertion |
| `onSnapshotMissing` | when a snapshot has no baseline |
| `onWarning` / `onLog` | on warnings and `log()` output |
| `onRunComplete` | once, with the final aggregated results |
| `flush` | at the end, to write buffered output |

All hooks are optional. Use `onRunComplete` for summary output and `flush` to write files.
