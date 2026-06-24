# Comparison & Operators

All comparisons operate on **content**, not identity — two views over different
backing strings compare equal when their bytes match.

## equals / equalsString

`equals(other)` compares against another `str`; `equalsString(other)`
compares against a `string`. The free function `str.equals(a, b)` accepts a
`string` or a `str` for either side.

```ts
const a = str.slice("__world", 2); // "world"
const b = str.slice("hello world", 6); // "world", different backing string
a.equals(b); // true
a.equalsString("world"); // true
str.equals("world", b); // true
```

## compareTo / localeCompare

`compareTo(other)` returns the sign of a lexicographic (code-unit) comparison:
`-1`, `0`, or `1`. `localeCompare` is provided as a `String`-compatible alias.

```ts
str.from("apple").compareTo(str.from("banana")); // -1
str.compare("b", "a"); // 1 (free-function form)
```

This is the [SWAR/SIMD-accelerated](../performance#swar-and-simd) ordering path.

## Operators

`str` overloads the comparison operators so views read like primitives:

```ts
const a = str.from("alpha");
const b = str.from("beta");

a == b; // false   (content equality)
a != b; // true
a < b; // true     (lexicographic)
a <= b; // true
a > b; // false
a >= b; // false
```

### Concatenation

`+` concatenates two views, returning a view over a freshly allocated string —
so it chains:

```ts
(str.from("foo") + str.from("bar")).toString(); // "foobar"
(str.from("a") + str.from("b") + str.from("c")).toString(); // "abc"
```

### Indexing

`v[i]` returns the UTF-16 code unit at `i` (or `-1` if out of range), with no
allocation — shorthand for [`charCodeAt`](./searching).

```ts
const v = str.from("hello");
v[0]; // 104
v[99]; // -1
```

> `v[i]` returns a code-unit **value** (`i32`); for a one-unit **view** use
> [`charAt`](./slicing).
