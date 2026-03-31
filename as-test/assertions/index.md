# Assertions

Assertions start from `expect(value, message?, location?)`.

Basic example:

```ts
import { expect, test } from "as-test";

test("example", () => {
  expect(1 + 2).toBe(3);
  expect("hello").toStartWith("he");
  expect([1, 2, 3]).toContain(2);
});
```

## Negation

Use `.not` before a matcher:

```ts
expect(1).not.toBe(2);
expect("hello").not.toEndWith("xx");
```

## Messages

The optional second argument becomes the failure message when the matcher fails:

```ts
expect(total, "sum should stay stable").toBe(42);
```

## Matcher Groups

- [Equality](./equality)
- [Numbers](./numbers)
- [Types And Truthiness](./types-and-truthiness)
- [Strings And Collections](./strings-and-collections)
- [Snapshots And Throws](./snapshots-and-throws)

## Fuzzing Interaction

Inside a fuzzer:

- failed `expect(...)` calls fail the current fuzz iteration
- they are counted in the fuzz result, not the normal test totals
- the first failure details are recorded in the fuzz report

See [Fuzzing](../fuzzing/) for how failures and repro commands are reported.
