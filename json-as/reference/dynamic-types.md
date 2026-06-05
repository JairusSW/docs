# Dynamic Types

When you don't have a fixed schema — mixed-type arrays, open-ended objects, or payloads you only need to inspect at runtime — use one of the three dynamic types instead of a `@json` class.

## `JSON.Value`

`JSON.Value` is a tagged, dynamically-typed JSON value. It can hold a null, boolean, number, string, array, or object, and re-serialize faithfully.

```ts
import { JSON } from "json-as";

const arr = JSON.parse<JSON.Value[]>('["hi",true,3.14,{"x":1}]');

arr[0].get<string>(); // "hi"
arr[1].type; // JSON.Types.Bool

JSON.stringify(arr); // '["hi",true,3.14,{"x":1.0}]'
```

- **`value.get<T>()`** reads the value as a concrete type `T`.
- **`value.type`** is one of the [`JSON.Types`](#json-types) tags, for branching on what's inside.
- **`JSON.Value.from<T>(x)`** wraps a concrete value.

::: warning Numbers are `f64`
A parsed `JSON.Value` stores every number as `f64`, so the integer `1` round-trips as `1.0` (see the array above). Read it back with `get<i32>()` etc. if you need an integer; the float form only shows up when you re-serialize a parsed dynamic value. (Values you set explicitly with a typed `set<i32>` keep their integer form — see below.)
:::

## `JSON.Obj`

`JSON.Obj` is a dynamic, ordered key/value map — a JSON object you build or inspect at runtime. Values are `JSON.Value`s.

```ts
const obj = JSON.parse<JSON.Obj>('{"a":1,"b":[2,3],"c":{"x":4}}');

obj.keys(); // ["a", "b", "c"]
obj.get("a")!.get<f64>(); // 1.0

// `get` returns a JSON.Value, so you can descend into nested objects:
obj.get("c")!.get<JSON.Obj>().get("x")!.get<f64>(); // 4.0
```

`get(key)` returns `JSON.Value | null` (hence the `!`). Build one up imperatively with `set` — typed `set<T>` preserves the value's type, so integers stay integers:

```ts
const o = new JSON.Obj();
o.set<i32>("n", 5);
o.set<string>("s", "hi");
o.delete("n"); // bool — true if the key existed

JSON.stringify(o); // '{"s":"hi"}'
```

## `JSON.Raw`

`JSON.Raw` holds a slice of JSON **text verbatim**. It isn't parsed into a structure — on serialize it's written back exactly as received, whitespace and number formatting included. Use it to pass a value through untouched, or to defer parsing entirely.

```ts
const raw = JSON.parse<JSON.Raw>('{"x":1,  "y":2}');
JSON.stringify(raw); // '{"x":1,  "y":2}'  — byte-for-byte
```

As a field type it's handy for "store this blob, I'll deal with it later" — and for deferring parse of *one* field while everything else stays typed, see also [Lazy Fields](../guide/lazy-fields).

## `JSON.Types`

`value.type` returns one of these `u16` tags:

`Null`, `Bool`, `String`, `Object`, `Array`, `Raw`, `U8`–`U64`, `I8`–`I64`, `F32`, `F64`, `Map`, `Struct`, `TypedArray`, `ArrayBuffer` — accessed as `JSON.Types.Bool`, `JSON.Types.String`, and so on.
