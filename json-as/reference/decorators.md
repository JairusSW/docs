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

Marks a class for transform-generated serialization/deserialization. Use it on application schemas, including nested schemas. Native supported types do not need it. Undecorated base declarations can contribute inherited fields to a decorated child; the transform preserves their defaults and declaration bindings.

```ts ignore
@json
class Vec3 { x: f64 = 0; y: f64 = 0; z: f64 = 0; }
```

`@serializable` is an exact alias of `@json`.

### Class options

| Syntax | Effect |
| --- | --- |
| `@json` / `@json({ lazy })` / `@json({ lazy: true })` | Default compile-time access specialization, with no deferred storage for ordinary fields. |
| `@json({ nolazy })` / `@json({ lazy: false })` | Disable automatic access specialization for this class and its descendants. |
| `@json({ lazy: "none" })` | Defer only explicitly marked fields; ordinary access specialization remains enabled. |
| `@json({ lazy: "auto" })` | Defer supported fields judged expensive; keep cheap fields and arrays eager. |
| `@json({ lazy: "all" })` | Defer supported non-array fields. |
| `@json({ lazy: "strategic" })` | Start with deferred fields and choose eager reads per visible parse site. |

The shorthand names `lazy` and `nolazy` are ambient. They do not need imports. For eager benchmark controls, use `{ nolazy }` and no explicit lazy fields. Array-typed fields remain eager in every mode; dynamic `JSON.Arr` elements retain their deferred behavior.

See [Access specialization and lazy fields](../guide/lazy-fields) for read timing, source forwarding, and the distinction between skipping and deferring.

## Field decorators

### `@alias("name")`

Use a different JSON key than the field name.

### `@omit`

Exclude the field from the generated JSON schema. Input does not populate it; its application initializer still runs. An omitted override also masks the inherited JSON field.

### `@omitnull()`

Skip the field on serialize when its value is `null`.

### `@omitif(condition)`

Skip the field on serialize when `condition` is truthy. The condition is either a predicate that receives the **instance** — `(self: T) => boolean` — or a string expression evaluated in the instance's scope (refer to fields via `this`):

```ts ignore
@omitif((self: Player) => self.age < 18) email: string = "";
@omitif("this.age < 18") phone: string = "";
```

### `@optional`

Mark a field optional for **deserialization**: the key may be absent from the input (or appear in any order), and the field uses its declared default, including when parsing into a populated destination. Unlike `@omitnull()`/`@omitif()` it does **not** omit the field on serialize and has no nullability requirement — it only opts the field into the order-tolerant fast path on parse.

```ts ignore
@optional retweeted_status: Retweet | null = null; // key may be absent on parse
```

### `@lazy`

Defer this field: its raw JSON slice is stored at parse time and parsed only on first access. Equivalent to the `JSON.Lazy<T>` type wrapper. See [Lazy Fields](../guide/lazy-fields).

### `@eager`

Opt a single field out of a class-level `@json({ lazy })` default, forcing it eager.

## Method decorators

### `@serializer(shape?)`

Marks a method as the class's custom serializer (replaces the generated one). It receives the instance and must return a valid JSON string. See [Custom Serialization](../guide/custom-serialization).

### `@deserializer(shape?)`

Marks a method as the class's custom deserializer. It receives the raw JSON string and returns an instance. A custom reader and a custom writer are independent capabilities; implement both when the wire format requires them.

For both, `shape` is an optional hint for the JSON form the type maps to: `"any"` *(default)*, `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`, `"null"`, or a nullable form like `"string | null"`. Keep the serializer and deserializer shapes matched.
