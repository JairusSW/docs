# Strings & Collections

## String matchers

These operate on string values. Matching is plain substring matching — not regular expressions.

```ts
expect("assemblyscript").toMatch("script");   // contains
expect("as-test").toStartWith("as");          // prefix
expect("report.tap").toEndWith(".tap");        // suffix
```

| Matcher | Passes when |
| --- | --- |
| `toMatch(sub)` | the string contains `sub` |
| `toStartWith(prefix)` | the string starts with `prefix` |
| `toEndWith(suffix)` | the string ends with `suffix` |

## Length

`toHaveLength` works on strings and arrays:

```ts
expect("hello").toHaveLength(5);
expect([1, 2, 3]).toHaveLength(3);
```

## Containment

`toContain` (and its alias `toContains`) checks membership. For arrays it uses `.includes()`; for strings it checks for a substring:

```ts
expect([1, 2, 3]).toContain(2);
expect("assemblyscript").toContain("script");
```

| Matcher | On arrays | On strings |
| --- | --- | --- |
| `toContain(value)` | element is present | substring is present |
| `toContains(value)` | alias for `toContain` | alias for `toContain` |
| `toHaveLength(n)` | `array.length == n` | `string.length == n` |

Negate any of them with `.not`:

```ts
expect(tags).not.toContain("deprecated");
expect(name).not.toHaveLength(0);
```
