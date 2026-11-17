# Upgrading to 2.1

2.1 keeps the public `JSON.parse<T>`, `JSON.stringify`, and `JSON.validate` signatures. Lazy parsing now has a single meaning: compile-time access specialization.

## One lazy API

| Declaration | Behavior |
| --- | --- |
| `@json` | Default access specialization. |
| `@json({ lazy })` or `@json({ lazy: true })` | Explicitly select the same default. |
| `@json({ nolazy })` or `@json({ lazy: false })` | Eager parsing for this class and its descendants. |

Eligible local parse sites decode needed fields and scan past proven-unused supported fields. Full reads and uncertain or escaping values retain eager behavior. Initializer and codec side effects are preserved. There are no typed-field lazy slots, getters, or deferred materialization.

## Remove deferred-field APIs

- Replace `JSON.Lazy<T>` with `T`.
- Remove instance-field `@lazy` and `@eager` decorators.
- Replace `lazy: "auto"`, `"all"`, `"none"`, or `"strategic"` with a boolean class choice.
- Replace `JSON_ACCESS_SPECIALIZATION` and `JSON_STRATEGIC_LAZINESS` with `JSON_LAZY`. Set it to `false` for a build-wide eager control.

Retired class modes and field decorators produce migration errors. AssemblyScript's built-in module/static `@lazy` remains available.

Observable fields and their codecs now decode during parsing rather than on first access. Applications depending on deferred timing must adjust that expectation.

## Serialization and dynamic values

Serializing a typed object whole observes its fields, so they are retained and encoded from current values. Assignments, nested mutations, omission predicates, and custom writers still apply. Typed serialization no longer forwards untouched saved source slices.

Dynamic `JSON.Value`, `JSON.Obj`, `JSON.Arr`, and `JSON.Raw` retain their existing source-backed behavior. They remain available when the application explicitly wants dynamic or raw JSON.

## Editors and benchmarks

Internal runtime helpers are not exported in the TypeScript namespace, so `JSON.` completion shows the public API and dynamic types. Generated AssemblyScript readers can still call internal helpers; optimized compiler tests cover that reachability.

Use `{ nolazy }` when comparing complete eager materialization to another native-model parser. For a partial-read benchmark, report the observed fields. Historical deferred-field charts do not measure this consolidated strategy.

See [Lazy parsing](./lazy-fields), [Configuration](../reference/customization), and [Getting started](./getting-started). Upgrading from 1.x also requires the [2.0 migration notes](./upgrading-to-2).
