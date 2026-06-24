# Encoding & Statics

`str` matches `String`'s static surface: the `from*` constructors, the
`MAX_LENGTH` constant, and the `UTF8` / `UTF16` encoding namespaces.

## Constructors

```ts
str.from(s); // wrap a whole string as a zero-copy view
str.fromRange(s, start, end); // a view of a code-unit [start, end) range
new str(data, start, end); // from explicit byte pointers

str.fromCharCode(0x41); // "A"   (mirrors String.fromCharCode)
str.fromCharCodes([72, 105]); // "Hi"
str.fromCodePoint(0x1f600); // "😀"
```

`str.MAX_LENGTH` mirrors `String.MAX_LENGTH`.

## UTF-8 / UTF-16

`str.UTF8` and `str.UTF16` are a drop-in for `String.UTF8` /
`String.UTF16`, powered by [`utf-as`](https://github.com/JairusSW/utf-as)
(SWAR/SIMD, pointer-based). They run straight off the view's range — no
intermediate copy — and `decode` returns a `str`.

```ts
const v = str.slice("xx héllo 世界 xx", 3, 11); // "héllo 世界"

// UTF-16 — the view's bytes are already UTF-16
str.UTF16.byteLength(v); // bytes
const u16 = str.UTF16.encode(v); // ArrayBuffer
str.UTF16.decode(u16); // str round-trip
str.UTF16.validate(v); // well-formed UTF-16?

// UTF-8 — counted and encoded in place
str.UTF8.byteLength(v); // UTF-8 byte length of the view
const u8 = str.UTF8.encode(v); // ArrayBuffer of UTF-8 bytes
str.UTF8.decode(u8); // str round-trip
```

### Full surface

Both namespaces expose the standard library functions plus the utf-as extras:

| Function                              | UTF8 | UTF16 |
| ------------------------------------- | :--: | :---: |
| `byteLength(view, nullTerminated?)`   |  ✓   |   ✓   |
| `encode(view, …)`                     |  ✓   |   ✓   |
| `encodeUnsafe(ptr, len, buf, …)`      |  ✓   |   ✓   |
| `decode(buf, …)` → `str`          |  ✓   |   ✓   |
| `decodeUnsafe(ptr, len, …)` → `str` | ✓  |   ✓   |
| `validate(buf)` / `validate(view)`    |  ✓   |   ✓   |
| `utf16Length(buf)`                    |  ✓   |       |

The `*Unsafe` variants take raw pointers, identical to the stdlib signatures, so
existing UTF code ports over unchanged.
