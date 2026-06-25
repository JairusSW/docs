# str8 — UTF-8 Views

`str8` is the **UTF-8 sibling of `str`**, for text that already lives as UTF-8
bytes — files, network frames, WASI, JSON — so you can slice, search, and trim
it **without first transcoding to UTF-16**.

Where `str` is a view into a UTF-16 `string`, a `str8` is a view into a UTF-8
`ArrayBuffer`: a reference to the backing buffer (so the GC keeps it alive) plus
a `[start, end)` pair of raw **byte** pointers. It is **byte-indexed**, following
Rust `&str` / Go `string`.

```ts
import { str8 } from "as-str";

const s = str8.from("héllo, 世界"); // string -> UTF-8 buffer (allocates once)
s.length; // 14 — BYTES (Rust .len() / Go len())
s.slice(0, 3).toString(); // "hé" — O(1) zero-copy byte slice
s.indexOf("llo"); // a byte offset (Go strings.Index / Rust .find)
```

`str8` is import-only — it is not injected by the [global-mode
transform](./getting-started#global-mode-optional).

## Construction

| Constructor                         | What it does                                                |
| ----------------------------------- | ----------------------------------------------------------- |
| `str8.from(s: string)`              | Transcode a UTF-16 `string` to a fresh UTF-8 buffer (allocates). |
| `str8.fromBuffer(buf)`              | Wrap an existing UTF-8 `ArrayBuffer` **zero-copy** (trusts the bytes). |
| `str8.fromBufferChecked(buf)`       | Same, but validates well-formed UTF-8 first (aborts otherwise). |
| `str8.fromRange(buf, start, end)`   | A view over a **byte** range of a buffer.                   |
| `str8.fromCodePoint` / `fromCharCode` | Build from code points / char codes (allocates).          |

```ts
const view = str8.fromBuffer(payload); // no copy — `payload` is already UTF-8
str8.fromBufferChecked(untrusted); // validate before trusting
```

## Byte-indexed

Every index is a **byte offset**. This is the one thing to internalize coming
from `str`:

```ts
const s = str8.from("héllo"); // bytes: 68 C3 A9 6C 6C 6F

s.length; // 6  — byte length, O(1)
s.codePointCount(); // 5  — Unicode scalars, O(n)
s.slice(0, 3).toString(); // "hé" — bytes [0,3), O(1) zero-copy
s.indexOf("llo"); // 3  — byte offset, not the char index 2
s[0]; // 104 — the raw byte (Go s[i])
s.byteAt(1); // 0xC3
s.codePointAt(1); // 0xE9 ('é'), decoded from the 2-byte sequence
s.isCharBoundary(1); // false — byte 1 is mid-codepoint (Rust is_char_boundary)
```

Because UTF-8 is self-synchronizing, `indexOf` / `includes` / `startsWith` /
`endsWith` / `equals` are all correct operating purely on bytes — a byte match
can never span a partial codepoint. And `compareTo` / `<` … `>=` use **byte
order**, which for UTF-8 is exactly Unicode **codepoint order** (matching
Rust/Go `Ord`).

## Same surface as `str`

`str8` mirrors `str`'s instance methods, mirrored static free-functions, and
operators — `slice`, `substring`, `substr`, `charAt`, `at`, `trim*`, `split`,
`indexOf`, `lastIndexOf`, `includes`, `startsWith`, `endsWith`, `equals`,
`compareTo`, `concat`, `repeat`, `padStart`, `padEnd`, `replace`, `replaceAll`,
`toUpperCase`, `toLowerCase`, and `==` / `!=` / `<` … / `+` / `[]`.

Inputs and needles accept a `string`, a `str8`, **or** an `ArrayBuffer`:

```ts
str8.slice(buf, 7); // first arg is a string | str8 | ArrayBuffer
v.indexOf(needleStr8); // needle is a string | str8 | ArrayBuffer
```

Allocating ops stay in the UTF-8 domain and return a `str8` (not a UTF-16
`string`); `toString()` is the escape hatch back to a native `string`. Beyond
`str`, `str8` adds the codepoint helpers `codePointCount()`, `byteAt(i)`,
`isCharBoundary(i)`, and a `byteLength` accessor.

## Encoding interop

`str8.UTF8` exposes the view's native bytes; `str8.UTF16` bridges to UTF-16:

```ts
str8.UTF8.byteLength(v); // the view's UTF-8 length (its storage)
str8.UTF8.encode(v); // owned ArrayBuffer copy of the bytes
str8.UTF8.validate(buf); // well-formed UTF-8?

str8.UTF16.encode(v); // ArrayBuffer of UTF-16 bytes
str8.UTF16.decode(buf); // UTF-16 buffer -> str8
```

## Converting anything: `str(x)` / `str8(x)`

`str` and `str8` are also **callable converters**. A view of the same type
passes through, a native `string` is wrapped/transcoded, and anything else with
a `toString()` (numbers, the other view type, your own classes) is stringified —
dispatched at compile time, so the unused arms are eliminated:

```ts
str(42).toString(); // "42"
str8("héllo").byteLength; // 6
str(someStr8); // str8 -> str  (UTF-16)
str8(someStr); // str  -> str8 (UTF-8)
```

The same bridge is available as methods on each view:

```ts
v.toStr8(); // str  -> str8 (UTF-8)
u.toStr(); // str8 -> str  (UTF-16)
```

## Caveats

- **`length` is bytes**, not characters. Use `codePointCount()` for the
  Unicode-scalar count (O(n); ASCII is O(1)).
- **Slicing cuts raw bytes**, Go-style — a cut at a non-boundary yields invalid
  UTF-8. Guard with `isCharBoundary(i)` when you need a valid boundary.
- **`fromBuffer` trusts its input.** Use `fromBufferChecked` for untrusted bytes;
  `from(string)` always produces valid (WTF-8) UTF-8.

## Performance

`str8` carries the same SWAR/SIMD scan tiers as `str` (`indexOf`, `compare`,
`equals`), plus a vectorized `codePointCount` and an ASCII fast path for
`toUpperCase` / `toLowerCase`. See [Performance](./performance) for the numbers.
