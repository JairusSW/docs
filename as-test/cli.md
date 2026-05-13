# CLI

## Main Commands

- `ast init`
- `ast build`
- `ast run`
- `ast test`
- `ast fuzz`
- `ast doctor`
- `ast clean`

## Common Examples

```bash
ast test
ast test math,array
ast test math --suite array-check
ast test --parallel
ast test --mode node:wasi,node:bindings
ast test --list

ast fuzz
ast fuzz parser --runs 5000 --seed 42
ast fuzz parser --fuzzer parse-error --runs 1
ast fuzz parser --runs 1.5x
ast fuzz parser --runs +10%

ast doctor
ast clean
ast clean --mode node:wasi
ast clean -f
```

## Shared Flags

- `--config <path>`
- `--mode <name[,name...]>`
- `--list`
- `--list-modes`
- `--help`

Modes with `default: false` are manual-only unless explicitly selected with `--mode`.

For `ast clean`, `default: false` is ignored. `ast clean` without `--mode` cleans every configured mode.

## `ast test`

Important flags:

- `--browser <name|path>`
- `--parallel`
- `--jobs <n>`
- `--build-jobs <n>`
- `--run-jobs <n>`
- `--create-snapshots`
- `--overwrite-snapshots`
- `--no-snapshot`
- `--show-coverage`
- `--enable <feature>`
- `--disable <feature>`
- `--fuzz`
- `--fuzz-runs <value>`
- `--fuzz-seed <n>` (pins seed; default is random per campaign)
- `--suite <name[,name...]>`
- `--suites <name[,name...]>`
- `--reporter <name|path>`
- `--tap`
- `--verbose`
- `--clean`

## `ast fuzz`

Important flags:

- `--runs <value>`
- `--seed <n>` (pins seed; default is random per campaign)
- `--fuzzer <name[,name...]>`
- `--fuzzers <name[,name...]>`
- `--suite <name[,name...]>` (fuzz alias)
- `--suites <name[,name...]>` (fuzz alias)
- `--jobs <n>`
- `--build-jobs <n>`
- `--run-jobs <n>`

Unlike `ast test`, `ast fuzz` does not currently expose a `--parallel` shortcut flag. Use the job flags directly.

For fuzz commands, `<value>` can be an absolute count like `500`, a multiplier
like `1.5x`, an additive percentage like `+10%`, or an additive integer like
`+100000`.

## `ast init`

Useful flags:

- `--dir <path>`
- `--target wasi|bindings|web`
- `--example minimal|full|none`
- `--fuzz-example`
- `--no-fuzz-example`
- `--install`
- `--yes`
- `--force`

## `ast clean`

Behavior:

- without `--mode`, `ast clean` removes configured build outputs, coverage outputs, crash artifacts, and logs for every configured mode
- without `-f` or `--force`, full clean prompts with `[Y/n]`
- with `--mode`, clean stays scoped to the selected mode(s)
- shared paths are skipped during scoped cleans unless every owning mode is selected

Examples:

- `ast clean`
- `ast clean -f`
- `ast clean --mode node:wasi`

## Selectors

Selectors can be:

- bare names resolved against configured input globs
- explicit file paths
- explicit globs
- comma-separated bare names such as `ast test math,array,string`

Suite and fuzzer filters are separate from file selectors:

- `ast run math --suite array-check`
- `ast run math --suite array-manipulation/array-check`
- `ast fuzz parser --fuzzer parse-error`
- `ast test --fuzz parser --fuzzers parse-error,serialize-roundtrip`

## Web Modes

For web targets, use `--browser <name|path>` or configure `runOptions.runtime.browser`.

Named browser values can be:

- `chrome`
- `chromium`
- `firefox`
- `webkit`

If no suitable browser is available, `as-test` can fall back to a Playwright-managed installation path.
