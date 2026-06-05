# Performance

`json-as` includes several performance-oriented implementations for strings and arrays:

- naive
- SWAR
- SIMD

## Enabling SIMD

Compile with:

```bash
asc assembly/index.ts --transform json-as --enable simd
```

## Fast generated struct deserialization

Generated fast struct deserialization is opt-in:

```bash
JSON_USE_FAST_PATH=1
```

Without that environment variable, the default path stays conservative.

## Lazy fields

Deferring fields with [`@lazy` / `JSON.Lazy<T>` / `@json({ lazy })`](/json-as/guide/lazy-fields) skips parsing the fields you don't read — the win grows with payload size, and round-tripping an untouched object just forwards its raw bytes:

![Deserialize: eager vs lazy by payload size](/json-as/bench/lazy-deserialize.svg)

![Round-trip: eager vs lazy by payload size](/json-as/bench/lazy-roundtrip.svg)

Lazy stays at or below eager across access patterns (read none / one / all / pass through), so the only real trade is module size under `lazy: "all"`. See the [Lazy Fields guide](/json-as/guide/lazy-fields) for the full picture.

## Benchmark commands

```bash
bun run bench:as medium --mode swar
bun run bench:as medium --mode simd
bun run bench:as str-deserialize --mode swar
bun run bench:as str-deserialize --mode simd
```

## Notes

- plain strings and escaped strings behave very differently
- SIMD wins more clearly on larger, regular payloads
- whole-object benchmarks and isolated string benchmarks can tell different stories
