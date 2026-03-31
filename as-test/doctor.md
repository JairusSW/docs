# Doctor

Use `ast doctor` when setup feels wrong before you start debugging tests themselves.

```bash
ast doctor
ast doctor --config ./as-test.config.json
ast doctor --mode wasi,bindings
```

## What It Checks

- config validation
- discovered spec files
- dependency availability
- runtime command shape
- runner existence for default runtime paths
- mode-specific setup problems

## When To Reach For It

Use `ast doctor` when you see:

- config parse errors
- no files discovered
- bad runtime commands
- missing generated runner scripts
- target-specific setup mismatches

It is the quickest way to get a path-specific validation error instead of guessing which field is wrong.
