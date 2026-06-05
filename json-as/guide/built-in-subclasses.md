# Built-in Subclasses

You can subclass built-in containers like `Array`, `Map`, `Set`, `Uint8Array`, and the other typed arrays. How they serialize depends on whether you decorate the subclass.

## Undecorated: keeps built-in behavior

An undecorated subclass serializes and deserializes exactly like its base type — a named `Uint8Array` is still a JSON array of bytes.

```ts
import { JSON } from "json-as";

class MyBytes extends Uint8Array {
  constructor(length: i32 = 0) {
    super(length);
  }
}

const mb = new MyBytes(3);
mb[0] = 1;
mb[1] = 2;
mb[2] = 3;

JSON.stringify<MyBytes>(mb); // '[1,2,3]'
JSON.stringify(JSON.parse<MyBytes>("[4,5,6]")); // '[4,5,6]'
```

This is the right choice when you just want a named or extended container that still reads/writes as the underlying type.

## Decorated: treated as a generated struct

Adding `@json` tells the transform to treat the subclass like any other generated class — it emits `__SERIALIZE` / `__DESERIALIZE` over the class's **fields**. For a built-in container that means its *internal* fields become the schema:

```ts ignore
@json
class GenBytes extends Uint8Array {
  constructor(length: i32 = 0) {
    super(length);
  }
}

// Serializes the inherited internals, not the bytes:
// {"buffer":[…],"dataStart":<pointer>,"byteLength":3}
JSON.stringify<GenBytes>(new GenBytes(3));
```

That's almost never what you want on its own. So a decorated built-in subclass is really only useful **together with a custom format**:

```ts ignore
@json
class HexBytes extends Uint8Array {
  constructor(length: i32 = 0) {
    super(length);
  }

  @serializer("string")
  serializer(self: HexBytes): string {
    /* encode bytes as a hex string */
  }

  @deserializer("string")
  deserializer(data: string): HexBytes {
    /* decode hex string back to bytes */
  }
}
```

See [Custom Serialization](./custom-serialization) for the full pattern.

## Rule of thumb

- Want the built-in's JSON form? **Don't decorate** the subclass.
- Want a different wire format? **Decorate it and add `@serializer`/`@deserializer`.**
- Decorating without a custom format exposes the base type's internal fields — mark any you don't want with `@omit`, or (better) supply a custom format.
