# Coverage

Coverage is opt-in.

## Enable Coverage

From the CLI:

```bash
ast test --enable coverage
ast test --enable coverage --show-coverage
ast test --enable coverage --show-coverage=all
```

From config:

```json
{
  "coverage": true
}
```

That defaults to project-only coverage.

Or with options:

```json
{
  "coverage": {
    "enabled": true,
    "mode": "project",
    "dependencies": ["json-as"],
    "includeSpecs": false,
    "include": ["assembly/**/*.ts"],
    "exclude": ["assembly/generated/**"]
  }
}
```

## Coverage Modes

- `project`
  - covers project source files only
  - excludes dependency files under `node_modules` by default
- `all`
  - covers project files and dependency files
  - still excludes AssemblyScript stdlib files

If you only want specific dependencies while staying in project mode, list package names in `coverage.dependencies`.
This works for both normal installs and `pnpm` layouts.

## Behavior

- coverage is disabled by default
- `coverage: true` is equivalent to enabling coverage with `mode: "project"`
- `--show-coverage` prints uncovered point details in the terminal
- `--show-coverage=all` expands nested uncovered points instead of collapsing them
- `--verbose` also expands nested uncovered points
- coverage artifacts are written to `coverageDir`, which defaults to `./.as-test/coverage`
- `include` and `exclude` filters apply after broad file eligibility (`mode`, `dependencies`, `includeSpecs`)

## Related

- [Configuration](./configuration)
- [CLI](./cli)
