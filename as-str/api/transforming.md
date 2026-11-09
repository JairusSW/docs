# Transforming

These return an owned `string` (they can't be expressed as a sub-range), so they
allocate their result — but in a **single pass directly from the view**, with no
intermediate copy.

## concat

`concat(other)` joins the view with `other` (a `string` or a `str`).

```ts
str.from("foo").concat("bar"); // "foobar"
str.concat(str.slice("xxfoo", 2), "bar"); // "foobar"
```

The [`+` operator](./comparison#concatenation) does the same between two views,
returning a view over the fresh string.

## repeat

`repeat(count)` repeats the view `count` times.

```ts
str.from("ab").repeat(3); // "ababab"
```

## padStart / padEnd

`padStart(length, pad?)` / `padEnd(length, pad?)` pad to `length` code units with
`pad` (default `" "`), matching `String#padStart` / `String#padEnd` (the pad
string is repeated and truncated to fit).

```ts
str.from("7").padStart(3, "0"); // "007"
str.from("7").padEnd(3, "0"); // "700"
```

These build the pad fill directly from the view. See the
[performance guide](../performance) for workload-specific benchmarking.

## replace / replaceAll

`replace(search, replacement)` replaces the first occurrence; `replaceAll`
replaces every (non-overlapping, left-to-right) occurrence. Replacement is
literal (no `$` patterns), matching AssemblyScript's `String`.

```ts
str.from("a-b-c").replace("-", "+"); // "a+b-c"
str.from("a-b-c").replaceAll("-", "+"); // "a+b+c"
```

Both locate matches with the accelerated scan and assemble the native result
without first materializing the receiver. Performance depends on the inputs
and compiler version.

## toUpperCase / toLowerCase

Full-Unicode case mapping, delegated to AssemblyScript's `String` after reading
the view's range.

```ts
str.from("Hello, World").toUpperCase(); // "HELLO, WORLD"
str.toLowerCase("HeLLo"); // "hello"
```

## toString

`toString()` materializes the view into a fresh owned `string` — the canonical
"leave the view world" call.

```ts
str.slice("hello, world", 7).toString(); // "world"
```
