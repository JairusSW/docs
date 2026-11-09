# Dynamic Types

Use `JSON.Value`, `JSON.Obj`, and `JSON.Arr` for unknown or open-ended shapes. Use `JSON.Raw` when you want to keep JSON text rather than materialize it.

## `JSON.Value`

A tagged value can hold null, a boolean, a number, a string, an array, an object, or a supported native value.

~~~ts
import { JSON } from "json-as";

const value = JSON.parse<JSON.Value>("7.5");
value.get<i32>(); // 7
value.get<f32>(); // 7.5
value.type; // JSON.Types.F64

const truth = JSON.Value.from<i32>(256);
truth.get<bool>(); // true
~~~

- `get<T>()` / `as<T>()` retrieve a typed value.
- `JSON.Value.from<T>(value)` boxes a native value.
- `type` exposes its `JSON.Types` tag.
- `JSON.Box.fromValue<T>(value)` returns a nullable numeric/bool box when a wrapper is needed.

Numeric getters convert numbers and booleans with AssemblyScript casts without allocating a wrapper. Boolean conversion is a comparison with zero, including values such as 256. Null produces zero/false. Strings and objects are not coerced to numbers. Narrowing and floating-point rounding follow native casts.

::: warning Wide integers
Parsed dynamic numeric tokens materialize as `f64`, which cannot represent every integer above 2^53 exactly. An untouched source-backed value may preserve its original text, so serialization alone can conceal a rounded materialized value. Use typed parsing or `Value.from<u64>()` / `set<u64>()` to preserve full-width integers. Converting a typed wide integer to `f64` can still round it.
:::

## `JSON.Obj`

An ordered dynamic JSON object. Parsed slots may remain deferred until accessed.

~~~ts
const object = JSON.parse<JSON.Obj>('{"a":1,"child":{"x":4}}');
object.keys(); // ["a", "child"]
object.getAs<i32>("a"); // 1
object.getAs<JSON.Obj>("child").getAs<i32>("x"); // 4

object.set<i32>("a", 5);
object.set<string>("name", "hi");
object.delete("name");
~~~

`get(key)` returns `JSON.Value | null`; `getAs<T>(key)` reads directly without allocating that intermediate wrapper. Typed `set<T>` preserves the stored numeric representation. Use `set` to replace a slot: changing a returned wrapper does not replace the slot itself.

`JSON.Obj.from(value)` converts supported object representations. Ordinary native Map conversion preserves typed slots and stored entries, including for undecorated subclasses; custom codecs retain their declared representation.

## `JSON.Arr`

A dynamic array with typed reads and Array-style operations:

~~~ts
const array = JSON.parse<JSON.Arr>('[1,{"n":2},null]');
array.getAs<i32>(0); // 1
array.getAs<JSON.Obj>(1).set<i32>("n", 3);
array.push<string>("tail");
array.set<bool>(0, true);
JSON.stringify(array); // '[true,{"n":3},null,"tail"]'
~~~

- `length`, `at(index)`, and `array[index]` provide ordinary access. `at` and indexing return a `JSON.Value` wrapper.
- `getAs<T>(index)` avoids the intermediate wrapper.
- `push<T>` and `set<T>` accept typed native or dynamic values.
- `slice`, `concat`, and `copyWithin` preserve nested reference sharing, regardless of whether a deferred element was read before copying.
- `JSON.Arr.from(value)` converts a supported array representation.

Deferred objects and arrays are materialized and cached on access. A shallow copy shares those nested objects: mutating one is visible through the other reference. Replacing a slot with `set` is independent of mutating the shared nested object.

## `JSON.Raw`

Keeps JSON text verbatim, including whitespace and number formatting.

~~~ts
const raw = JSON.parse<JSON.Raw>('{"x":1,  "y":2}');
JSON.stringify(raw); // '{"x":1,  "y":2}'
~~~

This is useful for forwarding an opaque value. Unlike a quoted `string`, Raw is emitted as JSON text. Also see [lazy fields](../guide/lazy-fields) for deferred typed access.

## Public helpers and tags

Both `json-as` and `json-as/assembly` export `JSON`, `JSONMode`, `toRaw`, `fromRaw`, and `toBox`.

`JSON.Types` includes `Null`, `Bool`, `String`, `Object`, `Array`, `Raw`, numeric tags `U8`–`U64`, `I8`–`I64`, `F32`, `F64`, and native representation tags such as `Map`, `Struct`, `TypedArray`, and `ArrayBuffer`.
