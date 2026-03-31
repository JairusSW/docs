# Strings And Collections

Use these matchers for substring checks, prefixes, suffixes, and array membership.

## String Matchers

```ts
expect("abcdef").toMatch("bcd");
expect("abcdef").toStartWith("abc");
expect("abcdef").toEndWith("def");
```

Available methods:

- `toMatch(value)`
- `toStartWith(value)`
- `toEndWith(value)`

`toMatch(...)` is currently a substring check, not a regular expression engine.

## Length

```ts
expect([1, 2, 3]).toHaveLength(3);
```

`toHaveLength(value)` is intended for arrays.

## Containment

```ts
expect("abcdef").toContain("cd");
expect([1, 2, 3]).toContain(2);
```

Available methods:

- `toContain(value)`
- `toContains(value)`

`toContains(...)` is just an alias of `toContain(...)`.

For strings, containment is substring-based. For arrays, it uses the runtime array `includes(...)` behavior.
