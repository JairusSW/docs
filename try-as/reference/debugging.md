# Debugging

## Transform diagnostics

- `DEBUG=1` enables transform diagnostics.
- `WRITE=pathA,pathB` writes transformed source snapshots as `*.tmp.ts`.

Example:

```bash
DEBUG=1 WRITE=./assembly/test.ts,~lib/map asc assembly/test.ts --transform try-as
```

## Transform modes

- `TRY_AS_REWRITE_STDLIB=0` disables stdlib throw rewriting.
- `TRY_AS_IMPORT_SCOPE=user` injects helper imports only into user sources.
- `TRY_AS_DIAGNOSTICS=1` prints active mode configuration at transform time.

Example:

```bash
TRY_AS_REWRITE_STDLIB=0 TRY_AS_IMPORT_SCOPE=user TRY_AS_DIAGNOSTICS=1 asc assembly/index.ts --transform try-as
```
