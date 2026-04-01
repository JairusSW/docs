# CLI

## Main Commands

- `ast init`
- `ast build`
- `ast run`
- `ast test`
- `ast fuzz`
- `ast doctor`

## Common Examples

```bash
ast test
ast test math,array
ast test --parallel
ast test --mode wasi,bindings
ast test --list

ast fuzz
ast fuzz parser --runs 5000 --seed 42
ast fuzz parser --runs 1.5x
ast fuzz parser --runs +10%

ast doctor
```

## Shared Flags

- `--config <path>`
- `--mode <name[,name...]>`
- `--list`
- `--list-modes`
- `--help`

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
- `--fuzz-seed <n>`
- `--reporter <name|path>`
- `--tap`
- `--verbose`
- `--clean`

## `ast fuzz`

Important flags:

- `--runs <value>`
- `--seed <n>`
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

## Selectors

Selectors can be:

- bare names resolved against configured input globs
- explicit file paths
- explicit globs
- comma-separated bare names such as `ast test math,array,string`

## Web Modes

For web targets, use `--browser <name|path>` or configure `runOptions.runtime.browser`.

Named browser values can be:

- `chrome`
- `chromium`
- `firefox`
- `webkit`

If no suitable browser is available, `as-test` can fall back to a Playwright-managed installation path.
