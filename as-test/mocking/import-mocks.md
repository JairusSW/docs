# Import Mocks

Use `mockImport(...)` when the thing you want to replace is addressed by import path.

```ts
import { expect, mockImport, test, unmockImport } from "as-test";

mockImport("env.read", (): i32 => 7);

test("uses mocked host import", () => {
  expect(readValue()).toBe(7);
});

unmockImport("env.read");
```

## Good Uses

- host imports
- thin environment wrappers
- runtime-provided functions that are awkward to reproduce in tests

## Tips

- prefer small wrapper modules around important imports
- mock the narrowest path you can
- reset with `unmockImport(...)` when the test no longer needs the override
