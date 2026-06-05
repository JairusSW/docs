# Runtime Behavior

A few internals worth knowing about — none are required for everyday use.

## The shared serialization buffer

`JSON.stringify` writes into a single shared, growable byte buffer (`bs`) rather than allocating per call, then hands back a string view of the result. This is why serialization is allocation-light: the buffer is reused across calls and only grows when an output needs more room.

Deserialization similarly uses scratch slices that point into the source string where possible, copying into fields only when needed (e.g. escaped strings).

## `JSON.internal`

`JSON.internal.stringify(...)` and `JSON.internal.parse(...)` are buffer-aware variants used **inside** custom serializers and deserializers. When your `@serializer` / `@deserializer` calls `JSON.stringify` / `JSON.parse`, the transform rewrites those nested calls to the `internal` versions so they save and restore the outer operation's buffer state instead of corrupting it.

You normally don't call these directly — write plain `JSON.stringify` / `JSON.parse` in custom methods and let the transform route them. See [Custom Serialization](../guide/custom-serialization).

## `JSON.Memory.shrink()`

The buffer tracks a typical output size (an exponential moving average) and can grow large for an occasional big payload. If you've serialized something unusually large and want to hand that memory back, call:

```ts
import { JSON } from "json-as";

JSON.stringify<i32[]>([1, 2, 3]);
JSON.Memory.shrink(); // release buffer capacity back toward the typical size
```

It's a manual hint; you rarely need it, and never for correctness — only to trim peak memory after a one-off large serialize.
