# Dynamic Types

## `JSON.Value`

`JSON.Value` stores a dynamically typed JSON value.

Use it for:

- mixed-type arrays
- partially dynamic object fields
- unknown payloads that still need runtime inspection

Examples:

```ts
const values = JSON.parse<JSON.Value[]>('["string", true, 3.14, {"x":1}]');
const object = JSON.parse<JSON.Value>('{"x":1,"y":[2,3]}');
```

## `JSON.Obj`

`JSON.Obj` is a dynamic object container.

Examples:

```ts
const obj = JSON.parse<JSON.Obj>('{"a":1,"b":[2,3],"c":{"x":4}}');
const x = obj.get("c")!.get<JSON.Obj>().get("x")!.get<f64>();
```

## `JSON.Raw`

`JSON.Raw` preserves raw JSON text instead of eagerly deserializing it.
