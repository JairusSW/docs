# Configuration

Options are read by the transform **for each compiler invocation**. Set them in the environment of `asc` or your build script; they are not a runtime configuration object.

## `JSON_MODE`

Selects NAIVE (code-unit scanning), SWAR (word-at-a-time), or SIMD (128-bit vectors). The backends implement the same JSON behavior.

~~~bash
JSON_MODE=SWAR asc assembly/index.ts --transform json-as
JSON_MODE=SIMD asc assembly/index.ts --transform json-as --enable simd
JSON_MODE=NAIVE asc assembly/index.ts --transform json-as
~~~

Without an override, a compiler program with SIMD enabled selects SIMD; otherwise it selects SWAR. SIMD needs `--enable simd`. Measure your workload rather than assuming one backend always wins.

## `JSON_USE_FAST_PATH`

Enabled by default. Generates specialized struct readers with packed-key matching, whitespace support, and a keyed fallback where the schema permits it. Each invocation starts at tier 1 and can only tier down during that parse. Generic or effectful schemas may use more conservative readers.

~~~bash
JSON_USE_FAST_PATH=0 asc assembly/index.ts --transform json-as
~~~

Disabling it removes the generated fast paths; it does not disable strict checking when `JSON_STRICT=true`.

## `JSON_STRICT`

Defaults to false (compatibility parsing). Set exactly `true` to enable checked RFC 8259 parsing. Strict fresh and reused destinations reject incompatible typed-field value kinds consistently. Compatibility mode is intended for known, correctly typed JSON; use strict mode when validating input is required.

~~~bash
JSON_STRICT=true asc assembly/index.ts --transform json-as
~~~

Strict parsing uses checked typed cursors where supported, with validated fallback paths for other routes.

## `JSON_DIAGNOSTICS`

Enabled by default. Set to `false` (or `0`) to replace library and generated-reader failure diagnostics with `unreachable()` traps.

~~~bash
JSON_DIAGNOSTICS=false asc assembly/index.ts --transform json-as
~~~

This changes failure reporting, **not validation policy**. It avoids constructing library error messages on those paths; it does not make invalid input valid. User callbacks, defaults, and their errors are preserved. Keep diagnostics enabled when investigating a parsing problem.

## `JSON_CACHE`

Experimental interned-string serialization cache. Off by default. `true` enables the default 1 MiB size; a numeric value selects bytes. Units distinguish bits (`b`) from bytes (`B`).

~~~bash
JSON_CACHE=1048576 asc assembly/index.ts --transform json-as # exactly 1 MiB
JSON_CACHE=1MB asc assembly/index.ts --transform json-as     # 1,000,000 bytes
JSON_CACHE=1mb asc assembly/index.ts --transform json-as     # 125,000 bytes
JSON_CACHE=false asc assembly/index.ts --transform json-as  # off
~~~

Benchmark with caching disabled when comparing fresh serialization work.

## `JSON_WRITE` and `JSON_DEBUG`

Write the transformed source for a selected file:

~~~bash
JSON_WRITE=assembly/index.ts asc assembly/index.ts --transform json-as
~~~

The output is `assembly/index.ts.tmp.ts`. Use `JSON_DEBUG=true` for transform debug output; `DEBUG=true` is not the json-as flag.

## In `asconfig.json`

Register the transform in the compiler config, and supply environment options on the command:

~~~json
{
  "options": {
    "transform": ["json-as"]
  }
}
~~~

~~~bash
JSON_STRICT=true asc assembly/index.ts --config asconfig.json
~~~
