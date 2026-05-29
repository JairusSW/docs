# Failure Reproduction

A fuzz failure is only useful if you can reproduce it. Because every input is derived from a seed, `as-test` reports the exact seed and input for each failure and writes crash artifacts you can replay.

## What a failure reports

When an iteration fails or crashes, the output records:

- the **run number** within the campaign,
- the **seed** that produced the input,
- the stringified **input** that triggered it,
- a ready-to-run **reproduction command**.

```text
FAIL  bounded integer addition
  run 412 / 1000
  seed 1337
  input (left=2147483647, right=1)
  repro: ast fuzz "bounded integer addition" --seed 1337
```

## Two ways to replay

**By seed** — re-run the whole campaign deterministically by pinning the base seed:

```bash
ast fuzz "bounded integer addition" --seed 1337
ast test --fuzz --fuzz-seed 1337
```

**By artifact** — each failing input is written under the configured `crashDir` (default `.as-test/crashes`) as a crash record containing the seed, the failing input, and the full failure list. Keep these in version control to guard against regressions.

## Crash artifacts

| Field | Contents |
| --- | --- |
| `failure` | The first failing run: its seed and input. |
| `failures` | Every failure observed in the campaign. |

Artifacts live in `fuzz.crashDir`; the seed corpus lives in `fuzz.corpusDir`. A full `ast clean` clears the crash directory. See [Configuration → fuzz](../configuration#fuzz).

## Tightening the loop

- Pin the seed (`--seed`) while you debug so each run is identical.
- Narrow with `--fuzzer <name>` to replay a single target.
- Once fixed, keep the crashing seed in a regression test or in the corpus so it keeps getting exercised.
