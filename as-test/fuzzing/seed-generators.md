# Seed Generators

`FuzzSeed` is a deterministic pseudo-random source. The same seed produces the same sequence, which is what makes failures reproducible. You receive one inside `.generate()` and call its methods to build each input.

```ts
.generate((seed: FuzzSeed, run: (n: i32, s: string) => bool): void => {
  run(seed.i32({ min: 0, max: 255 }), seed.string({ charset: "alpha", max: 16 }));
});
```

## Generators

| Method | Returns | Options |
| --- | --- | --- |
| `boolean()` / `bool()` | `bool` | — |
| `pick<T>(values)` | a random element of `values` | — |
| `i8` / `u8` / `i16` / `u16` / `i32` / `u32` / `i64` / `u64` | integer | `{ min, max, exclude }` |
| `f32` / `f64` | float (default range `[0, 1)`) | `{ min, max, exclude }` |
| `bytes(options?)` | `Uint8Array` | `{ min, max, include, exclude }` |
| `buffer(options?)` | `ArrayBuffer` | same as `bytes` |
| `string(options?)` | `string` | `{ charset, min, max, prefix, suffix, include, exclude }` |
| `array<T>(item, options?)` | `Array<T>` | `{ min, max }` |
| `reseed(seed)` | resets the sequence | — |

Integer and float `exclude` lists drop specific values from the range; `bytes` `include`/`exclude` and `string` `include`/`exclude` operate on byte values and codepoints respectively.

## String charsets

`seed.string({ charset })` selects from a named character set:

| Charset | Characters |
| --- | --- |
| `ascii` (default) | printable ASCII |
| `alpha` | `A–Z`, `a–z` |
| `digit` | `0–9` |
| `hex` | `0–9`, `a–f` |
| `alnum` | letters and digits |
| `base64` | base64 alphabet |
| `identifier` | valid identifier characters |
| `whitespace` | whitespace characters |

```ts
seed.string({ charset: "hex", min: 8, max: 8 });        // 8 hex chars
seed.string({ charset: "alnum", prefix: "id_", max: 12 });
```

## Composing generators

`array` takes a per-item generator, so you can build structured inputs:

```ts
.generate((seed: FuzzSeed, run: (xs: i32[]) => bool): void => {
  run(seed.array<i32>((s: FuzzSeed): i32 => s.i32({ min: 0, max: 9 }), { min: 1, max: 16 }));
});
```

## Example

```ts
import { expect, fuzz, FuzzSeed } from "as-test";

fuzz("sorting is idempotent", (xs: i32[]): bool => {
  const once = sort(xs);
  const twice = sort(once);
  expect(twice).toEqual(once);
  return true;
}).generate((seed: FuzzSeed, run: (xs: i32[]) => bool): void => {
  run(seed.array<i32>((s: FuzzSeed): i32 => s.i32(), { min: 0, max: 32 }));
});
```
