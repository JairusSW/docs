# Import Mocks

`mockImport` replaces a host import — a function the runtime provides via `@external` — with your own implementation. Imports are identified by their `"module.name"` string.

```ts
// assembly/host.ts
@external("env", "now")
export declare function now(): i64;
```

```ts
import { expect, mockImport, test, unmockImport } from "as-test";
import { now } from "./host";

mockImport("env.now", (): i64 => 1_700_000_000_000);

test("reads the mocked host clock", () => {
  expect(now()).toBe(1_700_000_000_000);
});

unmockImport("env.now");
```

## Signatures

| Function | Signature | Effect |
| --- | --- | --- |
| `mockImport` | `mockImport(name, replacement)` | Route the import `name` (`"module.export"`) through `replacement`. |
| `unmockImport` | `unmockImport(name)` | Stop mocking `name` and fall back to the real import. |

Like [function mocks](./function-mocks), import mocks apply in source order and are not reset per test.

## Good uses

- Host functions that touch the clock, randomness, the network, or the filesystem.
- `@external` imports whose real implementation isn't linked into a test build.
- Forcing an error path from a dependency you don't control.

A common pattern is to route all host access through a small wrapper module and mock that module's imports, keeping mock strings in one place.

## Runtime support

Whether a spec can run on a given runtime depends on **how** it mocks an import — because the transform changes the compiled wasm:

- **Mocked only** (you never call `unmockImport` for it): the real `@external` binding is removed from the wasm. The spec needs nothing from the host and runs on **every** runtime.
- **Unmocked somewhere** (you call `unmockImport` for it): the real binding is kept so calls can fall back to it. The wasm now imports that symbol, so the **host must supply it**.

That second case is only satisfiable on runtimes where `as-test` controls instantiation and can stub or provide imports — the **WASI runner** (`node:wasi`) and **raw bindings**. It is *not* satisfiable under:

- **esm bindings** — the generated helper auto-instantiates from a static `import`, so there's no hook to inject a virtual module;
- **standalone WASI runtimes** (`wasmtime`, `wasmer`, `wazero`) — no mechanism to supply a host module.

| Spec uses… | WASI runner | raw bindings | esm bindings | wasmtime / wasmer / wazero |
| --- | :---: | :---: | :---: | :---: |
| `mockImport` only | ✅ | ✅ | ✅ | ✅ |
| `mockImport` + `unmockImport` | ✅ | ✅ | ❌ | ❌ |

### Keeping specs portable

If you want a suite to run everywhere, split the two cases into separate spec files: keep `unmockImport`-based fallback tests in their own file, and exclude that file from the affected modes via the mode's `input` globs.

```jsonc
"node:bindings:esm": {
  "buildOptions": { "target": "bindings", "args": ["--bindings esm"] },
  "input": ["assembly/__tests__/**/*.spec.ts", "!**/unmock.spec.ts"]
}
```

`unmockFn` is unaffected — only `unmockImport` retains a host binding. See [Bindings](../runtimes/bindings) for how raw vs. esm bindings differ.

## Tips

- Mock the narrowest import that isolates the behavior under test.
- Re-mock after `unmockImport` if you only wanted to swap implementations, rather than reaching the real host.
- Keep `"module.name"` strings as constants so a rename doesn't silently stop matching.
