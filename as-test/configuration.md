# Configuration

Configuration lives in `as-test.config.json`. The bundled JSON Schema (`as-test.config.schema.json`) powers editor autocompletion — reference it with `$schema`:

```json
{
  "$schema": "node_modules/as-test/as-test.config.schema.json",
  "input": ["assembly/__tests__/*.spec.ts"],
  "output": ".as-test/",
  "buildOptions": { "target": "wasi" },
  "runOptions": {
    "runtime": { "cmd": "node ./.as-test/runners/default.wasi.js" }
  }
}
```

## Top-level fields

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `input` | `string[]` | `["./assembly/__tests__/*.spec.ts"]` | Globs for spec files. Negate with `!`. |
| `output` | `string \| object` | — | Output location ([alias](#output-paths)). |
| `outDir` | `string` | `./.as-test/build` | Compiled artifacts. |
| `logs` | `string \| "none"` | `./.as-test/logs` | Captured `log()` output, or `"none"`. |
| `coverageDir` | `string \| "none"` | `./.as-test/coverage` | Coverage artifacts, or `"none"`. |
| `snapshotDir` | `string` | `./.as-test/snapshots` | Stored snapshots. |
| `coverage` | `boolean \| object` | `false` | [Coverage](#coverage) settings. |
| `features` | `string[]` | `[]` | Enabled [features](#features). |
| `env` | `string \| string[] \| object` | `{}` | [Environment values](#environment-values). |
| `buildOptions` | `object` | — | [Build options](#build-options). |
| `runOptions` | `object` | — | [Run options](#run-options). |
| `fuzz` | `object` | — | [Fuzz config](#fuzz). |
| `modes` | `object` | `{}` | Named [modes](#modes). |
| `config` | `string` | `"none"` | Optional asconfig path passed to `asc`. |

## Output paths

`output` is a convenience alias. Use a single string for the root, or an object to place each artifact kind:

```json
{ "output": ".as-test/" }
```

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

The explicit fields (`outDir`, `logs`, `coverageDir`, `snapshotDir`) still work and override the alias when both are set. `ast clean` removes build, logs, and coverage from these locations (and the shared `fuzz.crashDir`).

## Environment values

`env`, `buildOptions.env`, and `runOptions.env` each accept three forms:

- a `.env` file path,
- an array of `KEY=value` strings,
- an object map.

```json
{ "env": { "LOG_LEVEL": "debug" } }
```

They merge together — top-level first, then build/run-specific, then mode overrides on top.

## Build options

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

| Field | Type | Purpose |
| --- | --- | --- |
| `target` | `"wasi" \| "bindings" \| "web"` | Build target (see [Targets & Runtimes](./runtimes/)). |
| `args` | `string[]` | Extra arguments passed to `asc`. |
| `cmd` | `string` | Replace the default build command entirely. |
| `env` | env | Build-only environment overrides. |

`buildOptions.cmd` supports the placeholders `<file>`, `<name>`, `<outFile>`, `<target>`, and `<mode>`.

> For `bindings`/`web` targets, `as-test` injects `--bindings raw` unless you declare `--bindings` yourself in `args` (or in a referenced asconfig). See [Bindings: raw & esm](./runtimes/bindings).

## Run options

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

| Field | Type | Purpose |
| --- | --- | --- |
| `runtime.cmd` | `string` | Runtime command. Supports `<file>` and `<name>`. |
| `runtime.browser` | `string` | Browser for web targets: `chrome`, `chromium`, `firefox`, `webkit`, or a path. |
| `reporter` | `string \| object` | [Reporter](./reporters) selection. |
| `env` | env | Run-only environment overrides. |

The generated runners are env-driven single-file scripts, so standard runner commands don't need a `<file>` argument. Reporter accepts `""`, `"default"`, `"tap"`, a custom module path, or an object — see [Reporters](./reporters).

## Coverage

Boolean shorthand or a detailed object:

```json
{
  "coverage": {
    "enabled": true,
    "mode": "project",
    "dependencies": ["json-as"],
    "includeSpecs": false,
    "include": [],
    "exclude": [],
    "ignore": { "labels": [], "names": [], "locations": [], "snippets": [] }
  }
}
```

| Field | Default | Purpose |
| --- | --- | --- |
| `enabled` | `false` | Turn coverage on. `"coverage": true` is shorthand for `{ enabled: true, mode: "project" }`. |
| `mode` | `"project"` | `project` = your sources only; `all` = include dependencies. |
| `dependencies` | `[]` | Package-name allowlist for dependency coverage. |
| `includeSpecs` | `false` | Include `*.spec.ts` files. |
| `include` / `exclude` | `[]` | Glob refinements applied after the above. |
| `ignore` | — | Drop points by `labels`, `names`, `locations`, or `snippets`. |

See [Coverage](./coverage) for details.

## Fuzz

Used by `ast fuzz` and `ast test --fuzz`:

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

| Field | Default | Purpose |
| --- | --- | --- |
| `input` | `["./assembly/__fuzz__/*.fuzz.ts"]` | Globs for fuzz targets. |
| `runs` | `1000` | Iterations per target. |
| `seed` | random | Base seed; omit for a fresh random seed each run. |
| `maxInputBytes` | `4096` | Max generated input size. |
| `target` | `"bindings"` | Fuzz builds require the bindings target. |
| `corpusDir` | `./.as-test/fuzz/corpus` | Seed corpus. |
| `crashDir` | `./.as-test/crashes` | Crash artifacts. |

## Features

`features` enables compiler-level capabilities:

```json
{ "features": ["try-as"] }
```

- `"try-as"` wires up the [try-as](/try-as/) transform — required for `try`/`catch`/`finally` and the [`toThrow`](./assertions/snapshots-and-throws#tothrow) matcher.
- Other names (e.g. `"simd"`, `"threads"`) are passed to `asc` as `--enable <name>`.

CLI `--enable` / `--disable` override the config list. In a mode, `features` **replaces** the base list entirely — set `"features": []` to disable everything for that mode.

## Modes

Modes let one project run against multiple targets or runtime commands. Each entry overrides the base config; a value can be an inline object or a string path to an external config file.

```json
{
  "modes": {
    "node:wasi": {
      "buildOptions": { "target": "wasi" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.wasi.js" } }
    },
    "node:bindings": {
      "buildOptions": { "target": "bindings" },
      "runOptions": { "runtime": { "cmd": "node ./.as-test/runners/default.bindings.js" } }
    },
    "chromium:headless": {
      "default": false,
      "buildOptions": { "target": "web" },
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

A mode can override `input`, output directories, `coverage`, `features`, `fuzz`, `buildOptions`, `runOptions`, and `env`.

- `"default": false` makes a mode manual-only — skipped on a bare `ast test`, runnable via `--mode`.
- When any modes are declared, an implicit `ast test` runs **only** those modes; the unnamed base config is not added on top. With no modes, the base config runs by itself.
- When multiple modes are active, output paths are namespaced by mode.
- `ast clean` cleans every configured mode when `--mode` is omitted, regardless of `default`.

See [Multiple Runtimes](./runtimes/multiple-runtimes) for the conceptual guide.
