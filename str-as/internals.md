# Internals

A guided tour of how `str` is built, for contributors.

## The view

A `str` is three fields — `data: string` (the GC owner), and `start` / `end`
raw byte pointers into that string's UTF-16 data. A string object's pointer is
its char data (the header sits *before* it), so a sub-range can't recover its
owning object from `start` alone — hence `data` is stored explicitly, and its
store is what keeps the backing string alive (one GC write-barrier per view
construction).

## Single source of truth

Both the instance methods and the `str.*` free functions funnel through a set
of static `*Range` helpers (`sliceRange`, `charAtRange`, `startsWithRange`, …)
that operate on raw `(data, start, end)` bounds:

- An **instance** method passes `this.data, this.start, this.end`.
- A **free function** extracts bounds from its `string | str` argument with
  the `bData` / `bStart` / `bEnd` helpers (`isString<T>()` is resolved at compile
  time, so a `string` argument is read in place — no wrapper view is allocated).

The result: a view-producing op is exactly one allocation (the result), and a
query is zero.

## Accelerated primitives (`util.ts`)

- **`findUnit(start, end, needle)`** powers `indexOf` / `includes` /
  `lastIndexOf`. Three tiers behind `if (ASC_FEATURE_SIMD)`: a v128 lane search
  (`i16x8.eq` + `bitmask` + `ctz`), a SWAR Mycroft zero-detect over `u64` words,
  and a scalar tail. Multi-unit needles confirm the tail with `equalsBytes`.
- **`compare`** is the lexicographic ordering, with the same v128 / SWAR / scalar
  structure, locating the first differing lane.
- **`copyBytes` / `equalsBytes`** are size-tiered: a manual unrolled loop
  (v128 / u64 / scalar tail) for small/medium ranges, falling back to the
  `memory.copy` / `memory.compare` intrinsics above a threshold. The manual path
  wins on the many tiny copies/compares these string ops hit (e.g. a pad fill);
  the intrinsic wins on large blocks.

All wide loads are bounded by the remaining length (`p + block <= end`), so they
never read past the backing allocation — no scratch padding. UTF-16 data is
2-byte aligned; wider unaligned loads are well-defined in WebAssembly.

## Encoding

`str.UTF8` / `str.UTF16` delegate to
[`utf-as`](https://github.com/JairusSW/utf-as) using its pointer-based
(`*Unsafe`) entry points, so a view encodes straight from its range. UTF-8
sizing uses utf-as's `byteLengthUnsafe`; UTF-16 is a direct byte copy.

## Native parity & testing

Semantics mirror AssemblyScript's `String` (not JS) and are pinned by
**differential fuzzing**: random inputs are run through both `str` and the
native method, asserting byte-for-byte agreement. The suite runs under two
`as-test` modes — `simd` and `nosimd` — so the SWAR and SIMD kernels are each
validated against the same oracle.

One native bug surfaced this way: this `asc` version's `String#replaceAll`
corrupts the result for longer replacement strings, so `replace` / `replaceAll`
are implemented directly on the view and fuzzed against a trusted
`indexOf`/`slice`/`concat` reference instead.

## Source map

| File                         | Responsibility                                  |
| ---------------------------- | ----------------------------------------------- |
| `assembly/str.ts`        | the `str` class, namespace, operators       |
| `assembly/util.ts`           | `findUnit`, `compare`, `copyBytes`, `equalsBytes`, `materialize` |
| `assembly/__tests__/`        | spec suite (run under `simd` + `nosimd`)        |
| `assembly/__fuzz__/`         | differential fuzzers vs native `String`         |
| `assembly/__benches__/`      | `as-bench` microbenchmarks                       |
| `scripts/`                   | chart generation (`as-bench --json` → SVG/PNG)  |
