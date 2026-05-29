# Snapshots

Snapshots pin the serialized form of a value so you notice when it changes. They suit output that is tedious to assert field by field — rendered strings, serialized structures, large arrays.

## Basic usage

```ts
import { expect, test } from "as-test";

test("renders a report", () => {
  expect(renderReport(data)).toMatchSnapshot();
});
```

The first run has nothing to compare against, so record the baseline:

```bash
ast test --create-snapshots
```

Subsequent runs compare the serialized value against the stored snapshot and fail on any difference.

## Naming and identity

A snapshot is keyed by its file, its suite nesting path, and a name:

- **Unnamed** snapshots are numbered per suite in source order — `#1`, `#2`, …
- **Named** snapshots use the string you pass: `expect(x).toMatchSnapshot("empty-state")`.

Because the key includes the suite path, the same name used in two different suites refers to two different snapshots. Prefer names once a suite has more than one snapshot — reordering unnamed snapshots renumbers them.

## Updating snapshots

Snapshots live under the configured `snapshotDir` (default `.as-test/snapshots`). Manage them from the CLI rather than editing files:

| Flag | Effect |
| --- | --- |
| `--create-snapshots` | Record snapshots that don't exist yet. Existing ones still must match. |
| `--overwrite-snapshots` | Accept the current output as the new baseline on mismatch. |
| `--no-snapshot` | Skip snapshot assertions entirely for this run. |

```bash
ast test --create-snapshots      # add new snapshots
ast test --overwrite-snapshots   # intentional change: re-baseline
```

The run summary reports snapshot outcomes separately:

```text
Snapshots: 3 matched, 1 created, 0 updated, 0 failed
```

## When to use them

- **Good fits:** serialized output, formatted strings, large or nested structures, regression guards on rendering.
- **Poor fits:** values that change every run (timestamps, random data, pointers). Pin those with a [function mock](./mocking/function-mocks) or [`snapshotFn`](./mocking/stable-values) first, or assert the parts that are stable.

## Related

- [Snapshots & Throws](./assertions/snapshots-and-throws) — the matcher.
- [Stable Values](./mocking/stable-values) — freeze a value so a snapshot stays deterministic.
