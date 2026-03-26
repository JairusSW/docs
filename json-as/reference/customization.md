# Customization

## Custom serializers and deserializers

Custom methods are useful when:

- a type has a compact wire format
- you need backward-compatible custom JSON
- you want a built-in container subclass to use a different representation

## Best practices

- always return valid JSON text
- always create a fresh object in custom deserializers
- prefer a narrow JSON kind like `"string"` when possible
- use `JSON.parse<T>(...)` and `JSON.stringify(...)` normally inside the custom method; the transform will route nested calls through `JSON.internal`

## Built-in subclass overrides

Decorated subclasses of built-in containers can override the built-in format with custom methods.

Examples that work well:

- `Uint8Array` encoded as a hex string
- `Array<i32>` encoded as a CSV string
- `Map<string, i32>` encoded as tagged string data
- `Set<string>` encoded as custom compact string data
