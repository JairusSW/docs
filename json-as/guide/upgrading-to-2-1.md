# Upgrading to 2.1

2.1 keeps the `JSON.parse<T>` and `JSON.stringify` APIs. Its main change is compile-time specialization of visible parse sites, alongside generated serialization and runtime optimizations.

For installation, see [Getting started](./getting-started). If upgrading from 1.x, also read the [2.0 migration notes](./upgrading-to-2).

## Ordinary classes specialize by default

```ts
import { JSON } from "json-as";

@json
class Response {
  id: i32 = 0;
  title: string = "";
  body: string = "";
}

function title(input: string): string {
  const response = JSON.parse<Response>(input);
  return response.title;
}
```

At eligible local parse sites, the transform decodes needed fields and scans past proven-unused fields. Skipped fields have no deferred getter or saved source range. Full reads retain the eager representation. Returned objects, unknown consumers, whole-object serialization, uncertain control flow, and analysis limits require conservative handling. Observable initializer and custom-codec effects must still run.

This is a compile-time optimization, not a runtime promise that every partial read will specialize. Generic or effectful code may keep the ordinary reader.

## Eager controls and shorthand

| Declaration | Behavior |
| --- | --- |
| `@json` or `@json({ lazy })` | Default access-based specialization; ordinary fields have no deferred storage. |
| `@json({ nolazy })` or `@json({ lazy: false })` | Disable automatic access specialization for the class and its descendants. |
| `@json({ lazy: "strategic" })` | Deferred fields with parse-site eager-read plans. |
| `@lazy` or `JSON.Lazy<T>` on a field | Explicit deferred materialization for supported non-array types. |

`lazy` and `nolazy` are ambient shorthand names; no import is needed. For an unambiguous eager benchmark model, use `{ nolazy }` without explicit lazy field markers. To disable ordinary specialization across a build, set `JSON_ACCESS_SPECIALIZATION=false`.

## Deferred serialization

Explicit lazy fields and strategic classes retain source ranges. `JSON.stringify` copies untouched deferred values from those ranges; it writes materialized or assigned values from their current typed state. Mutations through a materialized child are included, and omission decorators still apply.

A json-as serialization call preserves a strategic parse site's eager-read plan. A later field read does not require decoding that field before the first serialization. This is per-field forwarding, not a cache of the complete output string. Output remains an owning string, and untouched source formatting can differ from eager re-encoding.

Ordinary field skipping has no source ranges to forward. Serializing an ordinary result whole therefore retains its observable fields rather than dropping unread fields from JSON output.

## Arrays remain eager

Array-typed fields, including `JSON.Arr` fields, parse eagerly even with a lazy marker or class-wide lazy mode. This does not change deferred elements inside dynamic `JSON.Arr` values.

## Configuration and performance

`JSON_ACCESS_SPECIALIZATION` controls ordinary field skipping. `JSON_STRATEGIC_LAZINESS` controls the separate strategic planning pass; disabling it does not disable ordinary specialization. Strictness, diagnostics, backend selection, and tier-down behavior remain separate settings.

Compare [the 2.1 charts](./performance) using matching workloads and output policies. Fully materialized native structs, partial field reads, and source-forwarding dynamic values perform different work.
