# Mocking

`as-test` supports a few different kinds of controlled test substitution:

- local function mocking with `mockFn(...)`
- import-path mocking with `mockImport(...)`
- stable captured values with `snapshotFn(...)`

Use mocks selectively. The value of `as-test` is that you can often run against the real runtime and only replace the edge you actually need to control.

## Start Here

- [Function Mocks](./function-mocks)
- [Import Mocks](./import-mocks)
- [Stable Values With `snapshotFn`](./stable-values)

## When To Mock

Good reasons to mock:

- host imports
- clocks and random sources
- hard-to-reproduce runtime failures
- expensive or noisy dependencies
- values that should stay fixed for one test run
