# Basic Usage

## Decorated classes

```ts
import { JSON } from "json-as";

@json
class Player {
  @alias("first name")
  firstName!: string;
  lastName!: string;
  lastActive!: i32[];
  @omitif((self: Player) => self.age < 18)
  age!: i32;
  @omitnull()
  pos!: Vec3 | null;
  isVerified!: boolean;
}

@json
class Vec3 {
  x: f32 = 0.0;
  y: f32 = 0.0;
  z: f32 = 0.0;
}
```

```ts
const player = JSON.parse<Player>('{"first name":"Ada","lastName":"Lovelace","lastActive":[3,9,2025],"age":28,"pos":{"x":1,"y":2,"z":3},"isVerified":true}');
const encoded = JSON.stringify(player);
```

## Nullable primitives

AssemblyScript does not support `i32 | null` directly. Use `JSON.Box<T>` when you need nullable primitive values:

```ts
@json
class Person {
  name!: string;
  age: JSON.Box<i32> | null = null;
}
```

## Raw JSON

Use `JSON.Raw` when you need to preserve a JSON value as raw JSON text:

```ts
const raw = JSON.parse<JSON.Raw>('{"x":1,"y":2}');
const encoded = JSON.stringify(raw);
```

## Unknown and dynamic JSON

Use `JSON.Value` and `JSON.Obj` for dynamic content:

```ts
const values = JSON.parse<JSON.Value[]>('["hello",true,{"x":1}]');
const obj = JSON.parse<JSON.Obj>('{"a":1,"b":[2,3]}');
```
