# Snapshots

Snapshots compare the serialized current value to a stored value under your snapshot directory.

## Basic Usage

```ts
import { expect, test } from "as-test";

test("serializes payload", () => {
  expect("hello").toMatchSnapshot("greeting");
});
```

## Commands

```bash
ast test
ast test --create-snapshots
ast test --overwrite-snapshots
ast test --no-snapshot
```

## Behavior

- snapshots are stored under `snapshotDir`, which defaults to `./.as-test/snapshots`
- `--create-snapshots` creates missing entries only
- `--overwrite-snapshots` updates mismatched entries
- `--no-snapshot` disables snapshot assertions for that run
- snapshot files are readable `.snap` text files

## When To Use Them

Snapshots work well for:

- structured output
- generated text
- serialized records
- mocked host output
- results that would be noisy to assert field-by-field

## Related

- [Assertions](./assertions/)
- [Configuration](./configuration)
- [CLI](./cli)
