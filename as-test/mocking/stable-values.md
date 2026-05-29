# Stable Values

`snapshotFn` captures the result of a zero-argument callback once and returns a function that always replays that captured value.

```ts
import { snapshotFn } from "as-test";

const frozenNow = snapshotFn((): i64 => Date.now());

frozenNow(); // same value every call, for the rest of the run
```

| Function | Signature | Effect |
| --- | --- | --- |
| `snapshotFn` | `snapshotFn(callback) => () => T` | Evaluate `callback` once; return a function that replays the captured value. |

## When it helps

Use it to freeze a non-deterministic value so the rest of a test — and especially a [snapshot assertion](../snapshots) — stays stable:

```ts
const timestamp = snapshotFn((): i64 => Date.now());

test("serializes an event", () => {
  const event = new Event(timestamp(), "created");
  expect(serialize(event)).toMatchSnapshot();
});
```

## Not the same as a snapshot assertion

Despite the name, `snapshotFn` has nothing to do with `toMatchSnapshot`:

- `snapshotFn` pins a value **in memory for the current run** so repeated calls agree.
- [`toMatchSnapshot`](../assertions/snapshots-and-throws) compares a value against a baseline **stored on disk** across runs.

They compose well — freeze the volatile inputs with `snapshotFn`, then snapshot the output. When you need to replace a function's behavior rather than pin its result, use [`mockFn`](./function-mocks).
