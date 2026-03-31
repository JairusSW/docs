# Coverage

Coverage is opt-in.

## Enable Coverage

From the CLI:

```bash
ast test --enable coverage
ast test --enable coverage --show-coverage
```

From config:

```json
{
  "coverage": true
}
```

Or with options:

```json
{
  "coverage": {
    "enabled": true,
    "includeSpecs": false,
    "include": ["assembly/**/*.ts"],
    "exclude": ["assembly/generated/**"]
  }
}
```

## Behavior

- coverage is disabled by default
- `--show-coverage` prints uncovered point details in the terminal
- coverage artifacts are written to `coverageDir`, which defaults to `./.as-test/coverage`
- include/exclude filters apply to the collected AssemblyScript source paths

## Related

- [Configuration](./configuration)
- [CLI](./cli)
