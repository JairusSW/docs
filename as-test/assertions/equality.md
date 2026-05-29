# Equality

Three matchers compare values; pick by how strict you need to be.

| Matcher | Compares | Use when |
| --- | --- | --- |
| `toBe(expected)` | Deep structural equality (`===` for primitives) | The default — works for primitives, strings, and managed objects. |
| `toEqual(expected)` | Same as `toBe` | You prefer the Jest spelling. |
| `toStrictEqual(expected)` | Deep equality **and** matching runtime type | Subclasses must not be treated as equal to their base. |

```ts
expect(1 + 1).toBe(2);
expect("a" + "b").toBe("ab");
expect(new Point(1, 2)).toEqual(new Point(1, 2));
```

## `toBe` and `toEqual`

`toBe` compares primitives and strings by value and managed objects by walking their structure, so two distinct instances with equal fields are equal. `toEqual` is an alias — identical behavior, provided for familiarity.

```ts
expect(new Point(1, 2)).toBe(new Point(1, 2)); // passes — same structure
```

## `toStrictEqual`

`toStrictEqual` adds a runtime-type check on top of structural equality. Two objects must share the same concrete type to be strictly equal, which distinguishes subclasses that would otherwise compare equal:

```ts
class Shape { size: i32 = 0; }
class Circle extends Shape {}

expect<Shape>(new Circle()).toBe(new Shape());        // passes — same fields
expect<Shape>(new Circle()).not.toStrictEqual(new Shape()); // different types
```

## `toBeNull`

Asserts a nullable reference (or a `usize`) is null:

```ts
expect(maybeUser).toBeNull();
expect(found).not.toBeNull();
```

## How values are rendered

When an equality assertion fails, both sides are serialized with the built-in formatter — the same one used by [`log()`](../writing-tests#logging) and [snapshots](../snapshots). Classes that define `toJSON()` render through it, which keeps failure output readable.

## Closures and captured values

AssemblyScript does not capture local variables in closures the way TypeScript does. When you need a computed condition, prefer a direct matcher, or read from fields / module scope inside [`.where()`](./#custom-predicates-with-where):

```ts
// Avoid: the lambda cannot see `expected`
// expect(actual).where((): bool => actual == expected);

let expected = 42;            // module scope
expect(actual).where((): bool => actual == expected);
```

For structural comparisons, reach for `toBe` / `toStrictEqual` rather than hand-rolling equality in `.where()`.
