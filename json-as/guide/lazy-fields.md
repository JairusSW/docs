# Lazy Fields

A **lazy** field defers parsing. Instead of materializing the value during
`JSON.parse`, json-as records the field's raw JSON slice and parses it only on
first access. A field you never read is never parsed; on serialize its original
bytes pass straight through. Access is fully transparent — a lazy field reads
and writes exactly like a normal field.

This is ideal for large payloads where you only touch a few fields, and for
proxy / filter / passthrough workloads.

## Marking a field

There are two equivalent markers:

```ts
@json
class Repo {
  name: string;               // eager (parsed up-front)

  @lazy owner: Owner;         // decorator form
  files: JSON.Lazy<string[]>; // type-wrapper form
}
```

- **`@lazy`** — a bare decorator on the field.
- **`JSON.Lazy<T>`** — a transparent type alias (`type Lazy<T> = T`), so the
  field is still typed and used as `T`.

Both lower to the same code, so pick whichever reads better.

```ts
const repo = JSON.parse<Repo>(json);
repo.name;        // parsed eagerly
repo.owner.id;    // owner parsed now (and cached)
// repo.files never read -> never parsed
```

## Class-level modes

Set a default for the whole class with the `@json` config object:

```ts
@json({ lazy: "auto" }) // "none" (default) | "auto" | "all"
class Repo { /* … */ }
```

- **`none`** *(default)* — only fields with an explicit marker are deferred.
- **`auto`** — defer the expensive-to-parse fields, keep the cheap ones eager.
  Deferred: strings, arrays, maps, sets, `JSON.Value`/`Obj`/`Raw`, and
  non-trivial nested `@json` structs. Kept eager: primitives, enums, `Date`, and
  tiny all-scalar nested structs (deferring those costs more than it saves).
- **`all`** — defer every serialized field. Best for proxy/passthrough.

### Per-field overrides

`@eager` opts a single field out of the class default:

```ts
@json({ lazy: "auto" })
class Repo {
  id: i32;             // auto: eager (cheap)
  owner: Owner;        // auto: deferred
  @eager hot: Details; // override -> always eager
  @lazy notes: string; // explicit -> always deferred
}
```

Precedence:

```
explicit @lazy / JSON.Lazy<T>   ->  always deferred
@eager                          ->  always eager
otherwise                       ->  the class mode
```

`@omit` fields are never affected.

## Performance

Lazy is fastest when you **skip** fields or **pass them through** — and the win
grows with payload size. Deserialize, parsing into the struct but not reading
the deferred fields (SIMD, ns/op):

![Deserialize: eager vs lazy by payload size](/json-as/bench/lazy-deserialize.svg)

Round-trip (`parse → stringify`) of an untouched object — the proxy / filter /
forward case — never parses or re-serializes the deferred fields:

![Round-trip: eager vs lazy by payload size](/json-as/bench/lazy-roundtrip.svg)

Across access patterns, lazy stays at or below eager — even when you read every
deferred field (the slice-pointer materialization is as cheap as eager parsing):

![Access pattern: eager vs lazy](/json-as/bench/lazy-access-pattern.svg)

::: tip Rule of thumb
Lazy the fields you usually **skip or forward**. `auto` does this for you; reach
for `all` on proxy/filter workloads over large payloads.
:::

A deferred field is parsed once on first read and cached. An untouched field
round-trips by copying its original source bytes — never parsed or re-serialized.

The trade is **code size**: `lazy: "all"` generates a getter + serialize branch
per field, so a fully-deferred large schema balloons. Prefer per-field `@lazy`
(or `auto`) when module size matters.

![Code-size cost of lazy-everywhere](/json-as/bench/lazy-module-size.svg)

## Interactions

- **`@omitnull`** — supported. Null-ness is decided from the stored slice
  without materializing the value.
- **`@omitif`** — supported. The predicate runs at serialize; if it reads the
  lazy field, that field materializes, otherwise the field still passes through
  raw.
- **Generics** — a lazy field on a generic class works for **reference-type**
  instantiations (e.g. `Box<Owner>`). Value-type instantiations (`Box<i32>`)
  are not supported.

::: warning Custom serializers
A class with a custom `@serializer`/`@deserializer` cannot have lazy fields — the
custom methods replace the generated (de)serializer that lazy slots rely on. The
transform reports an error. (A field whose *type* has a custom (de)serializer is
fine.)
:::

## Caveats

- **Object-literal initialization isn't supported.** A lazy field becomes a
  get/set accessor, and AssemblyScript's object-literal class init
  (`const r: Repo = { … }`) doesn't support accessors. Construct with `new` +
  assignment (which goes through the setter), or use `JSON.parse`:

  ```ts
  const repo = new Repo();
  repo.name = "json-as";
  repo.owner = owner; // setter
  ```

- A struct keeps its source string alive while it lives (the lifetime cost of
  zero-copy). For long-lived objects over huge payloads, read what you need and
  drop the object, or prefer per-field `@lazy` over `all`.
- `lazy: "all"` increases module size (a getter + serialize branch per field).
  When code size matters, mark only the fields you actually skip.
