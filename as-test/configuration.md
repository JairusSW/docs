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
      "cmd": "node ./.as-test/runners/default.wasi.js"
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

`ast clean` removes build, logs, and coverage outputs from these configured locations. A full `ast clean` also clears the shared `fuzz.crashDir`.

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
      "cmd": "node ./.as-test/runners/default.wasi.js",
      "browser": ""
    },
    "reporter": "default",
    "env": {}
  }
}
```

The default generated runners are env-driven single-file scripts. Standard runner commands do not need a `<file>` argument.

Reporter values can be:

- `""`
- `"default"`
- `"tap"`
- a custom module path
- an object with `name`, `options`, `outDir`, and `outFile`

## Coverage Options

```json
{
  "coverage": {
    "enabled": true,
    "mode": "project",
    "dependencies": ["json-as"],
    "includeSpecs": false,
    "include": [],
    "exclude": [],
    "ignore": {
      "labels": [],
      "names": [],
      "locations": [],
      "snippets": []
    }
  }
}
```

Notes:

- `coverage: true` is a shortcut for enabling coverage with `mode: "project"`
- `mode` can be:
  - `project`: project files only
  - `all`: project files and dependency files
- `dependencies` is a package-name allowlist for dependency coverage
  - use names like `json-as` or `@scope/pkg`
  - this works for both normal installs and `pnpm` installs
- `includeSpecs` controls whether `*.spec.ts` files are eligible for coverage
- `include` and `exclude` refine the final eligible file set after `mode`, `dependencies`, and `includeSpecs`
- AssemblyScript stdlib files are still excluded

## Fuzz Options

```json
{
  "fuzz": {
    "input": ["./assembly/__fuzz__/*.fuzz.ts"],
    "runs": 1000,
    "maxInputBytes": 4096,
    "target": "bindings",
    "corpusDir": "./.as-test/fuzz/corpus",
    "crashDir": "./.as-test/crashes"
  }
}
```

Notes:

- fuzz builds currently require `target: "bindings"`
- `seed` is optional; if omitted, each campaign uses a random base seed
- failures and crashes are written under `crashDir`

## Modes

Modes let one project run against multiple targets or runtime commands.

```json
{
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

Mode entries can override:

- output directories
- coverage config
- build options
- runtime config
- reporter config
- mode-level environment variables

Set `default: false` on a mode to make it manual-only. When `--mode` is omitted, modes with `default: false` are skipped.

When the config declares any modes, only those modes run on an implicit
`ast test` — the unnamed base config is not added on top. If no modes are
declared at all, the base config runs by itself. Modes that don't override
`runOptions` inherit the runner from the base config.

`ast clean` is the exception: when `--mode` is omitted, it cleans every configured mode regardless of `default: false`.

When multiple modes are active, output paths are namespaced by mode when needed.
