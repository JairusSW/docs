# Function Mocks

`mockFn` replaces a local function with a stand-in. `unmockFn` restores it. Both take effect at the call sites that follow them in source order.

```ts
import { expect, mockFn, test, unmockFn } from "as-test";

function now(): i64 {
  return Date.now();
}

mockFn(now, (): i64 => 1_700_000_000_000);

test("uses the frozen clock", () => {
  expect(now()).toBe(1_700_000_000_000);
});

unmockFn(now);

test("uses the real clock again", () => {
  expect(now()).toBeGreaterThan(0);
});
```

## Signatures

| Function | Signature | Effect |
| --- | --- | --- |
| `mockFn` | `mockFn(original, replacement)` | Route calls to `original` through `replacement`. |
| `unmockFn` | `unmockFn(original)` | Restore calls to `original`. |

The replacement must have a compatible signature. Inside it you may still call the original — a mock that wraps rather than replaces is a common pattern:

```ts
mockFn(fetchUser, (id: i32): User => {
  // delegate to the real implementation, then tweak the result
  const user = fetchUser(id);
  user.verified = true;
  return user;
});
```

## Source order, not scope

Mocks are not scoped to a `describe` or reset between tests. They apply from the `mockFn` call onward and stop at the matching `unmockFn`. Place those calls deliberately — at module top level to cover a whole file, or between tests to switch behavior partway through.

```ts
mockFn(rng, (): f64 => 0.5); // everything below sees 0.5

test("a", () => { /* mocked */ });
test("b", () => { /* mocked */ });

unmockFn(rng);               // back to the real rng from here
```

## Function mocks vs. imports

`mockFn` targets functions defined in your own code. To replace a host `@external` import — something the runtime provides — use [`mockImport`](./import-mocks) instead. Note that `unmockFn` does **not** keep any host binding alive; only `unmockImport` does, which is why function mocks run on every runtime without restriction.
