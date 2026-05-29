# Coverage

Coverage reports which parts of your code the tests actually exercised. `as-test` instruments source at compile time, records which points executed, and filters the results in the CLI.

## Enable it

Per run:

```bash
ast test --enable coverage
ast test --enable coverage --show-coverage      # print uncovered points
ast test --enable coverage --show-coverage=all  # expand nested gaps
```

Or in config:

```json
{ "coverage": true }
```

`"coverage": true` is shorthand for `{ "enabled": true, "mode": "project" }`. Use the object form for finer control ([Configuration → coverage](./configuration#coverage)).

## What gets measured

Instrumentation tracks branch-level points, not just lines:

| Point type | Covers |
| --- | --- |
| `Function` | function entry |
| `Return` | each return value |
| `IfBranch` | `if` / `else` arms |
| `Loop` | `for` / `while` / `do` bodies |
| `Ternary` | both arms of `?:` |
| `Assignment` | assignment right-hand sides |
| `Throw` | `throw` statements |

The summary shows per-file percentages; `--show-coverage` lists the points that never executed so you can see exactly what's untested.

## Coverage modes

| Mode | Includes |
| --- | --- |
| `project` (default) | your project sources only |
| `all` | project sources **and** dependency sources |

```json
{ "coverage": { "enabled": true, "mode": "all" } }
```

In `project` mode you can still opt specific dependencies in by package name:

```json
{
  "coverage": {
    "enabled": true,
    "mode": "project",
    "dependencies": ["json-as", "@scope/pkg"]
  }
}
```

Names work for normal and `pnpm` installs, and for the `~lib/<pkg>` paths AssemblyScript uses internally.

## Refining the file set

After `mode` and `dependencies` decide the broad set, narrow it further:

| Option | Effect |
| --- | --- |
| `includeSpecs` | Include `*.spec.ts` files (default `false`). |
| `include` | When non-empty, only files matching these globs are eligible. |
| `exclude` | Files matching these globs are dropped. |

AssemblyScript standard-library files (`~lib/array.ts`, etc.) are always excluded; third-party packages under `~lib/<pkg>/…` are treated as dependencies, not stdlib, so they follow the `mode` / `dependencies` rules.

## Ignoring individual points

When a point is intentionally untested (an unreachable guard, a debug-only branch), drop it without excluding the whole file:

```json
{
  "coverage": {
    "enabled": true,
    "ignore": {
      "labels": ["Constructor"],
      "names": ["debug*"],
      "locations": ["assembly/legacy.ts:*"],
      "snippets": ["unreachable()"]
    }
  }
}
```

| Rule | Matches a point by |
| --- | --- |
| `labels` | its kind (e.g. `Call`, `Method`, `Constructor`, `Property`, `Function`) |
| `names` | the symbol name (glob) |
| `locations` | `file:line:column` (glob) |
| `snippets` | the trimmed source snippet (glob) |

## Artifacts

Coverage artifacts are written under `coverageDir` (default `.as-test/coverage`), or set it to `"none"` to skip writing files while still printing the summary.

## Related

- [Configuration → coverage](./configuration#coverage)
- [Multiple Runtimes](./runtimes/multiple-runtimes) — coverage can be set per mode.
