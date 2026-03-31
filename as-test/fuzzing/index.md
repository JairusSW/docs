# Fuzzing

Fuzzers live separately from specs, usually in `assembly/__fuzz__/*.fuzz.ts`.

Basic shape:

```ts
import { expect, FuzzSeed, fuzz } from "as-test";

fuzz("bounded integer addition", (left: i32, right: i32): bool => {
  const sum = left + right;
  expect(sum - right).toBe(left);
  return sum >= i32.MIN_VALUE;
}).generate((seed: FuzzSeed, run: (left: i32, right: i32) => bool): void => {
  run(
    seed.i32({ min: -1000, max: 1000 }),
    seed.i32({ min: -1000, max: 1000 }),
  );
});
```

## Read Next

- [Running Fuzzers](./running-fuzzers)
- [Seed Generators](./seed-generators)
- [Failure Reproduction](./failure-reproduction)

## Core Rules

- failed `expect(...)` calls fail the current iteration
- returning `false` fails the current iteration
- returning `true` or `void` passes when no assertion failed
- traps, throws, and runtime failures are treated as crashes

`ast test` only runs fuzzers when you pass `--fuzz`.
