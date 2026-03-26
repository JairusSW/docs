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
