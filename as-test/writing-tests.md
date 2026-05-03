# Writing Tests

## Basic Spec

```ts
import { describe, expect, test } from "as-test";

describe("math", () => {
  test("adds numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

You do not need to call `run()` manually in normal spec files.

## Suite And Test APIs

Available top-level registration helpers:

- `describe(name, callback)`
- `test(name, callback)`
- `it(name, callback)`
- `only(name, callback)`
- `xonly(name, callback)`
- `todo(name)`
- `xdescribe(name, callback)`
- `xtest(name, callback)`
- `xit(name, callback)`

Hooks:

- `beforeAll(callback)`
- `afterAll(callback)`
- `beforeEach(callback)`
- `afterEach(callback)`

Assertion entry point:

- `expect(value, message?, location?)`
- `xexpect(value, message?, location?)`

## Hooks Example

```ts
import { beforeEach, describe, expect, test } from "as-test";

let value = 0;

beforeEach(() => {
  value = 41;
});

describe("counter", () => {
  test("increments", () => {
    value++;
    expect(value).toBe(42);
  });
});
```

## Focus, Skip, And Todo

```ts
import { only, test, todo, xtest } from "as-test";

only("run just this top-level case", () => {});
xtest("skip this case", () => {});
todo("implement parser edge cases");
```

`only(...)` is top-level focused execution. `xonly(...)` is the skipped version of that placeholder.

## Selectors

Run everything:

```bash
ast test
```

Run by bare selector:

```bash
ast test math
```

Run several selectors:

```bash
ast test math,array,string
```

Run one suite inside a selected file:

```bash
ast run math --suite array-check
ast run math --suite array-manipulation/array-check
```

Run explicit paths or globs:

```bash
ast test ./assembly/__tests__/math.spec.ts
ast test "./assembly/__tests__/*.spec.ts"
```

Bare selectors resolve against your configured `input` globs.

`--suite` and `--suites` filter the reported result to matching suite names:

- bare names like `array-check` match the shallowest unique suite slug
- slash paths like `array-manipulation/array-check` match the full suite path
- commas select several suite targets at once

## Related Guides

- [Assertions](./assertions/)
- [Snapshots](./snapshots)
- [Mocking](./mocking/)
- [CLI](./cli)
