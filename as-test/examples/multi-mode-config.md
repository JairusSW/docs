# Multi-Mode Config

One project can run against more than one target by defining named modes.

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "modes": {
    "node:wasi": {
      "buildOptions": {
        "target": "wasi"
      },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.wasi.js"
        }
      }
    },
    "node:bindings": {
      "buildOptions": {
        "target": "bindings"
      },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.bindings.js"
        }
      }
    },
    "chromium:headless": {
      "default": false,
      "buildOptions": {
        "target": "web"
      },
      "runOptions": {
        "runtime": {
          "cmd": "node ./.as-test/runners/default.web.js --headless",
          "browser": "chromium"
        }
      }
    }
  }
}
```

Run both:

```bash
ast test --mode node:wasi,node:bindings
```
