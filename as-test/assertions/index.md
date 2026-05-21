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

## Chaining

Every matcher returns the `Expectation`, so multiple checks can chain off one `expect(...)`:

```ts
expect(7).toBe(7).where((): bool => isFresh());
expect("as-test").toBeString().toStartWith("as");
expect(10).toBeGreaterThan(5).toBeLessThan(100);
```

Each link in the chain is an **independent assertion** — the test fails if any of them fail. There is no priority; they are peers. A failing matcher does not stop later matchers in the same chain from running, and a later passing matcher cannot un-fail an earlier one.

`.not` resets after each matcher, so it only applies to the matcher immediately following it:

```ts
expect(7).not.toBe(8).toBeGreaterThan(5); // not toBe(8), and > 5
```

## Custom Predicates with `.where()`

`.where()` accepts either a bool or a `() => bool` lambda. Use it when the verdict isn't expressible via the built-in matchers — for example, delegating to a hand-written comparator:

```ts
expect(x).where(x > 0 && x < 10);
expect(actual).where((): bool => deepCompare(GLOBAL_A, GLOBAL_B));
```

The lambda runs once and must return `bool`. AssemblyScript does not implement closures, so the lambda cannot capture local variables — use the bool form when the predicate references locals, or refer to module-level values from inside the lambda.

See [Equality → Custom Predicates with `.where()`](./equality#custom-predicates-with-where) for the full reference.

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
