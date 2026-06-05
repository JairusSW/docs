# json-as

Fast, type-safe JSON for [AssemblyScript](https://www.assemblyscript.org/).

[GitHub](https://github.com/JairusSW/json-as) · [npm](https://www.npmjs.com/package/json-as) — `npm install json-as`

`json-as` is a compiler **transform**: mark a class `@json` and it generates specialized serialize/deserialize code at build time. No runtime reflection, no hand-written schemas — just `JSON.parse<T>` and `JSON.stringify`, reaching multi-GB/s throughput with SIMD/SWAR scanning.

```ts
import { JSON } from "json-as";

@json
class Vec3 {
  x: f32 = 0;
  y: f32 = 0;
  z: f32 = 0;
}

const v = JSON.parse<Vec3>('{"x":1.5,"y":2.5,"z":3.5}');
JSON.stringify(v); // '{"x":1.5,"y":2.5,"z":3.5}'
```

## Highlights

- **Typed** — `JSON.parse<T>` / `JSON.stringify` over your own `@json` classes, nested to any depth.
- **Batteries included** — strings, all number types, `bool`, `Date`, arrays, `Map`, `Set`, typed arrays, `ArrayBuffer`.
- **Dynamic when you need it** — `JSON.Value`, `JSON.Obj`, and `JSON.Raw` for unknown or open-ended shapes.
- **Lazy fields** — defer parsing of fields you rarely read; untouched fields pass through their raw bytes on serialize.
- **Custom formats** — `@serializer` / `@deserializer` for compact or bespoke wire formats.
- **Fast** — three interchangeable scanning modes (SWAR, SIMD, NAIVE) selected at build time.

## Guide

- [Getting Started](./guide/getting-started) — install, enable the transform, first round-trip
- [Basic Usage](./guide/basic-usage) — fields, nesting, aliases, optional fields, nullability
- [Built-in Types](./guide/built-in-types) — dates, collections, typed arrays
- [Custom Serialization](./guide/custom-serialization) — `@serializer` / `@deserializer`
- [Built-in Subclasses](./guide/built-in-subclasses) — subclassing `Array`, `Map`, typed arrays
- [Lazy Fields](./guide/lazy-fields) — on-demand field parsing
- [Performance](./guide/performance) — modes, the fast path, and benchmarks

## Reference

- [Decorators](./reference/decorators) — every decorator in one place
- [Dynamic Types](./reference/dynamic-types) — `JSON.Value` / `JSON.Obj` / `JSON.Raw`
- [Configuration](./reference/customization) — build-time `JSON_*` environment variables
- [Runtime Behavior](./reference/runtime-behavior) — the shared buffer, `JSON.internal`, `JSON.Memory`

## Deep Dive

How the interesting parts actually work:

- [Generated Code & the Fast Path](./deep-dive/codegen) — what `@json` compiles to
- [The Lazy Slot](./deep-dive/lazy-slot) — the packed `u64` behind lazy fields
- [The Serialization Buffer](./deep-dive/buffer) — zero-copy, zero-alloc round-trips

Testing your AssemblyScript too? See [as-test](/as-test/).
