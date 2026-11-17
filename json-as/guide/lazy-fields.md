# Lazy Parsing

In 2.1, **lazy** means compile-time access specialization. The transform decodes fields the program needs and scans past supported fields it can prove are unused. It does not add deferred getters or retain source ranges for typed fields.

```ts
import { JSON } from "json-as";

@json({ lazy })
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

At this local parse site, the transform can decode `x` and scan past `y` and `label`. `@json` and `@json({ lazy: true })` select the same default behavior.

## Full reads and uncertain uses

If all fields are needed, the reader keeps eager behavior. Returning the object, passing it to unknown code, serializing it whole, or encountering uncertain bindings retains every field that could be observed. Observable initializer and custom-codec effects must still run. Analysis budgets fall back conservatively.

This is a compile-time optimization, not a guarantee that every partial read specializes. Arrays retain their native representation and are never given deferred field accessors.

## Eager controls

```ts
@json({ nolazy })
class EagerPoint {
  x: f32 = 0;
  y: f32 = 0;
}
```

`@json({ nolazy })` and `@json({ lazy: false })` disable specialization for the class and its descendants. Use them for eager benchmark controls. `lazy` and `nolazy` are ambient shorthand names; they need no imports.

Set `JSON_LAZY=false` in the compiler environment for a build-wide eager control. Strict validation and fast-reader tiers are independent settings.

## Serialization

`JSON.stringify` observes every field it emits. A parsed object that is serialized whole therefore retains those fields; its writer encodes their current values, including assignments and nested mutations. Typed fields have no saved source range to forward, and serialization does not cache the complete output string.

Dynamic `JSON.Value`, `JSON.Obj`, and `JSON.Arr` retain their existing deferred representation. That is a separate dynamic-data API; see [Dynamic types](../reference/dynamic-types).

## Migrating deferred-field code

Replace `JSON.Lazy<T>` with `T` and remove instance-field `@lazy` and `@eager` decorators. Replace string class modes (`"auto"`, `"all"`, `"none"`, `"strategic"`) with `{ lazy }` or `{ nolazy }`. Replace the old specialization/strategy flags with `JSON_LAZY`.

Fields are now decoded during parsing when observable, so custom-codec work no longer waits for first access. Code that relied on first-read timing or raw typed-field forwarding must use the eager typed behavior or explicitly handle dynamic/raw JSON.

AssemblyScript's built-in `@lazy` for module/static initialization is unaffected.
