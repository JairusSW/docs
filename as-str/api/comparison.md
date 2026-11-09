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

## Null and empty views

Nullable `str` and `str8` values support equality-based null guards. Prefix
`!` returns true for null or empty views, matching native string negation:

```ts
const empty = str.from("");
!empty; // true
```

## Collection compatibility

Use native `string` keys for content-based `Map` and `Set` lookup. AssemblyScript
hashes class references by identity even when overloaded equality compares their
contents. Distinct equal-content views therefore cannot reliably substitute for
one another as keys. Convert with `.toString()` consistently at insertion and
lookup. Views work as values in `Map<string, str>` and `Map<string, str8>`.

In AssemblyScript 0.28, nullable view arrays cannot directly use `Array.join`:
the standard library's null guard does not narrow classes with overloaded
equality. Convert elements into native strings first:

```ts
const strings = new Array<string>();
for (let i = 0; i < values.length; i++) {
  const value = values[i];
  strings.push(value === null ? "" : value!.toString());
}
const joined = strings.join(",");
```
