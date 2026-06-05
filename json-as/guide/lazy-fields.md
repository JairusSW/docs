# Lazy Fields

A **lazy** field defers parsing. Instead of materializing the value during `JSON.parse`, `json-as` records the field's raw JSON slice and parses it only on first access. A field you never read is never parsed; on serialize, an untouched field's original bytes pass straight through. Access is fully transparent — a lazy field reads and writes exactly like a normal one.

This is ideal for large payloads where you touch only a few fields, and for proxy / filter / forward workloads.

## Marking a field

Three equivalent ways, pick whichever reads best:

```ts
import { JSON } from "json-as";

@json
class Owner {
  id: i32 = 0;
  login: string = "";
}

@json
class Repo {
  name: string = ""; // eager (parsed up front)
  @lazy owner: Owner = new Owner(); // decorator form
  files: JSON.Lazy<string[]> = []; // type-wrapper form
}
```

- **`@lazy`** — a bare decorator on the field.
- **`JSON.Lazy<T>`** — a transparent type alias (`type Lazy<T> = T`), so the field is still typed and used as a plain `T`.

```ts
const json =
  '{"name":"x","owner":{"id":5,"login":"ada"},"files":["a.ts","b.ts"]}';

const repo = JSON.parse<Repo>(json);
repo.name; // "x"      — parsed eagerly
repo.owner.id; // 5    — owner parsed now (on first read), then cached
// repo.files is never read here -> never parsed

// An untouched object round-trips by copying its original bytes:
JSON.stringify(JSON.parse<Repo>(json)); // === json
```

## Class-level modes

Set a default for a whole class with the `@json` config object, and override individual fields with `@eager`:

```ts
@json({ lazy: "auto" }) // "none" (default) | "auto" | "all"
class Doc {
  id: i32 = 0; // auto: cheap -> stays eager
  title: string = ""; // auto: deferred
  tags: string[] = []; // auto: deferred
  @eager hot: string = ""; // forced eager
}
```

- **`none`** *(default)* — only fields with an explicit marker are deferred.
- **`auto`** — defer the expensive-to-parse fields (strings, arrays, maps/sets, `JSON.Value`/`Obj`/`Raw`, non-trivial nested structs) and keep cheap ones eager (primitives, enums, `Date`, tiny all-scalar structs).
- **`all`** — defer every serialized field. Best for proxy / passthrough.

Precedence: explicit `@lazy` / `JSON.Lazy<T>` always wins, then `@eager`, then the class mode. `@omit` fields are never affected.

## Interactions

- **`@omitnull` / `@omitif`** — supported. Null-ness is decided from the stored slice without materializing the value; an `@omitif` predicate that reads the field will materialize it, otherwise it passes through raw.
- **Generics** — a lazy field on a generic class works for **reference-type** instantiations (e.g. `Box<Owner>`); value-type instantiations (`Box<i32>`) are not supported.
- **Custom serializers** — a class with a custom `@serializer`/`@deserializer` can't have lazy fields (the custom methods replace the generated ones the slots rely on); the transform reports an error.

## Caveats

- **Construct with `new` + assignment, or `JSON.parse`.** A lazy field becomes a get/set accessor, and AssemblyScript's object-literal class init (`const r: Repo = { … }`) doesn't support accessors:

  ```ts ignore
  const repo = new Repo();
  repo.name = "json-as";
  repo.owner = owner; // goes through the setter
  ```

- A struct **keeps its source string alive** while it lives (the cost of zero-copy). For long-lived objects over huge payloads, read what you need and drop the object, or prefer per-field `@lazy` over `all`.
- **`lazy: "all"` grows module size** — it generates a getter and a serialize branch per field. When code size matters, mark only the fields you actually skip.

## Performance

Lazy is fastest when you **skip** fields or **forward** them, and the win grows with payload size. See [Performance](./performance#lazy-fields) for the eager-vs-lazy benchmarks.
