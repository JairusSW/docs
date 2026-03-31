# Failure Reproduction

Each fuzz campaign starts from a base seed. Individual iterations derive from `seed + n`.

When a fuzzer fails, `as-test` reports:

- the base repro command
- the exact failing seeds
- one-run repro commands like `ast fuzz ... --seed <seed+n> --runs 1`
- the captured `run(...)` inputs in `.as-test/crashes`

## Why This Matters

This makes failures easier to replay in two different ways:

1. rerun the exact failing iteration by seed
2. inspect the captured input payload even if the generator has side effects

## Example Output

```text
Failing seeds: 8, 9, 10
Repro 2: ast fuzz assembly/__fuzz__/parser.fuzz.ts --seed 8 --runs 1
Input 2: [0]
```

## Crash Artifacts

Crash metadata is written under the configured `crashDir`, which defaults to `./.as-test/crashes`.

Each failure record includes:

- mode
- first failing seed
- repro command
- first assertion failure details
- the list of failing seeds and captured inputs
