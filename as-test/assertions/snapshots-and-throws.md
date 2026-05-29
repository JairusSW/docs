# Snapshots & Throws

## `toMatchSnapshot`

Serialize a value and assert it matches a stored snapshot. The first run records the snapshot; later runs compare against it.

```ts
expect(renderTable(data)).toMatchSnapshot();         // unnamed
expect(config).toMatchSnapshot("default-config");    // named
```

Unnamed snapshots within a suite are numbered in order (`#1`, `#2`, …); named snapshots use the name you pass. Snapshot identity also includes the file and the suite nesting path, so the same name in different suites stays distinct.

Snapshots are created and updated from the CLI, not by editing files by hand:

```bash
ast test --create-snapshots      # record missing snapshots
ast test --overwrite-snapshots   # accept new output as the baseline
ast test --no-snapshot           # skip snapshot assertions this run
```

See [Snapshots](../snapshots) for storage format and workflow.

## `toThrow`

Assert that a function throws when called. The value under test must be a `() => void` callback — `toThrow` invokes it and checks whether it threw:

```ts
expect((): void => {
  throw new Error("boom");
}).toThrow();

expect((): void => parse("not json")).toThrow("invalid input");
```

> `toThrow` depends on the [`try-as`](/try-as/) feature, which rewrites throwable code so exceptions can be intercepted. Enable it in config (`"features": ["try-as"]`) or per run (`--enable try-as`). Without it, `toThrow` reports a failure explaining that try-as is required. See [Configuration → features](../configuration#features).
