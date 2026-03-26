# Getting Started

## Installation

```bash
npm install json-as
```

Use the transform when compiling:

```bash
asc assembly/index.ts --transform json-as
```

Optional performance flags:

```bash
asc assembly/index.ts --transform json-as --enable simd
```

Or configure it in `asconfig.json`:

```json
{
  "options": {
    "transform": ["json-as"]
  }
}
```

If you want to inspect generated code during development:

```bash
JSON_WRITE=assembly/test.ts asc assembly/test.ts --transform ./transform
```

## First Example

```ts
import { JSON } from "json-as";

@json
class Vec3 {
  x: f32 = 0.0;
  y: f32 = 0.0;
  z: f32 = 0.0;
}

const input = '{"x":1.5,"y":2.5,"z":3.5}';
const parsed = JSON.parse<Vec3>(input);
const encoded = JSON.stringify(parsed);
```

## What `@json` does

`json-as` is transform-driven. The `@json` decorator tells the transform to generate serialization and deserialization methods for the class.

That gives you:

- typed object parsing with `JSON.parse<T>(...)`
- typed serialization with `JSON.stringify(...)`
- field-level handling for nested classes, arrays, maps, sets, and strings

For dynamic or unknown JSON, use `JSON.Value` or `JSON.Obj` instead of `@json`.
