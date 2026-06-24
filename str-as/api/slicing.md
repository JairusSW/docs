# Slicing & Trimming

These all return another `str` — a sub-range of the same backing string,
with no characters copied.

## slice

`slice(start, end?)` — like `String#slice`, including negative indices (counted
from the end) and an out-of-order range collapsing to empty.

```ts
const v = str.from("the quick brown fox");
v.slice(4, 9).toString(); // "quick"
v.slice(-3).toString(); // "fox"
v.slice(10, 4).toString(); // "" (end < start)

str.slice("the quick brown fox", 4, 9); // free-function form
```

## substring

`substring(start, end?)` — like `String#substring`: negatives clamp to `0`, and
arguments swap if `start > end`.

```ts
str.from("the quick").substring(10, 4).toString(); // "quick" (swapped)
```

## substr

`substr(start, length?)` — like `String#substr`: a `start` (negative counts from
the end) and a `length`.

```ts
str.from("the quick brown fox").substr(4, 5).toString(); // "quick"
```

## charAt / at

Both return a **one-unit view** (or an empty view when out of range). `charAt`
takes a non-negative index; `at` allows negatives.

```ts
const v = str.from("hello");
v.charAt(0).toString(); // "h"
v.at(-1).toString(); // "o"
v.charAt(99).toString(); // "" (out of range)
```

> For a code-unit **value** rather than a view, use [`charCodeAt`](./searching)
> or the [`[]` operator](./comparison#indexing) — both allocation-free.

## trim, trimStart, trimEnd

Whitespace is trimmed by moving the view's bounds inward — the result shares the
original bytes. `trimLeft` / `trimRight` are aliases for `trimStart` /
`trimEnd`.

```ts
const v = str.from("  hello  ");
v.trim().toString(); // "hello"
v.trimStart().toString(); // "hello  "
v.trimEnd().toString(); // "  hello"
```

The whitespace set matches AssemblyScript's `String#trim` (ASCII whitespace plus
the Unicode space separators, line/paragraph separators, NBSP, BOM, …).

## split

`split(separator, limit?)` returns a `str[]` of zero-copy pieces — you pay
for a copy only on the pieces you materialize. An empty separator splits into
single-unit views; `limit` caps the number of pieces.

```ts
const f = str.split("a,bb,ccc", ","); // [str, str, str]
f[1].toString(); // "bb"

str.split("a,b,c,d", ",", 2).length; // 2
```

A tokenizer that never allocates until it finds what it wants:

```ts
const parts = str.split("id,name,email,role", ",");
for (let i = 0; i < parts.length; i++) {
  if (parts[i].equalsString("email")) {
    /* found field i — still zero-copy */
  }
}
```
