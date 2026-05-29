# Writing Tests

A spec imports the APIs it needs from `as-test`, registers suites, and ends with `run()`. Everything in this page is exported from the package root.

```ts
import { describe, expect, test } from "as-test";

describe("math", () => {
  test("addition", () => {
    expect(2 + 2).toBe(4);
  });
});
```

## Suites and test cases

`describe`, `test`, and `it` all register a block with a description and a callback. `test` and `it` are interchangeable — use whichever reads better. Nest `describe` blocks to group related cases.

```ts
import { describe, expect, it, test } from "as-test";

describe("strings", () => {
  it("contains", () => {
    expect("assemblyscript").toContain("script");
  });

  test("prefix", () => {
    expect("as-test").toStartWith("as");
  });
});
```

| Function | Signature | Purpose |
| --- | --- | --- |
| `describe` | `describe(description, callback)` | Group related cases. |
| `test` | `test(description, callback)` | A single test case. |
| `it` | `it(description, callback)` | Alias for `test`. |

A suite passes when every assertion inside it passes. Assertions are independent — a later one still runs after an earlier one fails — so a single test can report multiple failures at once.

## Focus, skip, and todo

Prefix with `x` to skip, use `only` to focus, and `todo` to leave a placeholder.

```ts
only("runs in isolation", () => { /* ... */ });   // only focused cases run
xtest("temporarily disabled", () => { /* ... */ });
xdescribe("disabled group", () => { /* ... */ });
todo("write the overflow case");                   // no callback
```

| Function | Behavior |
| --- | --- |
| `only` | Focus this case; when any `only` exists, only focused cases run. |
| `xtest`, `xit` | Skip this case. |
| `xdescribe` | Skip this group. |
| `xonly` | A focused case that is also skipped. |
| `todo` | Record an unwritten case (description only). |

You can also skip a single assertion with `xexpect(...)` or `expect(...).skip()`.

## Hooks

Lifecycle hooks run setup and teardown around your blocks.

```ts
import { afterEach, beforeEach, describe, expect, test } from "as-test";

let count = 0;

beforeEach(() => { count = 0; });
afterEach(() => { /* assert invariants, clean up */ });

describe("counter", () => {
  test("increments", () => {
    count++;
    expect(count).toBe(1);
  });
});
```

| Hook | Signature | Runs |
| --- | --- | --- |
| `beforeAll` | `beforeAll(callback)` | Once before each group is run. |
| `afterAll` | `afterAll(callback)` | Once after each group is run. |
| `beforeEach` | `beforeEach(callback, kinds?)` | Before every matching block. |
| `afterEach` | `afterEach(callback, kinds?)` | After every matching block. |

By default `beforeEach` / `afterEach` fire around **test cases** (`test`, `it`, `only`, and their skip variants), not around `describe` groups. Pass an explicit `kinds` array to change what they wrap:

```ts
beforeEach(() => { /* ... */ }, ["describe", "test"]);
```

> `beforeAll` and `afterAll` each hold a single callback — calling them again replaces the previous one rather than queuing another.

## Logging

`log(value)` formats any value and prints it during the run. It uses the same serializer as assertions and snapshots, so objects, arrays, and classes with `toJSON()` render the way you'd expect.

```ts
import { log } from "as-test";

log("checkpoint");
log([1, 2, 3]);
```

Captured output is written under the configured `logs` directory. To silence `log()` for a run, pass `RunOptions` to an explicit `run()`:

```ts
import { run } from "as-test";

run({ log: false });
```

## Reading the active mode

A spec can tell which [mode](./runtimes/multiple-runtimes) it is running under via the exported `mode` value (and the `AS_TEST_MODE_NAME` constant). This is useful for guarding runtime-specific assertions:

```ts
import { expect, mode, test } from "as-test";

test("uses the active runtime", () => {
  if (mode == "node:wasi") {
    // assertions that only hold under WASI
  }
  expect(true).toBe(true);
});
```

## Filtering what runs

You rarely need to edit specs to run a subset — the CLI does it for you:

```bash
ast test math                      # only files matching "math"
ast run expectation --suite "expectations/toBe"   # one suite by slug
```

See [Selectors](./cli#selectors) for the full matching rules.

## Related

- [Assertions](./assertions/) — every matcher and modifier.
- [Snapshots](./snapshots) — assert against stored output.
- [Mocking](./mocking/) — replace functions and imports.
- [CLI](./cli) — filtering, watch mode, and flags.
