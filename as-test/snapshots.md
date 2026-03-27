# Snapshots

Snapshot assertions compare the current value to a stored snapshot.

Example:

```ts
import { test, expect } from "as-test";

test("serializes payload", () => {
  expect("hello").toMatchSnapshot("greeting");
});
```

Useful commands:

```bash
ast test
ast test --create-snapshots
ast test --overwrite-snapshots
ast test --no-snapshot
```

Behavior:

- snapshots are stored in the configured snapshot directory
- `--create-snapshots` writes missing values only
- `--overwrite-snapshots` replaces existing snapshot values on mismatch
- `--no-snapshot` disables snapshot assertions for the run

See also:

- [Configuration](./configuration.md)
- [CLI Guide](./cli.md)
