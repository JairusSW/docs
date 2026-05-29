# Minimal Spec

The smallest useful test: one suite, one case, one assertion.

```ts
// assembly/__tests__/math.spec.ts
import { describe, expect, test } from "as-test";

describe("math", () => {
  test("adds numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

Run it:

```bash
ast test
```

```text
 PASS  math.spec.ts
 Tests:  1 passed, 1 total
```

There's no `run()` call here — `as-test` injects one when a spec defines suites but never calls it. Add an explicit `run({ log: false })` only when you need [`RunOptions`](../writing-tests#logging).

From here, add matchers from [Assertions](../assertions/), or grow into [Snapshots & Mocks](./snapshots-and-mocks).
