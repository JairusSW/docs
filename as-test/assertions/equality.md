# Equality Matchers

`as-test` has three equality matchers with intentionally different semantics.

## `toBe`

`toBe` checks identity or exact primitive equality.

```ts
expect(1 + 2).toBe(3);
expect(name).toBe("demo");
```

Use `toBe` when you mean:

- primitive equality
- pointer identity
- exact same managed instance

## `toEqual`

`toEqual` performs deep equality.

```ts
expect([1, 2, 3]).toEqual([1, 2, 3]);
```

For managed values, `toEqual` delegates to `__as_test_equals(other, strict)` when needed.

## `toStrictEqual`

`toStrictEqual` performs deep equality with runtime-type matching for managed values.

```ts
expect(actualUser).toStrictEqual(expectedUser);
```

This is stricter than `toEqual` because managed values also have to agree on runtime type identity.

## `toBeNull`

`toBeNull` checks nullable values, and also treats `usize(0)` as null-like in the runtime helper.

```ts
expect<string | null>(null).toBeNull();
```

## Choosing Between Them

- Use `toBe` for identity or plain primitive equality.
- Use `toEqual` for deep structural comparisons.
- Use `toStrictEqual` when runtime type mismatches should fail even if the shape matches.

## Custom Predicates with `.where()`

When none of the above match the comparison you actually need — for example, asserting equality against a reference JS implementation by way of a hand-written deep-compare — use `.where()`. It accepts either a bool or a `() => bool` lambda:

```ts
// bool form: predicate is inlined at the call site
expect(x).where(x > 0 && x < 10);

// lambda form: predicate is evaluated lazily
expect(actual).where((): bool => deepCompare(GLOBAL_A, GLOBAL_B));
```

`.where()` is a regular matcher, so it chains and negates like any other:

```ts
expect(parsed).toBeArray().where((): bool => allDistinct());
expect(value).not.where((): bool => isBlacklisted());
```

The recorded failure is `expected "true", received "false"` — the subject value itself isn't serialized into the report because `.where()` is generic over the predicate, not the subject.

### Closures and the lambda form

AssemblyScript does not yet implement closures, so the lambda passed to `.where()` cannot capture local variables from the enclosing scope. Two practical workarounds:

- Use the **bool form** when the predicate is built from locals — it's a plain expression evaluated at the call site.
- Use the **lambda form** when the predicate calls module-level functions or reads module-level values.

```ts
const REF: Point = new Point(3, 4);

function matchesRef(actual: Point): bool {
  return actual.x == REF.x && actual.y == REF.y;
}

test("custom verdict via lambda", () => {
  const actual = parsePoint(input);
  // bool form — references the local `actual` directly.
  expect(actual).where(matchesRef(actual));
});
```
