# Snapshots & Mocks

Snapshots shine on output that's tedious to assert by hand — but only when that output is deterministic. The recipe: **mock the volatile dependency, then snapshot the result.**

Here a renderer stamps each record with the current time. Left alone, the snapshot would change every run. We freeze the clock with a [function mock](../mocking/function-mocks), then capture the output with [`toMatchSnapshot`](../assertions/snapshots-and-throws#tomatchsnapshot).

```ts
// assembly/__tests__/render.spec.ts
import { describe, expect, mockFn, test } from "as-test";
import { render } from "../render";

function now(): i64 {
  return Date.now();
}

// Freeze the clock so the snapshot is stable across runs.
mockFn(now, (): i64 => 1_700_000_000_000);

describe("render", () => {
  test("formats a record", () => {
    expect(render("created", now())).toMatchSnapshot("created-record");
  });
});
```

Record the baseline on the first run, then let later runs compare against it:

```bash
ast test --create-snapshots   # first time: record the snapshot
ast test                      # afterwards: compare
```

When you intentionally change the output, re-baseline:

```bash
ast test --overwrite-snapshots
```

If you only need to pin a value (not replace a function's behavior), [`snapshotFn`](../mocking/stable-values) is lighter:

```ts
import { snapshotFn } from "as-test";

const now = snapshotFn((): i64 => Date.now()); // captured once
```

See [Mocking](../mocking/) for `mockImport` (host imports) and the runtime considerations that come with it.
