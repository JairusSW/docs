# Configuration

The config file is `as-test.config.json`.

The schema file in this repo is `as-test.config.schema.json`.

## Minimal Example

```json
{
  "input": ["assembly/__tests__/*.spec.ts"],
  "output": ".as-test/",
  "buildOptions": {
    "target": "wasi"
  },
  "runOptions": {
    "runtime": {
      "cmd": "node ./.as-test/runners/default.wasi.js <file>"
    }
  }
}
```

## Top-Level Fields

Common top-level fields:

- `input`
- `output`
- `outDir`
- `logs`
- `coverageDir`
- `snapshotDir`
- `coverage`
- `env`
- `buildOptions`
- `runOptions`
- `fuzz`
- `modes`

## Output Paths

You can use the older individual path fields, or the newer `output` alias.

String form:

```json
{
  "output": ".as-test/"
}
```

Object form:

```json
{
  "output": {
    "build": "./.as-test/build",
    "logs": "./.as-test/logs",
    "coverage": "./.as-test/coverage",
    "snapshots": "./.as-test/snapshots"
  }
}
```

Legacy explicit fields like `outDir`, `logs`, `coverageDir`, and `snapshotDir` still work and override the alias when both are present.

## Environment Values

`env`, `buildOptions.env`, and `runOptions.env` can each be:

- a `.env` file path
- an array of `KEY=value` strings
- an object map

These values merge together, with mode overrides applied on top.

## Build Options

```json
{
  "buildOptions": {
    "target": "wasi",
    "args": [],
    "cmd": "",
    "env": {}
  }
}
```

Supported targets:

- `wasi`
- `bindings`
- `web`

`buildOptions.cmd` replaces the default build command path and supports placeholders such as `<file>`, `<name>`, `<outFile>`, `<target>`, and `<mode>`.

## Run Options

```json
{
  "runOptions": {
    "runtime": {
      "cmd": "node ./.as-test/runners/default.wasi.js <file>",
      "browser": ""
    },
    "reporter": "default",
    "env": {}
  }
}
```

Reporter values can be:

- `""`
- `"default"`
- `"tap"`
- a custom module path
- an object with `name`, `options`, `outDir`, and `outFile`

## Fuzz Options

```json
{
  "fuzz": {
    "input": ["./assembly/__fuzz__/*.fuzz.ts"],
    "runs": 1000,
    "seed": 1337,
    "maxInputBytes": 4096,
    "target": "bindings",
    "corpusDir": "./.as-test/fuzz/corpus",
    "crashDir": "./.as-test/crashes"
  }
}
```

Notes:

- fuzz builds currently require `target: "bindings"`
- `seed` is the deterministic base seed
- failures and crashes are written under `crashDir`

## Modes

Modes let one project run against multiple targets or runtime commands.

```json
{
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

Mode entries can override:

- output directories
- coverage config
- build options
- runtime config
- reporter config
- mode-level environment variables

When multiple modes are active, output paths are namespaced by mode when needed.
