# Multi-Mode Config

One project can run against more than one target by defining named modes.

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "modes": {
    "wasi": {
      "buildOptions": {
        "target": "wasi"
      },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.wasi.js <file>"
        }
      }
    },
    "bindings": {
      "buildOptions": {
        "target": "bindings"
      },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.bindings.js <file>"
        }
      }
    }
  }
}
```

Run both:

```bash
ast test --mode wasi,bindings
```
