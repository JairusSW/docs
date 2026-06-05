# Basic Usage

## Decorated classes

Any class marked `@json` can be parsed and serialized. Fields are matched to JSON keys by name.

```ts
import { JSON } from "json-as";

@json
class Point {
  x: i32 = 0;
  y: i32 = 0;
}

JSON.stringify(new Point()); // '{"x":0,"y":0}'

const p = JSON.parse<Point>('{"x":3,"y":4}');
p.y; // 4
```

Give fields a default (`x: i32 = 0`) or mark them definitely-assigned (`x!: i32`). A default is used when the key is missing from the input.

## Nested classes and arrays

Fields can be other `@json` classes, arrays of them, and arrays of primitives — nesting works to any depth.

```ts
@json
class Path {
  name: string = "";
  points: Point[] = [];
}

const path = JSON.parse<Path>(
  '{"name":"a","points":[{"x":1,"y":2},{"x":3,"y":4}]}',
);
path.points[1].x; // 3

JSON.stringify(path); // '{"name":"a","points":[{"x":1,"y":2},{"x":3,"y":4}]}'
```

## Renaming keys with `@alias`

When the JSON key can't be an AssemblyScript identifier (or just differs from your field name), map it with `@alias`:

```ts
@json
class User {
  @alias("user_id") id: i32 = 0;
  name: string = "";
}

const u = new User();
u.id = 42;
u.name = "ada";
JSON.stringify(u); // '{"user_id":42,"name":"ada"}'

JSON.parse<User>('{"user_id":7,"name":"x"}').id; // 7
```

## Optional fields

Three decorators drop a field from the **output** (parsing still accepts the key either way):

- `@omit` — never serialized.
- `@omitnull()` — skipped when the value is `null`.
- `@omitif(predicate)` — skipped when the predicate (given the instance) returns `true`.

```ts
@json
class Session {
  token: string = "";
  @omit secret: string = "";
}

@json
class Profile {
  name: string = "";
  @omitnull() bio: string | null = null;
}

@json
class Player {
  name: string = "";
  @omitif((self: Player) => self.score == 0) score: i32 = 0;
}
```

```ts
const s = new Session();
s.token = "t";
s.secret = "hidden";
JSON.stringify(s); // '{"token":"t"}'  — secret never emitted

const pr = new Profile();
pr.name = "ada";
JSON.stringify(pr); // '{"name":"ada"}'  — bio is null, skipped
pr.bio = "hi";
JSON.stringify(pr); // '{"bio":"hi","name":"ada"}'

const pl = new Player();
pl.name = "z";
JSON.stringify(pl); // '{"name":"z"}'  — score is 0, skipped
pl.score = 9;
JSON.stringify(pl); // '{"score":9,"name":"z"}'
```

::: tip Key order
Conditionally-emitted fields (`@omitnull` / `@omitif`) are serialized **before** the always-present ones — note `bio` and `score` appear first above. The order is still valid JSON; object key order isn't significant.
:::

`@omitif` also accepts a string expression evaluated against the instance, e.g. `@omitif("this.score == 0")`.

## Nullable primitives with `JSON.Box`

AssemblyScript can't express `i32 | null` (value types aren't nullable). Wrap the primitive in `JSON.Box<T>` to get a nullable number/bool:

```ts
@json
class Account {
  name: string = "";
  balance: JSON.Box<i32> | null = null;
}

const a = JSON.parse<Account>('{"name":"a","balance":50}');
a.balance!.value; // 50

const b = JSON.parse<Account>('{"name":"a","balance":null}');
b.balance == null; // true
```

A `Box<T>` serializes as the bare value (or `null`), not as an object.

## Reusing an instance

Both `parse` and `stringify` take an optional second argument to reuse an existing object or output string instead of allocating a fresh one — handy in hot loops over a fixed shape.

```ts
const into = new Point();
JSON.parse<Point>('{"x":1,"y":2}', into); // fills `into` in place
into.x; // 1

let out = "";
out = JSON.stringify(new Point(), out); // reuses `out`'s buffer when it can
```

On a steady-state re-parse of the same shape this reuses nested structs, arrays, and strings in place — effectively zero allocation after the first call.

## Next steps

- [Built-in Types](./built-in-types) — `Date`, maps, sets, typed arrays, and more
- [Lazy Fields](./lazy-fields) — defer parsing of fields you rarely touch
- [Dynamic Types](../reference/dynamic-types) — `JSON.Value` / `JSON.Obj` for unknown shapes
