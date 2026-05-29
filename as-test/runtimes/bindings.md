# Bindings: raw & esm

The `bindings` target emits an AssemblyScript bindings helper next to the wasm. That helper can be generated in two styles — **raw** and **esm** — and `as-test` drives each differently. Most projects never think about this; you only need it when you pass `@external` imports from JavaScript or hit a runtime limitation.

## raw (the default)

For `bindings` and `web` targets, `as-test` injects `--bindings raw` into the build automatically. A raw helper exports an `instantiate(module, imports)` function. The runtime host (`as-test/lib`) calls it, **merges in the imports it needs, and stubs any import the wasm declares but nothing provides**. That stubbing is what lets raw bindings supply or fake host functions — and it's why [import mocks](../mocking/import-mocks#runtime-support) that fall back to a real `@external` binding work under raw bindings.

You get raw bindings by default. Nothing to configure.

## esm

An esm helper auto-instantiates the moment it is imported, from a static `import`. It's convenient for shipping, but it gives the host no chance to inject imports: by the time your code runs, the module has already linked and instantiated.

Opt in by declaring it yourself in `buildOptions.args`:

```json
{
  "buildOptions": {
    "target": "bindings",
    "args": ["--bindings esm"]
  }
}
```

When you declare `--bindings` yourself — in `buildOptions.args` or in a referenced asconfig (`options.bindings`) — `as-test` **does not** add `--bindings raw` on top. It respects your choice. (Declaring both would make `asc` emit glue for both styles and confuse detection.)

## How the runtime tells them apart

`as-test/lib` inspects the helper to decide how to run it:

| Helper | Detected as | How it runs |
| --- | --- | --- |
| exports a `function instantiate` | `raw` | host calls `instantiate(module, imports)` and stubs missing imports |
| auto-instantiates (no exported `instantiate`) | `esm` | host imports the helper; it instantiates itself |
| no helper present | `none` | direct `WebAssembly.Instance` with stub imports |

## What esm can't do

Because esm links statically and instantiates itself, the host cannot supply virtual import modules. The practical consequences:

- **Custom `@external` imports** that aren't real, importable JS modules can't be provided — the static `import` fails to resolve.
- **Import mocks that retain a real binding** (i.e. specs using `unmockImport`) can't run, for the same reason. Pure `mockImport` specs are fine, because the transform removes the real binding entirely.

This mirrors the limits of standalone WASI engines, which also can't be handed host modules. See [Import Mocks → Runtime support](../mocking/import-mocks#runtime-support) for the full matrix and the file-splitting workaround.

## Choosing

- **Stay on raw** unless you have a specific reason not to — it's the default and the most capable for testing, since the host controls instantiation.
- **Use esm** when you're validating that your code works under esm-style bindings specifically, or your distribution uses them. Keep `unmockImport`-based specs out of esm modes.
