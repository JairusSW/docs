# Running Fuzzers

Run only fuzzers:

```bash
ast fuzz
ast fuzz parser
ast fuzz parser --runs 10000 --seed 42
ast fuzz parser --fuzzer parse-error
ast fuzz parser --runs 1.5x
ast fuzz parser --runs +10%
```

Run tests and fuzzers together:

```bash
ast test --fuzz
ast test --fuzz --fuzz-runs 10000 --fuzz-seed 42
ast test --fuzz parser --fuzzers parse-error,serialize-roundtrip
ast test --fuzz --fuzz-runs +100000
```

## Useful Flags

- `--runs <value>`
- `--seed <n>` (pins the seed; default uses a random seed each campaign)
- `--fuzzer <name[,name...]>`
- `--fuzzers <name[,name...]>`
- `--suite <name[,name...]>` (fuzz alias)
- `--suites <name[,name...]>` (fuzz alias)
- `--jobs <n>`
- `--build-jobs <n>`
- `--run-jobs <n>`
- `--mode <name[,name...]>`

`<value>` can be:

- an absolute run count like `500`
- a multiplier like `1.5x`
- an additive percentage like `+10%`
- an additive integer like `+100000`

## Notes

- fuzz targets currently build as `bindings`
- `xfuzz(...)` registers a skipped fuzz target
- `--fuzzer` and `--fuzzers` filter by normalized `fuzz("name", ...)` target names
- CLI run overrides apply to each fuzzer's effective base count, including
  fuzzers that set `operations` via either `fuzz(..., operations)` or
  `.generate(..., operations)`
- fuzz results are summarized separately from normal test totals
