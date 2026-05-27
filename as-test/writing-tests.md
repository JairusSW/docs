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
- `beforeEach(callback, kinds?)`
- `afterEach(callback, kinds?)`

Assertion entry point:

- `expect(value, message?, location?)`
- `xexpect(value, message?, location?)`

## Suites And Tests

Every grouping block — `describe`, `test`, `it`, `only` (and their skip
variants) — is a **suite**. Each `expect()` call is a **test**. So a block that
contains five assertions reports as one suite with five tests, and an empty
block is just a suite with no tests.

Blocks nest to any depth — a `describe`/`test`/`it` declared inside another
block becomes a child of it:

```ts
import { describe, expect, it } from "as-test";

describe("parser", () => {
  describe("numbers", () => {
    it("parses integers", () => {
      expect(parseInt("42")).toBe(42);
    });
  });
});
```

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

By default `beforeEach`/`afterEach` run around each test case (`test`, `it`,
`only`, and their skip variants) and **not** around grouping blocks like
`describe`. Pass an optional list of suite kinds to run around exactly those
kinds instead:

```ts
// Run before every `describe` AND every `test`.
beforeEach(() => {
  /* ... */
}, ["describe", "test"]);

// Run after each `test` only.
afterEach(() => {
  /* ... */
}, ["test"]);
```

## Logging

Use `log(value)` inside a test to capture a value. Anything `expect()` can
serialize is supported — primitives, strings, arrays, `Map`, `Set`, `Date`,
`ArrayBuffer`, typed arrays, and classes (via a generated or hand-written
`toJSON()`):

```ts
import { describe, expect, it, log } from "as-test";

describe("user", () => {
  it("builds a profile", () => {
    const profile = makeProfile();
    log(profile);
    expect(profile.id).toBe(7);
  });
});
```

After a run, as-test reports how many logs were captured and writes them to
`.as-test/logs/latest.log`, grouped by spec and de-duplicated across modes. Pass
`--show-logs` to print them at the end of the run instead. See the [CLI](./cli)
page.

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
