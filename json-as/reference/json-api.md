# JSON API

```ts
import { JSON } from "json-as";
```

The same API is available from `json-as/assembly`. Enable `--transform json-as` when compiling models decorated with `@json`.

## `JSON.parse<T>(text, out?)`

Parse a JSON string into `T`. Application models use `@json`; supported native and dynamic types do not need a decorator.

```ts
@json
class Point {
  x: i32 = 0;
  y: i32 = 0;
}

const point = JSON.parse<Point>('{"x":3,"y":4}');
const reused = JSON.parse<Point>('{"x":5,"y":6}', point);
```

Always retain the returned value. Reuse is an optimization, and a destination or its nested storage can be replaced. Missing optional members restore their declared defaults rather than retaining a previous document's values.

Lazy parsing is enabled by default. Eligible local calls decode fields the program needs and scan past fields proven unused. Full reads, serialization, escaping objects, effects, and uncertain uses keep conservative eager behavior. This adds no deferred getters or typed-field source ranges. Use `@json({ nolazy })` or `JSON_LAZY=false` for eager controls; see [Lazy parsing](../guide/lazy-fields).

Compatibility parsing is the default. Set `JSON_STRICT=true` at compilation for complete syntax and target-type checks. Disabling lazy parsing does not enable validation; the two options are independent.

## `JSON.stringify(value, out?)`

Serialize the current value to an owning JSON string. The type is inferred, or you can supply it explicitly.

```ts
const point = new Point();
point.x = 3;
point.y = 4;

let text = JSON.stringify(point); // '{"x":3,"y":4}'
point.x = 9;
text = JSON.stringify(point, text); // '{"x":9,"y":4}'
```

Whole-object serialization observes every field it emits, so lazy parsing retains those fields. Assignments and nested mutations are reflected in output. Typed objects have no saved field ranges to forward and no cache of the full serialized string.

With an explicit output destination, eligible heap storage can be reused. Static strings and destinations that cannot be reused safely receive writable replacement storage. Always assign the returned string.

Dynamic and raw values have their own source-backed behavior; see [Dynamic types](./dynamic-types).

## `JSON.validate(text)`

Return whether a string contains one complete syntactically valid JSON value, without constructing its typed representation. This works independently of `JSON_STRICT`.

```ts
JSON.validate('{"x":3}'); // true
JSON.validate('{"x":}'); // false
JSON.validate('1 2'); // false: two top-level values
```

Validation does not compare data against a class schema. For example, `{"x":"wrong"}` is valid JSON syntax even when an application's `x` field is an integer. Use strict typed parsing for that check.

## Public types and internal helpers

`JSON.Value`, `JSON.Obj`, `JSON.Arr`, `JSON.Raw`, and `JSON.Box<T>` support dynamic data and nullable primitives. `JSON.Types` provides dynamic tags; `JSON.Memory` exposes buffer management.

Helpers such as `__cursorSkipNative`, along with internal namespaces, are intentionally hidden from TypeScript completions. Generated AssemblyScript code still calls them directly. Removing explicit namespace exports does not remove reachable calls: optimized `-O3` regression tests check their behavior. Unused helpers remain eligible for dead-code elimination.

Use the public entry points in application code. Generated helper names are implementation details, not a stable API.
