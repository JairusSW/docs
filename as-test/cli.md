# CLI

The binary is available as both `ast` and `as-test`. Use `npx ast <command>` (or add scripts to `package.json`).

```bash
ast --version
ast --help
ast <command> --help
```

## Commands

| Command | Purpose |
| --- | --- |
| `ast test` | Build, then run specs. The everyday command. |
| `ast run` | Run already-built artifacts (skip the build). |
| `ast build` | Compile specs to wasm without running. |
| `ast fuzz` | Build and run fuzz targets. |
| `ast init` | Scaffold config, runners, and example specs. |
| `ast doctor` | Validate config, dependencies, and runtime. |
| `ast clean` | Remove build outputs, logs, coverage, and crashes. |

`test` builds and runs in one step; `run` expects artifacts to already exist (useful after a separate `build`). See [Getting Started](./getting-started) to scaffold a project.

## Common examples

```bash
ast test                       # build + run every spec
ast test math                  # only files matching "math"
ast test --parallel            # spread files across workers
ast test --watch               # re-run on change
ast test --mode node:bindings  # run a specific mode
ast test --fuzz                # specs, then fuzzers
ast test --show-coverage       # print uncovered points
ast fuzz --seed 1337           # reproducible fuzz campaign
```

## Shared flags

Available on most run-like commands (`test`, `run`, `fuzz`, `build`, `doctor`, `clean` as noted):

| Flag | Applies to | Effect |
| --- | --- | --- |
| `--mode <names>` | all | Run one or more named [modes](./runtimes/multiple-runtimes) (comma-separated). |
| `--config <path>` | all | Use a specific config file. |
| `--enable <list>` | build/run/test | Enable [features](./configuration#features) (e.g. `coverage`, `try-as`). |
| `--disable <list>` | build/run/test | Disable features. |
| `--jobs <n>` | build/run/test/fuzz | Run files through an ordered worker pool of size `n`. |
| `--build-jobs <n>` | build/run/test/fuzz | Cap concurrent builds (defaults to `--jobs`). |
| `--run-jobs <n>` | run/test/fuzz | Cap concurrent runs (defaults to `--jobs`). |
| `--list` | build/run/test/fuzz | Preview resolved files/artifacts without executing. |
| `--list-modes` | build/run/test/fuzz | Preview configured and selected mode names. |

## `ast test` and `ast run`

`test` accepts everything `run` does, plus the build and fuzz options below.

| Flag | Effect |
| --- | --- |
| `--parallel` | Run files through a worker pool sized automatically. |
| `--browser <name\|path>` | Browser for web modes: `chrome`, `chromium`, `firefox`, `webkit`, or a path. |
| `--create-snapshots` | Record [snapshots](./snapshots) that don't exist yet. |
| `--overwrite-snapshots` | Re-baseline snapshots on mismatch. |
| `--no-snapshot` | Skip snapshot assertions for this run. |
| `--show-coverage[=all]` | Print uncovered [coverage](./coverage) points; `=all` expands nested gaps. |
| `--suite <names>` | Filter to matching suite names or slug paths (alias `--suites`). |
| `--reporter <name\|path>` | Use `default`, `tap`, or a custom [reporter](./reporters) module. |
| `--tap` | Shortcut for `--reporter tap`. |
| `--verbose` | Keep expanded per-suite/test lines and live updates. |
| `--clean` | Disable in-place TTY updates; print final lines only. |

### Fuzz options (on `ast test`)

| Flag | Effect |
| --- | --- |
| `--fuzz` | Run fuzz targets after the test pass. |
| `--fuzz-runs <value>` | Override iteration count (`500`, `1.5x`, `+10%`, `+100000`). |
| `--fuzz-seed <n>` | Pin the fuzz base seed. |

### Watch mode

`ast test --watch` (or `-w`) re-runs on source or spec changes and exposes interactive keys:

| Key | Action |
| --- | --- |
| `w` | Toggle auto-run / manual mode. |
| `space` / `enter` | Retry failing specs. |
| `a` | Re-run all specs. |
| `ctrl+c` | Stop. |

## `ast fuzz`

| Flag | Effect |
| --- | --- |
| `--runs <value>` | Override iteration count (`500`, `1.5x`, `+10%`, `+100000`). |
| `--seed <n>` | Pin the base seed. |
| `--fuzzer <names>` | Filter to matching targets (aliases `--fuzzers`, `--suite`, `--suites`). |

See [Running Fuzzers](./fuzzing/running-fuzzers).

## `ast init`

| Flag | Effect |
| --- | --- |
| `--target <wasi\|bindings\|web>` | Build target. |
| `--example <minimal\|full\|none>` | Example spec template. |
| `--fuzz-example` / `--no-fuzz-example` | Include or omit the sample fuzzer. |
| `--enable <list>` / `--disable <list>` | Toggle features at scaffold time. |
| `--install` | Install dependencies afterward. |
| `--dir <path>` | Target directory. |
| `--yes`, `-y` | Non-interactive defaults. |
| `--force` | Overwrite managed files. |

## `ast doctor` and `ast clean`

Both take `--config` and `--mode`. `doctor` validates the project ([Doctor](./doctor)); `clean` removes configured outputs and, with no `--mode`, cleans every configured mode.

## Selectors

A positional argument filters which **files** run by substring; `--suite` filters which **suites** run within them by name or slug path.

```bash
ast test expectation                         # files matching "expectation"
ast run expectation --suite "expectations/toBe"  # one suite by slug
ast fuzz --fuzzer "addition"                 # fuzz targets by name
```

## Web modes

Web runs need a browser. Set it per mode (`runtime.browser`) or with `--browser`, and add `--headless` to the runner command for CI:

```bash
ast test --mode chromium:headless
ast test --mode firefox --browser /path/to/firefox
```
