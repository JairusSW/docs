# Built-in Subclasses

Subclassing behavior is split into two cases.

## Undecorated subclasses

Undecorated subclasses of built-in container types keep built-in JSON behavior.

Examples:

- `class MyBytes extends Uint8Array {}`
- `class MyMap extends Map<string, i32> {}`
- `class MySet extends Set<string> {}`
- `class MyArray extends Array<i32> {}`

These still serialize and deserialize like their built-in bases.

## Decorated subclasses

If you decorate the subclass with `@json`, it is treated like any other generated class.

That means:

- generated `__SERIALIZE` / `__DESERIALIZE` methods are created
- inherited public fields can become part of the schema
- custom `@serializer(...)` / `@deserializer(...)` hooks can override the wire format

For built-in subclasses, this means inherited fields from the base type may become visible in JSON. If that is not what you want, explicitly mark them with `@omit`.

## Example

```ts
@json
class GeneratedBytes extends Uint8Array {
  constructor(length: i32 = 0) {
    super(length);
  }
}
```

This is different from an undecorated `Uint8Array` subclass. It participates in transform-generated class serialization.
