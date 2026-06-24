# Deterministic Mode

```bash
asb run --deterministic
```

Some routines call host imports whose results vary between iterations — clocks, randomness, I/O. That nondeterminism leaks into timing. Deterministic mode records the host-import call pattern once and replays it, so the measured time reflects pure wasm compute.

## How it works

The engine announces each routine invocation via an `iter()` import. The host then:

1. Keeps **iteration 1 live** so lazy initialization fires normally.
2. **Records** iteration 2's steady-state call pattern and memory diffs.
3. **Replays** that tape for every later iteration, verifying call order, tagged arguments, and full tape consumption.

If a routine's call pattern or pointer arguments differ between iterations, the run **fails loudly** with the diverging call index rather than reporting a misleading number.

## Constraints

- **Node host only** — replay wraps imports in-process. Combining `--deterministic` with an external runtime is an error.
- Per-iteration overhead is small (~3–5 ns). Engine timing stays live: deterministic builds route the engine's own clock through a passthrough import so only *your* host calls are recorded.
- **Compare deterministic runs only with other deterministic runs** — the recorded overhead is part of the number.

## When to use it

Reach for it when a bench touches the clock, RNG, or the filesystem and you want timing that reflects compute rather than host variance. For pure-compute benches it changes nothing and isn't needed.

```json
{ "modes": { "deterministic": { "deterministic": true } } }
```

```bash
asb run --mode deterministic
```

## Next

- [Multiple Runtimes & Modes](./multiple-runtimes)
- [Configuration](../configuration)
