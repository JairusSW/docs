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
