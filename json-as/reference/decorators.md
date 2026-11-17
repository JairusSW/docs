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
| `@json` / `@json({ lazy })` / `@json({ lazy: true })` | Access-based parsing (default). |
| `@json({ nolazy })` / `@json({ lazy: false })` | Eager parsing for this class and its descendants. |

Shorthand names are ambient. No field slots or deferred getters are generated. See [Lazy parsing](../guide/lazy-fields). String modes and instance-field lazy/eager decorators were removed.

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

## Method decorators

### `@serializer(shape?)`

Marks a method as the class's custom serializer (replaces the generated one). It receives the instance and must return a valid JSON string. See [Custom Serialization](../guide/custom-serialization).

### `@deserializer(shape?)`

Marks a method as the class's custom deserializer. It receives the raw JSON string and returns an instance. A custom reader and a custom writer are independent capabilities; implement both when the wire format requires them.

For both, `shape` is an optional hint for the JSON form the type maps to: `"any"` *(default)*, `"string"`, `"number"`, `"boolean"`, `"object"`, `"array"`, `"null"`, or a nullable form like `"string | null"`. Keep the serializer and deserializer shapes matched.
