# Branch Hinting

`branch-hinting` provides `likely()` and `unlikely()` helpers plus a transform
that emits the `metadata.code.branch_hint` custom section in the final wasm.

## Import

```ts
import { likely, unlikely } from "as-labs/branch-hinting";
```

## Example

```ts
export function classify(n: i32): i32 {
  if (likely(n > 0)) return 1;
  if (unlikely(n < 0)) return -1;
  return 0;
}
```

## Transform

```sh
asc assembly/index.ts --transform as-labs/branch-hinting -o build/module.wasm
```

## Behavior

- `likely()` emits a `\01` branch hint
- `unlikely()` emits a `\00` branch hint
- the helper wrappers are erased during compilation
- the transform currently targets direct statement conditions such as `if`,
  `while`, `do`, and `for`

## Verification

The reliable verification target is the binary itself.

- inspect the final `.wasm` for `metadata.code.branch_hint`
- do not rely on generic `wasm2wat` output to re-render hint annotations
- if you want to inspect the annotation in text form, use transform-generated
  `.wat` output rather than decompiling the binary later
