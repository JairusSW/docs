# Limitations

- The selective catch directive must be written exactly as `// @try-as: throw,abort,unreachable` with the chosen kinds, immediately above the `try`.
- Runtime and internal trap paths are intentionally not rewritten.
- Exceptions from these internals are not catchable by `try-as`:
  - `~lib/rt`
  - `~lib/shared`
  - `~lib/wasi_`
  - `~lib/performance`
- This library handles transformed `throw` and `abort` flows, not low-level Wasm traps like out-of-bounds memory faults.
- `throw err;` becomes `err.rethrow();` when `err` is statically typed as `Exception`.
