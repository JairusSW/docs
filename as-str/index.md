# str

`str` gives AssemblyScript **virtual, zero-copy strings**.

A `str` is a *view* into an existing `string`: a reference to the backing
string (so the GC keeps it alive) plus a `[start, end)` pair of raw byte
pointers into that data. Slicing, trimming, and searching just move the two
pointers — **no characters are copied** until you ask for a real `string` back
with `.toString()`.

It ships as a single class with the **full native `String` surface**, so it
reads like `string` but allocates only at the boundary where you actually need
an owned string.

```ts
import { str } from "as-str";

const real: string = "GET /index.html 200 1043";
const method = str.slice(real, 0, 3); // "GET" — a view, no allocation
method.toString(); // "GET" — materialized on demand
```

## What you get

- **Views** — `slice`, `substring`, `substr`, `trim*`, `charAt`, `at`, and
  `split` return another `str`; the backing bytes are never copied.
- **The full `String` surface** — every native method, as both instance methods
  (`v.indexOf(…)`) and free functions (`str.indexOf(s, …)`).
- **Operators** — `==`, `!=`, `<`, `<=`, `>`, `>=`, `+`, and `v[i]` indexing.
- **Accelerated scans** — `indexOf` / `includes` / `compare` run SWAR by default
  and SIMD when compiled with `--enable simd`.
- **Encoding** — `str.UTF8` / `str.UTF16`, a drop-in for
  `String.UTF8` / `String.UTF16`, running off the view's pointer range.
- **GC-safe** — a view keeps its backing string reachable; chains of views
  anchor to the original, never to intermediates.
- **[`str8`](./str8)** — a byte-indexed UTF-8 sibling (Rust/Go model) for data
  that is already UTF-8, plus callable `str(x)` / `str8(x)` converters.

## Start here

1. [Getting Started](./getting-started) — install and create your first view.
2. [The View Model](./views) — how a `str` works and when bytes are copied.
3. [str8 (UTF-8)](./str8) — the byte-indexed UTF-8 view, and the converters.
4. [API](./api/) — slicing, searching, transforming, comparison, encoding.
5. [Performance](./performance) — SWAR/SIMD, and the numbers.
6. [Internals](./internals) — the design, for contributors.

## When to reach for it

Reach for `str` when you are **tokenizing, parsing, or walking** a large
string and the intermediate `slice`/`substring`/`trim` copies dominate — a
log-line splitter, a CSV/columnar reader, a protocol parser. You carry cheap
windows into the original data and pay for a single copy only at the edge where
an owned `string` leaves your code.

If you need fast JSON for AssemblyScript, see [json-as](/json-as/); for testing
your code, [as-test](/as-test/).
