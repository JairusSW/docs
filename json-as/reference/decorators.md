# Decorators

Every decorator `json-as` understands, in one place. They're ambient — available once the transform is enabled, no import needed (only `JSON` itself is imported).

Here's most of them on one class:

```ts
import { JSON } from "json-as";

@json
class Account {
  @alias("user_id") id: i32 = 0;
  name: string = "";
  @omit password: string = "";
  @omitnull() nickname: string | null = null;
  @omitif((self: Account) => self.balance == 0) balance: i32 = 0;
}
```

## Class decorators

### `@json`

Marks a class for transform-generated serialization/deserialization. Required on every type passed to `JSON.parse` / `JSON.stringify`, including nested types.

```ts ignore
@json
class Vec3 { x: f64 = 0; y: f64 = 0; z: f64 = 0; }
```

`@serializable` is an exact alias of `@json`.

### `@json({ lazy })`

Sets a class-wide [lazy](../guide/lazy-fields) default:

- `"none"` *(default)* — every field eager.
- `"auto"` — defer the expensive-to-parse fields (strings, arrays, maps, nested structs), keep cheap ones (primitives, enums, `Date`) eager.
- `"all"` — defer every field.

```ts ignore
@json({ lazy: "auto" })
class Repo { /* … */ }
```

## Field decorators

### `@alias("name")`

Use a different JSON key than the field name.

### `@omit`

Never serialize the field (still accepted on parse).

### `@omitnull()`

Skip the field on serialize when its value is `null`.

### `@omitif(condition)`

Skip the field on serialize when `condition` is truthy. The condition is either a predicate that receives the **instance** — `(self: T) => boolean` — or a string expression evaluated in the instance's scope (refer to fields via `this`):

```ts ignore
@omitif((self: Player) => self.age < 18) email: string = "";
@omitif("this.age < 18") phone: string = "";
```

### `@lazy`

Defer this field: its raw JSON slice is stored at parse time and parsed only on first access. Equivalent to the `JSON.Lazy<T>` type wrapper. See [Lazy Fields](../guide/lazy-fields).

### `@eager`

Opt a single field out of a class-level `@json({ lazy })` default, forcing it eager.

## Method decorators

### `@serializer(shape?)`

Marks a method as the class's custom serializer (replaces the generated one). It receives the instance and must return a valid JSON string. See [Custom Serialization](../guide/custom-serialization).

### `@deserializer(shape?)`

Marks a method as the class's custom deserializer. It receives the raw JSON string and must return a fresh instance. Pair it with `@serializer`.

For both, `shape` is an optional hint for the JSON form the type maps to: `"any"` *(default)*, `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`, `"null"`, or a nullable form like `"string | null"`. Keep the serializer and deserializer shapes matched.
