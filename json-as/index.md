# json-as 2.1

Type-safe JSON for [AssemblyScript](https://www.assemblyscript.org/), compiled for your models.

Mark a class with `@json`, enable the compiler transform, and use `JSON.parse<T>` and `JSON.stringify`. The transform generates readers and writers at build time; your application needs no runtime schema or reflection.

```ts
import { JSON } from "json-as";

@json
class Point {
  x: f32 = 0;
  y: f32 = 0;
  label: string = "";
}

function readX(input: string): f32 {
  const point = JSON.parse<Point>(input);
  return point.x;
}
```

Lazy parsing is enabled by default in 2.1. Visible parse sites can skip decoding fields proven unused. Here, the reader can scan past `y` and `label` while decoding `x`. Full reads and uncertain uses retain eager behavior. This optimization creates no lazy getters or saved source ranges for ordinary fields.

::: info Version
These docs cover 2.1.0. For installation before its npm publication, use the [packed-source instructions](./guide/getting-started#trying-210-before-publication). The [upgrade guide](./guide/upgrading-to-2-1) covers the changes from 2.0.
:::

## Start here

- [Getting started](./guide/getting-started) — installation, compiler setup, and a first round-trip.
- [Upgrading to 2.1](./guide/upgrading-to-2-1) — one lazy API, eager controls, and migration from deferred fields.
- [Basic usage](./guide/basic-usage) — fields, aliases, defaults, nullability, and reuse.
- [Built-in types](./guide/built-in-types) — strings, numbers, dates, arrays, maps, sets, and buffers.
- [Lazy parsing](./guide/lazy-fields) — compile-time field selection and eager controls.
- [Custom serialization](./guide/custom-serialization) — custom wire formats.
- [Built-in subclasses](./guide/built-in-subclasses) — native collection semantics.
- [Performance](./guide/performance) — 2.1 charts and measurement conditions.

## Reference

- [JSON API](./reference/json-api): `parse`, `stringify`, and `validate`.

- [Decorators](./reference/decorators)
- [Dynamic types](./reference/dynamic-types): `JSON.Value`, `JSON.Obj`, `JSON.Arr`, and `JSON.Raw`.
- [Configuration](./reference/customization): compile-time options.
- [Runtime behavior](./reference/runtime-behavior): output ownership, reuse, and nested operations.

## Implementation

- [Generated readers and writers](./deep-dive/codegen)
- [SWAR and SIMD scanning](./deep-dive/scanning)
- [Lazy parsing migration](./deep-dive/lazy-slot)
- [The serialization buffer](./deep-dive/buffer)

Upgrading from 1.x? Read the [2.0 migration notes](./guide/upgrading-to-2) too.

[GitHub](https://github.com/JairusSW/json-as) · [npm](https://www.npmjs.com/package/json-as) · [MPL-2.0 license](https://github.com/JairusSW/json-as/blob/main/LICENSE)
