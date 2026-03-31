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
