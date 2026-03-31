# Fuzzing Patterns

A common fuzzing pattern is to keep the property small and deterministic, and do all randomness inside `.generate(...)`.

```ts
import { expect, FuzzSeed, fuzz } from "as-test";

fuzz("sorted arrays stay ordered", (values: i32[]): void => {
  for (let i = 1; i < values.length; i++) {
    expect(values[i - 1] <= values[i]).toBe(true);
  }
}).generate((seed: FuzzSeed, run: (values: i32[]) => void): void => {
  const values = seed.array<i32>(
    (inner) => inner.i32({ min: -50, max: 50 }),
    { min: 0, max: 12 },
  );
  values.sort();
  run(values);
});
```

Keep generator side effects narrow. If a failure does happen, `as-test` now records the concrete failing inputs in the crash artifact.
