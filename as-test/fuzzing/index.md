# Fuzzing

A fuzzer runs your code against many generated inputs and checks that a property holds for all of them. `as-test` fuzzers are deterministic: every run is driven by a seed, so a failure can be replayed exactly.

Fuzz targets live in `assembly/__fuzz__/*.fuzz.ts` by default.

```ts
import { expect, fuzz, FuzzSeed } from "as-test";

fuzz("bounded integer addition", (left: i32, right: i32): bool => {
  const sum = left + right;
  expect(sum - right).toBe(left);
  return sum >= i32.MIN_VALUE; // also fails if an expectation above fails
}).generate((seed: FuzzSeed, run: (left: i32, right: i32) => bool): void => {
  run(seed.i32({ min: -1000, max: 1000 }), seed.i32({ min: -1000, max: 1000 }));
});
```

## Anatomy of a fuzzer

`fuzz(description, callback, operations?)` registers a property. The callback receives generated arguments and returns a `bool`. `.generate(...)` supplies those arguments from a [`FuzzSeed`](./seed-generators).

```ts
fuzz("property name", (a: T, b: U): bool => {
  // assert with expect(...) and/or return a boolean
  return /* property holds */;
})
.generate((seed: FuzzSeed, run: (a: T, b: U) => bool): void => {
  run(seed.something(), seed.somethingElse());
});
```

- The **property callback** returns `true` when the property holds for that input.
- The **generator** builds one input per iteration and calls `run(...)` with it.
- A zero-argument fuzzer (`fuzz("name", (): bool => ...)`) may skip `.generate()`; any fuzzer that takes arguments must provide one.
- The optional third argument to `fuzz(...)` sets a per-target operation count.

## Pass, fail, crash

Each iteration ends in one of three states:

| Outcome | Cause |
| --- | --- |
| **pass** | The callback returns `true` and no assertion failed. |
| **fail** | The callback returns `false`, or an `expect(...)` inside it fails. |
| **crash** | The wasm traps (out-of-bounds, unreachable, abort, …). |

Failures and crashes record the seed and the generated input so you can [reproduce](./failure-reproduction) them.

## Use a real generator, narrowly

Keep generator side effects to the inputs themselves — don't mutate shared state inside `.generate()`. The point is that `run(...)` receives one self-contained input per iteration. See [Fuzzing Patterns](../examples/fuzzing-patterns) for worked examples.

## Read next

- [Running Fuzzers](./running-fuzzers) — commands, run counts, and filtering.
- [Seed Generators](./seed-generators) — the `FuzzSeed` API.
- [Failure Reproduction](./failure-reproduction) — replaying a failing seed.
