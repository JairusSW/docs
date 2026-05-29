# Mocking

Mocking replaces a dependency so a test can exercise the code around it in isolation. `as-test` rewrites mock calls at compile time through its transform, so there is no runtime injection framework to configure.

There are three tools, in rough order of how often you'll reach for them:

| Tool | Replaces | Page |
| --- | --- | --- |
| `mockFn` / `unmockFn` | a local function | [Function Mocks](./function-mocks) |
| `mockImport` / `unmockImport` | a host import (`@external`) | [Import Mocks](./import-mocks) |
| `snapshotFn` | a value-producing callback | [Stable Values](./stable-values) |

## When to mock

Mock the smallest thing that makes the test deterministic and fast:

- a function that hits the clock, randomness, or the host environment;
- an `@external` import whose real implementation isn't available in a test build;
- an expensive computation you want to pin to a fixed value.

Leave everything else real. Over-mocking tests your mocks instead of your code.

## How it works (and why it matters)

Mocks are applied **in source order**: a `mockFn` or `mockImport` affects call sites that appear after it, and the matching `unmockFn` / `unmockImport` restores the original from that point on. There is no per-test reset — set up and tear down explicitly where you want the boundary.

The transform is also why mocking has a runtime dimension. An import that is **only ever mocked** has its real `@external` binding removed from the wasm entirely. An import that you `unmockImport` somewhere keeps that real binding so the call can fall back to it — which means the host has to supply it. That distinction decides which runtimes a spec can run on; [Import Mocks → Runtime support](./import-mocks#runtime-support) covers it in full.

## Related

- [Function Mocks](./function-mocks)
- [Import Mocks](./import-mocks)
- [Stable Values](./stable-values)
- [Runtimes & Modes](../runtimes/) — where mock behavior and runtime choice intersect.
