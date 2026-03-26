# Built-in Types

`json-as` supports these categories directly:

- `string`
- integer and float primitives
- `bool`
- `Date`
- `Array<T>`
- `StaticArray<T>`
- `Map<K, V>`
- `Set<T>`
- `JSON.Value`
- `JSON.Obj`
- `JSON.Raw`
- typed arrays
- `ArrayBuffer`

## Typed arrays

Typed arrays serialize as JSON arrays of numbers:

```ts
const bytes = new Uint8Array(4);
bytes[0] = 10;
bytes[1] = 20;
bytes[2] = 30;
bytes[3] = 40;

JSON.stringify(bytes); // [10,20,30,40]
```

They also deserialize directly:

```ts
const parsed = JSON.parse<Uint8Array>("[10,20,30,40]");
```

## ArrayBuffer

`ArrayBuffer` is supported directly through the normal generic API:

```ts
const encoded = JSON.stringify<ArrayBuffer>(buffer);
const decoded = JSON.parse<ArrayBuffer>(encoded);
```

## Dynamic containers

`JSON.Value` can also hold and re-serialize built-in typed arrays and `ArrayBuffer`.
