# Doctor

`ast doctor` validates that a project is set up to build and run, without actually running the suite. Reach for it first when something won't start.

```bash
ast doctor
ast doctor --mode node:bindings
ast doctor --config ./as-test.ci.config.json
```

## What it checks

- **Config** — `as-test.config.json` exists and parses.
- **Node** — the running Node version is supported.
- **`assemblyscript`** — the compiler is installed in the project.
- **Per mode** — each selected mode merges cleanly, and:
  - for the `wasi` target, `@assemblyscript/wasi-shim` is installed;
  - the runtime command resolves (the runner exists or can be generated);
  - the `input` globs actually match files.

It exits non-zero if any check fails, so it works as a CI preflight.

## When to reach for it

- After `ast init`, to confirm the scaffold is complete.
- When a runtime command or runner path looks wrong.
- When the WASI target fails because `@assemblyscript/wasi-shim` is missing.
- When `input` matches nothing and a run reports zero files.
- In CI, before `ast test`, to fail fast with a clear message.

## Related

- [Getting Started](./getting-started) — scaffolding.
- [Configuration](./configuration) — the fields doctor validates.
- [Runtimes & Modes](./runtimes/) — targets and runner commands.
