# Configuration

`json-as` is configured at **build time** through environment variables read by the transform — there's no runtime config object. Set them on the `asc` invocation (or your build script's env).

## `JSON_MODE`

Selects the scanning backend. All three produce identical results; they differ in speed and code size.

```bash
JSON_MODE=SWAR  asc … --transform json-as              # default
JSON_MODE=SIMD  asc … --transform json-as --enable simd
JSON_MODE=NAIVE asc … --transform json-as
```

- `SWAR` *(default)* — word-at-a-time. No extra flags.
- `SIMD` — 128-bit vector scanning; requires `--enable simd`.
- `NAIVE` — byte-at-a-time; smallest, slowest.

## `JSON_USE_FAST_PATH`

The transform generates an unrolled, key-template **fast path** for deserializing each struct, with a tolerant slow path as fallback. On by default; set to `0` to emit only the slow path (smaller code, slower parse).

```bash
JSON_USE_FAST_PATH=0 asc … --transform json-as
```

## `JSON_CACHE`

Enables an interned-string cache that speeds up string-heavy *serialization* by reusing repeated strings. Off by default. Pass a size to enable it — raw bytes, or units like `512kb`, `1mb`, `2MB`:

```bash
JSON_CACHE=1mb   asc … --transform json-as   # enable, 1 MB cache
JSON_CACHE=false asc … --transform json-as   # off (default)
```

## `JSON_STRICT`

Tightens parsing toward strict [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) — the generated object scanner rejects malformed key positions (unquoted/numeric keys, missing separators) instead of accepting them. The default build is lenient.

```bash
JSON_STRICT=true asc … --transform json-as
```

## `JSON_WRITE`

Writes the transformed source (your file with the generated `__SERIALIZE` / `__DESERIALIZE` methods spliced in) to `<path>.tmp.ts`, for inspecting generated code.

```bash
JSON_WRITE=assembly/index.ts asc assembly/index.ts --transform json-as
```

## In `asconfig.json`

The transform itself is registered in `asconfig.json`; the variables above are environment, so set them in the command or your build tooling:

```json
{
  "options": {
    "transform": ["json-as"]
  }
}
```

```bash
JSON_MODE=SIMD asc assembly/index.ts --config asconfig.json --enable simd
```
