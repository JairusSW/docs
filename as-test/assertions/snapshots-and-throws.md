# Snapshot And Throw Matchers

## `toMatchSnapshot`

Snapshot assertions compare the serialized current value to a saved snapshot entry.

```ts
expect(payload).toMatchSnapshot();
expect(payload).toMatchSnapshot("payload");
```

Unnamed calls use an incrementing key within the current test. Named calls append the provided suffix.

See [Snapshots](../snapshots) for snapshot file behavior and CLI flags.

## `toThrow`

`toThrow()` is delegated to `try-as` when it is installed and enabled.

```ts
import "try-as";
import { expect, test } from "as-test";

test("throws", () => {
  expect((): void => {
    unreachable();
  }).toThrow();
});
```

Notes:

- if `try-as` is unavailable, `toThrow()` is treated as disabled and emits a warning once
- use `--enable try-as` or matching config when you want the throw path active
- `toThrow()` depends on the `try-as` instrumentation model, not a JavaScript exception bridge
