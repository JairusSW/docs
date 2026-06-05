# Custom Serialization

Sometimes a type should have its own wire format instead of the generated object form — a compact string, a backward-compatible layout, or a custom encoding for a built-in container. Add a `@serializer` / `@deserializer` pair to take over both directions.

## The contract

- The **serializer** receives the instance and must return a **valid JSON string**.
- The **deserializer** receives the raw JSON string and must return a **fresh instance** (never mutate or assume a reused one).
- The optional decorator argument declares the JSON *shape* the type maps to. It defaults to `"any"`; a narrower hint (`"string"`, `"number"`, …) lets the transform generate tighter surrounding code.

Shape hints: `"any"`, `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`, `"null"`, and nullable forms like `"string | null"`.

## Example: a point as `"x,y"`

```ts
import { JSON } from "json-as";

@json
class Point {
  x: f64 = 0;
  y: f64 = 0;
  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }

  // Serialize the whole instance to a single JSON string.
  @serializer("string")
  serializer(self: Point): string {
    return JSON.stringify(`${self.x},${self.y}`);
  }

  // ...and back. Always return a new instance.
  @deserializer("string")
  deserializer(data: string): Point {
    const raw = JSON.parse<string>(data);
    const c = raw.indexOf(",");
    return new Point(f64.parse(raw.slice(0, c)), f64.parse(raw.slice(c + 1)));
  }
}

JSON.stringify(new Point(3.5, -9.2)); // '"3.5,-9.2"'
const p = JSON.parse<Point>('"3.5,-9.2"');
p.x; // 3.5
```

A type with a custom format works anywhere a normal `@json` type does — including as a field of another class:

```ts
@json
class Shape {
  name: string = "";
  origin: Point = new Point();
}

JSON.stringify(JSON.parse<Shape>('{"name":"s","origin":"1,2"}'));
// '{"name":"s","origin":"1.0,2.0"}'
```

## Calling `parse` / `stringify` inside

Notice the serializer above calls `JSON.stringify(...)` and the deserializer calls `JSON.parse<string>(...)`. That's fine and encouraged — the transform rewrites those nested calls to [`JSON.internal.stringify` / `JSON.internal.parse`](../reference/runtime-behavior#json-internal) so they don't clobber the shared buffer state of the outer (de)serialize that invoked them.

## Built-in container subclasses

The most common use is giving a subclass of a built-in container a compact representation — e.g. a `Uint8Array` as a hex string, an `Array<i32>` as CSV, or a `Map`/`Set` as tagged text. See [Built-in Subclasses](./built-in-subclasses) for how decorating a subclass works.

::: warning Not combinable with lazy fields
A class with a custom `@serializer`/`@deserializer` can't also use [lazy fields](./lazy-fields) — the custom methods replace the generated (de)serializer that the lazy slots rely on, so the transform reports an error. (A field whose *type* has a custom serializer is fine.)
:::
