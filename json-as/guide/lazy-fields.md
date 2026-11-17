# Access Specialization and Lazy Fields

A **lazy** field defers parsing. Instead of materializing the value during `JSON.parse`, `json-as` records the field's raw JSON slice and parses it only on first access. A field you never read is never parsed; on serialize, an untouched field's original bytes pass straight through. Access is fully transparent — a lazy field reads and writes exactly like a normal one.

This is ideal for large payloads where you touch only a few fields, and for proxy / filter / forward workloads.

## Access-based parsing for ordinary classes

Ordinary `@json` classes use access analysis by default, without requiring a
lazy marker. When a visible `JSON.parse<T>` result stays local, the transform
can generate a reader that scans proven-unused fields without decoding them:

```ts
@json
class Point {
  x: f32 = 0;
  y: f32 = 0;
  name: string = "";
}

function readX(input: string): f32 {
  const point = JSON.parse<Point>(input);
  return point.x; // y and name can be skipped at this local parse site
}
```

This produces an ordinary object with no lazy slots or getters. When all fields
are needed, the result escapes, or its uses cannot be proven safe, the parser
retains eager behavior. Observable initializer and custom-decoder effects are
preserved. Direct array-typed fields remain eager. Set
`JSON_ACCESS_SPECIALIZATION=false` at compile time to disable this optimization.

Explicit lazy fields, described below, remain available when a caller needs a
value to be materialized on first access.

## Eager controls

`@json({ lazy })` is shorthand for the ordinary default access strategy. It does not turn every field into a deferred accessor. `@json({ nolazy })` or `@json({ lazy: false })` disables automatic access specialization for a class and its descendants. Explicit field markers are separate; leave them out of fully eager benchmark models.

```ts
@json({ nolazy })
class EagerPoint {
  x: f32 = 0;
  y: f32 = 0;
}
```

## Marking a field

Use a field decorator or a type wrapper:

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
  description: JSON.Lazy<string> = ""; // type-wrapper form
  files: string[] = []; // arrays parse eagerly
}
```

- **`@lazy`** — a bare decorator on the field.
- **`JSON.Lazy<T>`** — a transparent type alias (`type Lazy<T> = T`), so the field is still typed and used as a plain `T`.

Array-typed fields, including `JSON.Arr` fields, are parsed eagerly even when marked `@lazy` or `JSON.Lazy<T>` or included in a class-wide lazy mode. Dynamic `JSON.Arr` elements retain their separate deferred behavior.

```ts
const json =
  '{"name":"x","owner":{"id":5,"login":"ada"},"description":"hello","files":["a.ts","b.ts"]}';

const repo = JSON.parse<Repo>(json);
repo.name; // "x"      — parsed eagerly
repo.owner.id; // 5    — owner parsed now (on first read), then cached
// repo.description is never read here -> never parsed

// Deferred fields can forward their original value ranges:
JSON.stringify(JSON.parse<Repo>(json));
// Eager fields are re-encoded; whole-document byte identity is not guaranteed.
```

## Class-level modes

Set a default for a whole class with the `@json` config object, and override individual fields with `@eager`:

```ts
@json({ lazy: "auto" }) // "none" (default) | "auto" | "all" | "strategic"
class Doc {
  id: i32 = 0; // auto: cheap -> stays eager
  title: string = ""; // auto: deferred
  tags: string[] = []; // arrays remain eager
  @eager hot: string = ""; // forced eager
}
```

- **`none`** *(default)* — only fields with an explicit marker are deferred.
- **`auto`** — defer the expensive-to-parse fields (strings, maps/sets, `JSON.Value`/`Obj`/`Raw`, non-trivial nested structs) and keep cheap ones and arrays eager.
- **`all`** — defer every supported serialized field; array-typed fields remain eager. Best for proxy / passthrough.
- **`strategic`** — specialize supported fields per visible parse site using their estimated access patterns. Guaranteed reads are eager; other reads use compile-time cost estimates.

For non-array fields, precedence is explicit `@lazy` / `JSON.Lazy<T>`, then `@eager`, then the class mode. `@omit` fields are never affected.

## Strategic parsing and serialization

```ts
@json({ lazy: "strategic" })
class Response {
  id: i32 = 0;
  description: string = "";
}

function forward(input: string): string {
  const response = JSON.parse<Response>(input);
  if (response.id == 0) return "";
  return JSON.stringify(response);
}
```

The visible read makes `id` eager. An untouched deferred `description` can be copied from its original JSON range without decoding or escaping it again. Reads after this serialization do not pull decoding ahead of that output. json-as calls, including resolved import aliases, preserve the strategic plan; application-owned writers are handled conservatively.

Once a field is materialized, serialization writes its current typed value. Assigning it replaces the saved range; mutating a materialized child is reflected in output. Untouched custom-codec values can forward without invoking either codec, while accessing or replacing them restores the typed codec path. Omission predicates that inspect a field can require materialization.

Forwarding retains fields in the output; it does not omit them. The writer still produces an owning output string on each call. Raw source formatting may survive for deferred values, so do not require byte-identical output to eager re-encoding.

Ordinary access specialization has no source ranges. Whole-object serialization of an ordinary class keeps its fields observable and eager.

## Interactions

- **`@omitnull` / `@omitif`** — supported. Null-ness is decided from the stored slice without materializing the value; an `@omitif` predicate that reads the field will materialize it, otherwise it passes through raw.
- **Generics** — lazy fields support both scalar and reference type arguments, including `JSON.Lazy<T>` in a generic class. Use an explicit initializer when your application needs a particular default.
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

Lazy is fastest when you **skip** fields or **forward** them, and the win grows with payload size. See [Performance](./performance#lazy-and-dynamic-work) for the eager-vs-lazy benchmarks.
