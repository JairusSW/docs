# Running Fuzzers

Run fuzz targets on their own, or after your normal test pass.

```bash
ast fuzz                 # run every fuzz target
ast test --fuzz          # run specs first, then fuzzers
```

## Useful flags

### `ast fuzz`

| Flag | Effect |
| --- | --- |
| `--runs <value>` | Override the iteration count (see formats below). |
| `--seed <n>` | Pin the base seed for a reproducible campaign. |
| `--fuzzer <name[,name...]>` | Run only matching targets (alias: `--fuzzers`, `--suite`). |
| `--mode <name[,name...]>` | Run under specific [modes](../runtimes/multiple-runtimes). |
| `--jobs <n>` | Spread targets across a worker pool. |
| `--list` | Preview the resolved fuzz files without running. |

### `ast test --fuzz`

| Flag | Effect |
| --- | --- |
| `--fuzz` | Run fuzz targets after the test pass. |
| `--fuzz-runs <value>` | Override the iteration count for this run. |
| `--fuzz-seed <n>` | Pin the base seed for this run. |

## Run count formats

`--runs` and `--fuzz-runs` accept an absolute count or an adjustment relative to the configured `fuzz.runs`:

| Value | Meaning |
| --- | --- |
| `500` | Exactly 500 iterations. |
| `1.5x` | 1.5× the configured count. |
| `+10%` | 10% more than configured. |
| `+100000` | 100,000 more than configured. |

```bash
ast fuzz --runs 5000
ast fuzz --runs 2x --seed 1337
ast test --fuzz --fuzz-runs +50%
```

## Filtering targets

```bash
ast fuzz parser              # files matching "parser"
ast fuzz --fuzzer "addition" # targets whose name matches
```

## Notes

- Fuzz builds require the **bindings** target (`fuzz.target` is `"bindings"`). This is independent of the target your specs use.
- If no `fuzz.seed` is configured and you don't pass `--seed`, each campaign picks a random base seed — printed in the output so you can pin it later.
- Configure counts, input size, corpus, and crash output under the [`fuzz`](../configuration#fuzz) config block.
