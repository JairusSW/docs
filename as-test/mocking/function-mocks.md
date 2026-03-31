# Function Mocks

Use `mockFn(...)` when you want to replace a local function reference inside the compiled AssemblyScript module.

```ts
import { expect, mockFn, test, unmockFn } from "as-test";

function getValue(): i32 {
  return 1;
}

mockFn(getValue, (): i32 => 99);

test("uses a mocked local function", () => {
  expect(getValue()).toBe(99);
});

unmockFn(getValue);
```

## Notes

- `unmockFn(...)` restores references for calls that appear later in source order
- this is best for local code seams, not string-based host imports
- keep the mock lifetime tight so later tests do not accidentally depend on it
