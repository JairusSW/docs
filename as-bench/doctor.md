# Doctor

```bash
asb doctor
asb doctor --mode wasmtime
```

`asb doctor` is a preflight check — it validates your environment before you spend time on a run, and reports each check as a pass/fail line.

It validates:

- **Config** — that `as-bench.config.json` (or `--config`) loads and parses, and that the selected `--mode` exists.
- **Dependencies** — Node and the AssemblyScript compiler / dev dependencies are present.
- **Input** — the `input` globs actually match bench files.
- **Runtimes** — the selected runtime command(s) are resolvable and runnable.

```text
as-bench doctor
config: /path/to/as-bench.config.json
mode: default

 OK  Config loaded
      as-bench.config.json
 OK  Benchmark files found
 OK  Runtime: node
```

Run it after `asb init`, when switching runtimes, or when a run fails in a way that points at setup rather than code. It accepts `--config` and `--mode` like the other commands.

## See also

- [Configuration](./configuration) — the fields doctor validates.
- [Runtimes](./runtimes/) — the runtime commands it checks.
