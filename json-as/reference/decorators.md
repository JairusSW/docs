# Decorators

## `@json`

Marks a class for transform-generated serialization and deserialization.

## `@alias("name")`

Maps a field to a different JSON key.

## `@omit`

Always omits a field from serialization.

## `@omitnull()`

Omits a field when its value is `null`.

## `@omitif(predicate)`

Omits a field when the predicate returns `true`.

## `@lazy`

Defers a field: its raw JSON slice is stored at parse time and parsed into the
value only on first access. Equivalent to the `JSON.Lazy<T>` type wrapper. See
[Lazy Fields](/json-as/guide/lazy-fields).

## `@eager`

Opts a field out of a class-level `@json({ lazy })` default, keeping it eager.

## `@json({ lazy })`

Sets a class-wide lazy default: `"none"` (default), `"auto"` (defer
expensive-to-parse fields, keep scalars eager), or `"all"` (defer every field).
See [Lazy Fields](/json-as/guide/lazy-fields).

## `@serializer(kind?)`

Declares a custom serializer method for the class.

The optional `kind` is one of:

- `any`
- `string`
- `number`
- `boolean`
- `object`
- `array`
- nullable forms like `string | null`

## `@deserializer(kind?)`

Declares a custom deserializer method for the class.

Its kind should match the serializer kind when both are present.
