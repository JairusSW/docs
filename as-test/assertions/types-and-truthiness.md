# Types & Truthiness

## Type matchers

Type matchers confirm the compile-time type of the expression. They resolve during compilation, so they are effectively free at runtime.

```ts
expect("hello").toBeString();
expect(true).toBeBoolean();
expect([1, 2, 3]).toBeArray();
expect(42).toBeNumber();
```

| Matcher | Passes when the value is |
| --- | --- |
| `toBeString()` | a string |
| `toBeBoolean()` | a boolean |
| `toBeArray()` | an array |
| `toBeNumber()` | an integer or float (see [Numbers](./numbers)) |

## Truthiness

`toBeTruthy` and `toBeFalsy` apply AssemblyScript's truthiness rules to any value:

```ts
expect(1).toBeTruthy();
expect("non-empty").toBeTruthy();
expect(0).toBeFalsy();
expect("").toBeFalsy();
expect(<string | null>null).toBeFalsy();
```

| Value | Truthy? |
| --- | --- |
| non-zero number | yes |
| `0`, `NaN` | no |
| non-empty string | yes |
| empty string | no |
| non-null reference | yes |
| `null` | no |
| `true` / `false` | as written |

Combine with `.not` when an explicit negative reads better than a `toBeFalsy`:

```ts
expect(handle).not.toBeNull();
expect(items.length).toBeTruthy();
```
