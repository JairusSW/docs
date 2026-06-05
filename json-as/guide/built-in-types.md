# Built-in Types

`json-as` serializes and deserializes these out of the box — as fields of a `@json` class, or directly as the top-level type passed to `JSON.parse<T>` / `JSON.stringify`.

| Category | Types |
| --- | --- |
| Numbers | `i8`–`i64`, `u8`–`u64`, `f32`, `f64` |
| Boolean | `bool` |
| Text | `string` |
| Time | `Date` |
| Collections | `Array<T>`, `StaticArray<T>`, `Map<K, V>`, `Set<T>` |
| Binary | typed arrays (`Uint8Array`, `Float64Array`, …), `ArrayBuffer` |
| Dynamic | [`JSON.Value`, `JSON.Obj`, `JSON.Raw`](../reference/dynamic-types) |

## Primitives

Numbers and booleans map straight to JSON literals; strings are quoted and escaped.

```ts
import { JSON } from "json-as";

JSON.stringify<f64>(3.14); // '3.14'
JSON.stringify<i32[]>([1, -2, 300]); // '[1,-2,300]'
JSON.stringify(true); // 'true'
JSON.stringify('hi\n"x"'); // '"hi\\n\\"x\\""'
```

## `Date`

`Date` serializes to an ISO 8601 string and parses back from one.

```ts
@json
class Event {
  name: string = "";
  at: Date = new Date(0);
}

const e = JSON.parse<Event>('{"name":"launch","at":"2024-05-26T07:02:05.000Z"}');
JSON.stringify(e); // '{"name":"launch","at":"2024-05-26T07:02:05.000Z"}'
```

## Arrays

`Array<T>` and `StaticArray<T>` both serialize as JSON arrays.

```ts
JSON.parse<i32[]>("[1,2,3,4]"); // Array<i32>
JSON.stringify(JSON.parse<StaticArray<i32>>("[7,8,9]")); // '[7,8,9]'
```

Arrays nest freely — `Vec3[][]`, `string[]`, arrays of `@json` classes, and so on.

## `Map` and `Set`

A `Map` serializes to a JSON **object** (keys must be strings); a `Set` serializes to a JSON **array** (duplicates collapse on parse).

```ts
const m = JSON.parse<Map<string, i32>>('{"a":1,"b":2}');
JSON.stringify(m); // '{"a":1,"b":2}'

const s = JSON.parse<Set<i32>>("[1,2,3,2]");
JSON.stringify(s); // '[1,2,3]'
```

## Typed arrays and `ArrayBuffer`

Typed arrays serialize as JSON arrays of numbers and parse back element-for-element.

```ts
const bytes = JSON.parse<Uint8Array>("[10,20,30,40]");
JSON.stringify(bytes); // '[10,20,30,40]'
```

`ArrayBuffer` is supported through the same generic API:

```ts
const view = new Uint8Array(3);
view[0] = 1;
view[1] = 2;
view[2] = 3;

const encoded = JSON.stringify<ArrayBuffer>(view.buffer); // '[1,2,3]'
const decoded = JSON.parse<ArrayBuffer>(encoded);
decoded.byteLength; // 3
```

## Dynamic values

When a field's type isn't known up front, use [`JSON.Value`, `JSON.Obj`, or `JSON.Raw`](../reference/dynamic-types). They can also hold built-in collections, typed arrays, and `ArrayBuffer`, and re-serialize them faithfully.
