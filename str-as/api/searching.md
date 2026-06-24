# Searching

Queries that scan the view and return a primitive — no allocation. The needle
for each can be a `string` **or** a `str`, so you can search a view inside a
view.

These are the [SWAR/SIMD-accelerated](../performance#swar-and-simd) paths.

## indexOf / lastIndexOf

`indexOf(needle, start?)` returns the first code-unit index at or after `start`,
or `-1`. `lastIndexOf(needle, start?)` searches backward from `start`.

```ts
const v = str.from("the quick brown fox");
v.indexOf("brown"); // 10
v.indexOf("o", 12); // 17
v.indexOf("zzz"); // -1
v.lastIndexOf("o"); // 17
```

A `str` needle works identically:

```ts
const needle = str.slice("xxbrownyy", 2, 7); // "brown"
v.indexOf(needle); // 10
```

Semantics match native `String` exactly, including the quirks: an empty needle
returns `0` for `indexOf` and the haystack length for `lastIndexOf`, and a
negative `start` clamps to `0`.

## includes

`includes(needle)` — `true` if the needle occurs anywhere.

```ts
str.from("the quick brown fox").includes("quick"); // true
str.includes("the quick brown fox", "cat"); // false
```

## startsWith / endsWith

`startsWith(needle, start?)` and `endsWith(needle, end?)` test a prefix/suffix at
an optional position, matching `String#startsWith` / `String#endsWith` (including
position clamping).

```ts
const v = str.from("the quick brown fox");
v.startsWith("the"); // true
v.startsWith("quick", 4); // true
v.endsWith("fox"); // true
v.endsWith("quick", 9); // true
```

## charCodeAt / codePointAt

`charCodeAt(i)` returns the UTF-16 code unit at `i` (or `-1` if out of range);
`codePointAt(i)` decodes a surrogate pair into a full code point.

```ts
const v = str.from("a😀b");
v.charCodeAt(0); // 97
v.codePointAt(1); // 128512 (😀)
```

> The [`[]` operator](./comparison#indexing) is shorthand for `charCodeAt`.

## length / isEmpty

```ts
const v = str.from("hello");
v.length; // 5
v.isEmpty; // false
str.length("hello"); // 5 (free-function form)
```
