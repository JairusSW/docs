# Stable Values With `snapshotFn`

`snapshotFn(callback)` captures the current return value of a zero-argument callback and gives you back a new zero-argument function that always returns that captured value.

```ts
import { snapshotFn } from "as-test";

const stableClock = snapshotFn((): i64 => currentTime());
```

## When It Helps

- freezing a clock value for a test run
- holding a random-looking value steady
- turning a changing dependency into a deterministic callback

This is not the same feature as snapshot assertions. It is a runtime helper for stabilizing a function result.
