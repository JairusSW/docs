# Snapshots And Mocks

```ts
import { expect, mockFn, test, unmockFn } from "as-test";

function renderMode(): string {
  return "mode=prod";
}

mockFn(renderMode, (): string => "mode=test");

test("captures mocked output", () => {
  expect(renderMode()).toMatchSnapshot("render-mode");
});

unmockFn(renderMode);
```

Useful commands:

```bash
ast test --create-snapshots
ast test --overwrite-snapshots
```
