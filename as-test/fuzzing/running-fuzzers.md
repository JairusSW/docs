# Running Fuzzers

Run only fuzzers:

```bash
ast fuzz
ast fuzz parser
ast fuzz parser --runs 10000 --seed 42
```

Run tests and fuzzers together:

```bash
ast test --fuzz
ast test --fuzz --fuzz-runs 10000 --fuzz-seed 42
```

## Useful Flags

- `--runs <n>`
- `--seed <n>`
- `--jobs <n>`
- `--build-jobs <n>`
- `--run-jobs <n>`
- `--mode <name[,name...]>`

## Notes

- fuzz targets currently build as `bindings`
- `xfuzz(...)` registers a skipped fuzz target
- fuzz results are summarized separately from normal test totals
