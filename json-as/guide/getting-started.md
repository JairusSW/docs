# Getting Started

`json-as` is a JSON serializer and deserializer for [AssemblyScript](https://www.assemblyscript.org/). It runs as a compiler **transform**: the `@json` decorator tells it to generate specialized `parse`/`stringify` code for your classes at build time, so there is no runtime reflection and no schema to maintain by hand.

## Installation

```bash
npm install json-as
```

`json-as` ships the runtime library and the transform together. Install the compiler in your application too:

~~~bash
npm install --save-dev assemblyscript@^0.28.18
~~~

These docs target the **2.0.0 candidate**; npm currently serves 1.6.3. Until 2.0 is published, build and pack the candidate repository, then install its tarball:

~~~bash
# In the json-as checkout:
npm ci
npm run build:transform
npm pack

# In your consumer:
npm install /absolute/path/to/json-as/json-as-2.0.0.tgz
# Or: pnpm add /absolute/path/to/json-as/json-as-2.0.0.tgz
~~~

The 2.0 artifact declares AssemblyScript as a peer and bundles its formatter dependency. pnpm does not need a direct `xjb-as` dependency or a hoisting workaround. See [Upgrading to 2.0](./upgrading-to-2).

## Enabling the transform

Point `asc` at the transform when you compile. The simplest way is the CLI flag:

```bash
asc assembly/index.ts --transform json-as
```

Or, more commonly, set it once in your `asconfig.json`:

```json
{
  "options": {
    "transform": ["json-as"]
  }
}
```

Now every `@json`-decorated class in your project gets serialization code generated for it.

## Your first round-trip

```ts
import { JSON } from "json-as";

@json
class Vec3 {
  x: f32 = 0.0;
  y: f32 = 0.0;
  z: f32 = 0.0;
}

// Parse JSON text into a typed instance
const v = JSON.parse<Vec3>('{"x":1.5,"y":2.5,"z":3.5}');
v.x; // 1.5

// Serialize a typed instance back to JSON text
JSON.stringify(v); // '{"x":1.5,"y":2.5,"z":3.5}'
JSON.stringify(new Vec3()); // '{"x":0.0,"y":0.0,"z":0.0}'
```

`JSON.parse<T>` needs the target type so the transform knows which generated parser to call. `JSON.stringify` infers it from the argument.

## What `@json` generates

The decorator is the whole API surface for your own types. For each `@json` class the transform emits:

- a **serializer** used by `JSON.stringify`,
- a **deserializer** used by `JSON.parse<T>`,
- field handling for nested `@json` classes, arrays, maps, sets, strings, and every [built-in type](./built-in-types).

Because it's all generated at compile time, parsing and serializing are direct, monomorphized code paths — not a generic interpreter walking a schema.

For JSON whose shape you don't know ahead of time, reach for [`JSON.Value` / `JSON.Obj`](../reference/dynamic-types) instead of a decorated class.

## Choosing a scanning mode

`json-as` has three interchangeable scanning backends, selected at build time with the `JSON_MODE` environment variable:

```bash
JSON_MODE=SWAR  asc assembly/index.ts --transform json-as              # default
JSON_MODE=SIMD  asc assembly/index.ts --transform json-as --enable simd
JSON_MODE=NAIVE asc assembly/index.ts --transform json-as
```

- **`SWAR`** — word-at-a-time scanning, selected by default when SIMD is not enabled.
- **`SIMD`** — 128-bit vector scanning; requires `--enable simd` and is selected automatically when that feature is enabled.
- **`NAIVE`** — code-unit-at-a-time scanning.

Measure your workload: speed and code size depend on the schema and payload.

All three produce identical results — only throughput and code size differ. See [Performance](./performance) for the numbers.

## Inspecting generated code

While developing, you can dump the transformed source (your file with the generated methods spliced in) to a `.tmp.ts` next to it:

```bash
JSON_WRITE=assembly/index.ts asc assembly/index.ts --transform json-as
```

## Next steps

- [Basic Usage](./basic-usage) — fields, nesting, optional fields, nullability
- [Built-in Types](./built-in-types) — arrays, maps, sets, dates, typed arrays
- [Lazy Fields](./lazy-fields) — defer parsing of fields you rarely read
- [Decorators](../reference/decorators) — the full decorator reference
