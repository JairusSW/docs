# Fuzzing Patterns

Good fuzz targets assert a **property** — something true for every valid input — rather than a specific expected value. A few patterns cover most cases.

## Round-trip (encode → decode)

Whatever you put in should come back out:

```ts
import { expect, fuzz, FuzzSeed } from "as-test";

fuzz("encode/decode round-trips", (value: string): bool => {
  expect(decode(encode(value))).toBe(value);
  return true;
}).generate((seed: FuzzSeed, run: (value: string) => bool): void => {
  run(seed.string({ charset: "ascii", max: 64 }));
});
```

## Invariant (a relationship that always holds)

Assert the relationship, not the exact output:

```ts
fuzz("sorting preserves length and order", (xs: i32[]): bool => {
  const sorted = sort(xs);
  expect(sorted).toHaveLength(xs.length);
  for (let i = 1; i < sorted.length; i++) {
    expect(sorted[i] >= sorted[i - 1]).toBe(true);
  }
  return true;
}).generate((seed: FuzzSeed, run: (xs: i32[]) => bool): void => {
  run(seed.array<i32>((s: FuzzSeed): i32 => s.i32(), { min: 0, max: 32 }));
});
```

## Bounded inputs

Constrain generators so inputs stay in the domain you actually support — that keeps failures meaningful instead of testing overflow you don't care about:

```ts
fuzz("bounded addition is reversible", (a: i32, b: i32): bool => {
  expect(a + b - b).toBe(a);
  return true;
}).generate((seed: FuzzSeed, run: (a: i32, b: i32) => bool): void => {
  run(seed.i32({ min: -1000, max: 1000 }), seed.i32({ min: -1000, max: 1000 }));
});
```

## Keep the generator narrow

The generator's only job is to build the input and call `run(...)`. Don't mutate shared state or compute the expected answer inside it — that logic belongs in the property callback, where a failure can be tied back to its [seed](../fuzzing/failure-reproduction).

```ts
// Good: generator only produces inputs
.generate((seed, run) => run(seed.i32(), seed.i32()));
```

When a property fails, `as-test` prints the seed and input and a repro command — see [Failure Reproduction](../fuzzing/failure-reproduction).
