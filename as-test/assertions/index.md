# Assertions

Every assertion starts with `expect(value)` and chains a matcher:

```ts
expect(2 + 2).toBe(4);
expect("as-test").toStartWith("as");
expect([1, 2, 3]).toHaveLength(3);
```

`expect<T>(value)` returns a chainable `Expectation<T>`. Each matcher returns the same expectation, so you can apply several in a row. Matchers run independently — one failing does not stop the next — and the source location of each is injected automatically so failures point at the right line.

## Negation

`.not` flips the next matcher:

```ts
expect(value).not.toBe(null);
expect(name).not.toContain(" ");
```

`.not` applies to the matcher that immediately follows it and resets afterward, so `expect(x).not.toBe(a).toBe(b)` negates only the first.

## Messages

Most matchers accept a trailing message used in the failure report:

```ts
expect(user.age).toBeGreaterThan(17, "users must be adults");
```

## Chaining

Because every matcher returns the expectation, assertions compose:

```ts
expect(score)
  .toBeNumber()
  .toBeGreaterOrEqualTo(0)
  .toBeLessThanOrEqualTo(100);
```

## Custom predicates with `.where()`

When no built-in matcher fits, `.where()` asserts an arbitrary condition. It accepts either a `bool` or a `() => bool` lambda:

```ts
expect(point).where((): bool => point.x == point.y, "x must equal y");
```

A `.where()` clause is evaluated independently from the rest of the chain, so it composes with other matchers on the same expectation.

> AssemblyScript closures cannot capture local variables the way TypeScript does. If a `.where()` lambda needs a value, read it from a field or module-scope binding rather than a captured local. The same constraint shapes the [equality matchers](./equality#closures-and-captured-values).

## Skipping an assertion

Skip a single expectation without removing it:

```ts
expect(flaky).skip().toBe(true); // recorded as skipped
xexpect(flaky).toBe(true);        // same thing
```

## Matcher groups

| Group | Matchers |
| --- | --- |
| [Equality](./equality) | `toBe`, `toEqual`, `toStrictEqual`, `toBeNull` |
| [Numbers](./numbers) | `toBeGreaterThan`, `toBeGreaterOrEqualTo`, `toBeLessThan`, `toBeLessThanOrEqualTo`, `toBeCloseTo`, `toBeFinite`, `toBeInteger`, `toBeFloat`, `toBeNumber` |
| [Types & truthiness](./types-and-truthiness) | `toBeString`, `toBeBoolean`, `toBeArray`, `toBeNumber`, `toBeTruthy`, `toBeFalsy` |
| [Strings & collections](./strings-and-collections) | `toMatch`, `toStartWith`, `toEndWith`, `toHaveLength`, `toContain`, `toContains` |
| [Snapshots & throws](./snapshots-and-throws) | `toMatchSnapshot`, `toThrow` |

## Assertions inside fuzzers

The same matchers work inside [fuzz](../fuzzing/) callbacks. A failing assertion fails that fuzz run and the failing seed is reported for [reproduction](../fuzzing/failure-reproduction):

```ts
fuzz("sum is reversible", (a: i32, b: i32): bool => {
  expect(a + b - b).toBe(a);
  return true;
}).generate((seed, run) => run(seed.i32(), seed.i32()));
```
