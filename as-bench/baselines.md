# Baselines

A baseline is a saved run — the raw samples for every bench, stored as JSON under `baselineDir` (default `.as-bench/baselines/`). Save one, then compare a later run against it to catch regressions, or diff two saved baselines in CI without re-running.

## Save a baseline

```bash
asb run --save-baseline main
```

This runs normally and writes `.as-bench/baselines/main.json`. Commit baselines alongside your code so comparisons are reproducible:

```bash
git add .as-bench/baselines/main.json
```

## Compare a live run against a baseline

```bash
asb run --baseline main
```

Each bench is measured fresh and compared against its saved counterpart. The delta uses Welch's t-test plus a permutation p-value, and the verdict follows the same significant-and-outside-noise rule as [suite deltas](./statistics#suites-and-deltas).

> Comparison requires the **node** host (it works request/reply in-process). External runtimes can still `--save-baseline`, but not `--baseline`. If the saved baseline's sample count differs from the current run, that bench's comparison is skipped with a warning — keep `--samples` (or the defaults) consistent across saves.

## Diff two saved baselines

`asb compare` diffs two stored baselines without running anything — ideal for async CI workflows where one job saves `main` and another saves the PR:

```bash
asb compare main dev
asb compare main dev --mode quick   # use that mode's baselineDir / thresholds
```

It prints a per-bench delta, p-value, and a faster / slower / no-change verdict for every bench present in both baselines.

| Flag | Effect |
| --- | --- |
| `--significance <x>` | p-value threshold for "changed" (default from config, `0.05`). |
| `--noise <x>` | Ignore changes whose CI lies within ±x (default `0.01`). |
| `--config <path>` | Use a specific config file. |
| `--mode <name>` | Apply a config overlay (for `baselineDir` / `render` thresholds). |

## A CI recipe

```bash
# on main
asb run --save-baseline main
git commit .as-bench/baselines/main.json

# on a PR
asb run --baseline main          # fail review if anything regressed
# or, comparing two pre-saved runs:
asb compare main pr
```

## Next

- [Statistics & Output](./statistics) — how deltas and verdicts are computed.
- [Configuration](./configuration) — set `baselineDir` and `render` thresholds.
