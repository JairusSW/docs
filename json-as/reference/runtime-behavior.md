# Runtime Behavior

## `JSON.internal`

`JSON.internal.stringify(...)` and `JSON.internal.parse(...)` exist for nested use inside custom serializers and deserializers.

They preserve internal buffer state so nested custom flows do not corrupt the caller’s active slice.

## Shared buffer behavior

Serialization uses a shared internal buffer managed by `bs`.

Recent runtime work tightened:

- nested save/load behavior
- local string scratch slices during deserialization
- field writes from decoded scratch slices

## Adaptive buffer sizing

The buffer tracks typical output size with an exponential moving average and can shrink adaptively through `JSON.Memory.shrink()`.
