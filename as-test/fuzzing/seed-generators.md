# Seed Generators

`FuzzSeed` provides deterministic helpers for building inputs from a base seed.

## Available Helpers

- `seed.boolean()`
- `seed.pick(values)`
- `seed.i32({ min, max, exclude })`
- `seed.u32({ min, max, exclude })`
- `seed.f32({ min, max, exclude })`
- `seed.f64({ min, max, exclude })`
- `seed.bytes({ min, max, include, exclude })`
- `seed.buffer({ min, max, include, exclude })`
- `seed.string({ charset, min, max, include, exclude, prefix, suffix })`
- `seed.array((seed) => value, { min, max })`

## String Charsets

Supported `seed.string(...)` charsets:

- `ascii`
- `alpha`
- `alnum`
- `digit`
- `hex`
- `base64`
- `identifier`
- `whitespace`
- `custom`

## Example

```ts
fuzz("ascii identifiers stay non-empty", (value: string): bool => {
  return value.length > 0;
}).generate((seed: FuzzSeed, run: (value: string) => bool): void => {
  run(
    seed.string({
      charset: "identifier",
      min: 1,
      max: 16,
    }),
  );
});
```
